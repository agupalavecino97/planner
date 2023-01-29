import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Activity } from '../../models/Activity';
import { MatDialog } from '@angular/material/dialog';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ActivityService } from '../../services/activity.service';

export interface ActivityList {
  id: number;
  name: string;
  activities: Array<Activity>;
}

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  public list: Array<ActivityList> = [
    {
      id: 1,
      name: 'Sin Fecha asiganada',
      activities: [],
    },
    {
      id: 2,
      name: '',
      activities: [],
    },
    {
      id: 3,
      name: '',
      activities: [],
    },
    {
      id: 4,
      name: '',
      activities: [],
    },
  ];
  public firstDateStored: Date = new Date();
  public activity: Activity | undefined;
  public loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private activityService: ActivityService
  ) {
    this.activity = new Activity();
  }

  ngOnInit() {
    this.loading = true;
    this.activityService.getActivities().subscribe((res: any) => {
      if (!res.error) {
        this.armarListado(Activity.parseArray(res));
        this.loading = false;
      } else {
        console.log("error: ", res.error);
      }
    });
    this.activityService.emitAgregarProducto$.subscribe((res) => {
      if (res) {
        console.log(res);
        this.openFormAcrtivity();
      }
    });
  }

  armarListado(data: Array<Activity>) {
    data.sort((a, b) => {
      if (a.startDate && b.startDate && a.startDate > b.startDate) {
        return 1;
      }
      if (a.startDate && b.startDate && a.startDate < b.startDate) {
        return -1;
      }
      return 0;
    });
    let lastDate = new Date();
    let index = 0;
    let days = 3;
    let firsdateStored = false;
    data.forEach((elem: Activity) => {
      if (elem.startDate != null) {
        if (elem.startDate.getDate() === lastDate.getDate()) {
          this.list[index].activities.push(elem);
        } else {
          index += 1;
          lastDate = elem.startDate;
          if (!firsdateStored) {
            this.firstDateStored = new Date(elem.startDate);
            firsdateStored = true;
          }
          this.list[index].name =
            elem.startDate.getDate() +
            ' de ' +
            meses[elem.startDate.getMonth()];
          this.list[index].activities.push(elem);
          days -= 1;
        }
      } else {
        this.list[0].activities.push(elem);
      }
    });
    if (days > 0) {
      while (days > 0) {
        let day = new Date();
        day.setDate(lastDate.getDate() + 1);
        index += 1;
        this.list[index].name = day.getDate() + ' de ' + meses[day.getMonth()];
        lastDate = day;
        days -= 1;
      }
    }
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openFormAcrtivity(): void {
    if (this.loading) {
      return;
    }
    const dialogRef = this.dialog.open(ActivityFormComponent, {
      data: { activity: this.activity, firstDate: this.firstDateStored },
      width: '50em',
      height: '100%',
      position: { right: '0' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!result.activityId || result.activityId === null) {
          if (result.startDateMoment) {
            result.startDate = result.startDateMoment.toDate();
            result.endDate = result.endDateMoment.toDate();
          }
          let new_activity = Activity.parseItem(result);
          new_activity.activityId = new Date().getTime();
          new_activity.status = null;
          if (new_activity.startDate === null) {
            this.list[0].activities.push(new_activity);
          } else {
            let daysdiff =
              (new_activity.endDate!.getTime() -
                new_activity.startDate!.getTime()) /
                (1000 * 60 * 60 * 24) +
              1;
            let dateToCompare = new Date();
            dateToCompare.setDate(new_activity.startDate!.getDate());
            let index = 1;
            while (daysdiff > 0) {
              if (
                this.list[index].name.includes(
                  dateToCompare.getDate().toString()
                )
              ) {
                this.list[index].activities.push(new_activity);
                this.ordenarPorFecha(index);
                daysdiff = daysdiff - 1;
                let newDate = new Date();
                newDate.setDate(dateToCompare.getDate() + 1);
                dateToCompare = newDate;
              }
              index = index + 1;
            }
          }
        } else {
          if (result.startDateMoment) {
            result.startDate = result.startDateMoment.toDate();
            result.endDate = result.endDateMoment.toDate();
            result.editable = false;
            let daysToInsert = this.getDaysToInsert(
              result.startDate,
              result.endDate
            );
            let index = 0;
            while (index < this.list.length) {
              let i = this.list[index].activities.findIndex(
                (el: Activity) => el.activityId === result.activityId
              );
              if (i !== -1) {
                if (
                  daysToInsert.find((elem: string) =>
                    this.list[index].name.includes(elem)
                  )
                ) {
                  this.list[index].activities[i] = result;
                  this.list[index].activities[i].editable = false;
                  this.ordenarPorFecha(index);
                } else {
                  this.onClickDeleteActivityOnDay(result.activityId, index, i);
                }
              } else {
                if (
                  daysToInsert.find((elem: string) =>
                    this.list[index].name.includes(elem)
                  )
                ) {
                  this.list[index].activities.push(result);
                  this.ordenarPorFecha(index);
                }
              }
              index = index + 1;
            }
          } else {
            let i = this.list[0].activities.findIndex(
              (el: Activity) => el.activityId === result.activityId
            );
            this.list[0].activities[i] = result;
            this.list[0].activities[i].editable = false;
          }
        }
        this.activity = new Activity();
      }
    });
  }

  onClickDeleteActivity(id: number) {
    this.list.forEach((elem, index) => {
      let i = elem.activities.findIndex((el: Activity) => el.activityId === id);
      if (i !== -1) {
        elem.activities.splice(i, 1);
      }
    });
  }

  onClickDeleteActivityOnDay(id: number, index: number, i: number) {
    this.list[index].activities.splice(i, 1);
  }

  ordenarPorFecha(index: number): void {
    this.list[index].activities.sort((a, b) => {
      if (
        a.startHour &&
        b.startHour &&
        Number(a.startHour.split(':')[0]) > Number(a.startHour.split(':')[0])
      ) {
        return 1;
      }
      if (
        a.startHour &&
        b.startHour &&
        Number(a.startHour.split(':')[0]) < Number(b.startHour.split(':')[0])
      ) {
        return -1;
      }
      return 0;
    });
  }

  onClickEditActivity(item: Activity) {
    this.activity = { ...item };
    this.openFormAcrtivity();
  }

  getDaysToInsert(d1: Date, d2: Date): Array<string> {
    let daysdiff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24) + 1;
    let days = [];
    let dateSave = new Date();
    dateSave.setDate(d1.getDate());
    while (daysdiff > 0) {
      days.push(dateSave.getDate().toString());
      let newDate = new Date();
      newDate.setDate(dateSave.getDate() + 1);
      dateSave = newDate;
      daysdiff = daysdiff - 1;
    }
    return days;
  }
}
