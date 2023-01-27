import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Activity } from '../../models/Activity';
import { ActivityListComponent } from '../activityList/activity-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ActivityService } from '../../services/activity.service';
export interface ActivityList {
  id: number;
  name: string;
  activities: Array<Activity>;
}

const meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ ActivityListComponent, ActivityService ]
})
export class HomeComponent {

  public list: Array<ActivityList> = [
    {
      id: 1,
      name: 'Sin Fecha asiganada',
      activities: []
    },
    {
      id: 2,
      name: '',
      activities: []
    },
    {
      id: 3,
      name: '',
      activities: []
    },
    {
      id: 4,
      name: '',
      activities: []
    }
  ];
  public firstDateStored: Date = new Date;
  public activity: Activity | undefined;

  constructor(public dialog: MatDialog, private activityService: ActivityService) {
    this.activity = new Activity();
  }

  ngOnInit(){
    this.activityService.getActivities().subscribe( (res: Array<any>) => {
      this.armarListado(Activity.parseArray(res));
    })
  }

  armarListado(data : Array<Activity>) {
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
    let days = 3
    let firsdateStored = false;
    data.forEach( (elem: Activity) => {
      if (elem.startDate != null) {
        if (elem.startDate.getDate() === lastDate.getDate()) {
          this.list[index].activities.push(elem);
        } else {
          index += 1
          lastDate = elem.startDate;
          this.firstDateStored = elem.startDate;
          firsdateStored = true;
          this.list[index].name =  elem.startDate.getDate() + " de " + meses[elem.startDate.getMonth()]
          this.list[index].activities.push(elem);
          days -= 1;
        }
      } else {
        this.list[0].activities.push(elem)
      }
    });
    if (days > 0) {
      while (days > 0) {
        let day = new Date();
        day.setDate(lastDate.getDate() + 1);
        index += 1;
        this.list[index].name = day.getDate() + " de " + meses[day.getMonth()]
        lastDate = day;
        days -= 1
      }
    }
    console.log(this.list)
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  openFormAcrtivity(): void {
    const dialogRef = this.dialog.open(ActivityFormComponent, 
        { data: { activity: this.activity, firstDate: this.firstDateStored },  
          width: '40%',
          height: '100%',
          position: { right: '0' }
        });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!result.activityId || result.activityId === null) {
          if (result.startDate) {
            result.startDate = new Date(result.startDate._d)
          }
           if (result.endDate) {
            result.endDate = new Date(result.endDate._d)
          }
          console.log(result);
          let new_activity = Activity.parseItem(result);
          new_activity.activityId = new Date().getTime();
          new_activity.status = null
          console.log(new_activity);
          if (new_activity.startDate === null ) {
            this.list[0].activities.push(new_activity)
          } else {
              let daysdiff = (new_activity.endDate!.getTime() - new_activity.startDate!.getTime()) /(1000*60*60*24) + 1;
              console.log(daysdiff);
              let dateToCompare = new Date();
              dateToCompare.setDate(new_activity.startDate!.getDate());
              let index = 1
              while (daysdiff > 0) {
                if (this.list[index].name.includes(dateToCompare.getDate().toString())) {
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
          console.log('Hay quie act algo?')
          console.log(result)
          this.list.forEach( (elem, index) => {
            let i = elem.activities.findIndex((el: Activity) => el.activityId === result.activityId)
            if (i !== -1) {
              elem.activities[i] = result;
              elem.activities[i].editable = false;
              this.ordenarPorFecha(index);
            }
          })
         
        };
        this.activity = new Activity();
      }
    });
  }

  onClickDeleteActivity(id: number) {
    this.list.forEach( (elem, index) => {
      let i = elem.activities.findIndex((el: Activity) => el.activityId === id)
      if (i !== -1) {
        elem.activities.splice(i, 1);
      }
    })
  }

  ordenarPorFecha(index: number): void {
    this.list[index].activities.sort((a, b) => {
      if (a.startHour && b.startHour && Number(a.startHour.split(':')[0]) > Number(a.startHour.split(':')[0])) {
        return 1;
      }
      if (a.startHour && b.startHour && Number(a.startHour.split(':')[0]) < Number(b.startHour.split(':')[0])) {
        return -1;
      }
      return 0;
    });
  }

  onClickEditActivity(item: Activity) {
      this.activity = {...item};
      this.openFormAcrtivity();
  }

  // formatearFecha(date: string): string {
  //   return date.substring(0, date.length - 3);
  // }

  // formatearFechaDatePicker(date: any, hour: string) {
  //   return(date._d.getFullYear().toString() + '-' + (date._d.getMonth() + 1 < 10 ? '0' + (date._d.getMonth() + 1).toString() : (date._d.getMonth() + 1).toString()) + '-' + date._d.getDate().toString() + ' ' + hour + ':00');
  // }
}
