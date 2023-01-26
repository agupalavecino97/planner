import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Activity } from '../../models/Activity';
import { ActivityListComponent } from '../activityList/activity-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ThisReceiver } from '@angular/compiler';
export interface ActivityList {
  nombre: string;
  activities: Array<Activity>;
}

const meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ ActivityListComponent ]
})
export class HomeComponent {

  public list: Array<ActivityList> = [
    {
      nombre: 'Sin Fecha asiganada',
      activities: [
        {
          activityId : 1,
          title: "Subida al cerro catedral",
          type: "ACTIVITY",
          startDate: null,
          endDate: null,
          status: "IN_PROGRESS",
          },
          {
          activityId: 2,
          title: "Fiesta de espuma",
          type: "PARTY",
          startDate: null,
          endDate: null,
          status: "DONE",
          },
          {
            activityId: 3,
            title: "Almuerzo",
            type: "FOOD",
            startDate: null,
            endDate: null,
            status: null,
          }
      ]
    },
    {
      nombre: '',
      activities: [
        {
          activityId : 4,
          title: "Subida al cerro otto",
          type: "ACTIVITY",
          startDate: "2022-01-23 13:30:00",
          endDate: "2022-01-23 18:00:00",
          status: "IN_PROGRESS",
          },
          {
          activityId: 5,
          title: "Fiesta de espuma",
          type: "PARTY",
          startDate: "2022-01-22 01:30:00",
          endDate: "2022-01-22 23:30:00",
          status: "DONE",
          }
      ]
    },
    {
      nombre: '',
      activities: [{
        activityId : 4,
        title: "Subida al cerro otto",
        type: "ACTIVITY",
        startDate: "2022-01-23 13:30:00",
        endDate: "2022-01-23 18:30:00",
        status: "IN_PROGRESS",
        },]
    },
    {
      nombre: '',
      activities: []
    }
  ]

 

  public activity: Activity | undefined;

  constructor(public dialog: MatDialog) {
    this.activity = new Activity();
  }

  ngOnInit() {
    let date1 = new Date();
    let date2 = new Date();
    let date3 = new Date();
    date2.setDate(date1.getDate() + 1);
    date3.setDate(date1.getDate() + 2);
    this.list[1].nombre =  date1.getDate() + " de " + meses[date1.getMonth()+ 1]
    this.list[2].nombre =  date2.getDate() + " de " + meses[date2.getMonth()+ 1]
    this.list[3].nombre =  date3.getDate() + " de " + meses[date3.getMonth()+ 1]
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
        { data: {... this.activity},  
          width: '40%',
          height: '100%',
          position: { right: '0' }
        });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!result.activityId || result.activityId === null) {
          let new_activity = Activity.parseItem(result);
          if (result.startDate) {
            new_activity.startDate = this.formatearFechaDatePicker(result.startDate, result.startHour)
          }
          if (result.endDate) {
            new_activity.endDate = this.formatearFechaDatePicker(result.endDate, result.endHour)
          }
          new_activity.activityId = new Date().getTime();
          new_activity.status = null
          console.log(new_activity);
          if (new_activity.startDate === null ) {
            this.list[0].activities.push(new_activity)
          } else {
            let sd = Number(new_activity.startDate!.split(' ')[0].split('-')[2]);
            var ed = sd;
            if (new_activity.endDate) {
              ed = Number(new_activity.endDate?.split(' ')[0].split('-')[2]);
            }
            var i = 1;
            while (sd <= ed) {
                let index = this.list.findIndex((e) => e.nombre.includes(sd.toString()));
                this.list[index].activities.push(new_activity);
                sd += 1
            }
          }
        } else {
          console.log('Hay quie act algo?')
          console.log(result)
          if (result.startDate) {
            result.startDate = result.startDate + ' ' + result.startHour + ':00'
          }
          if (result.endDate) {
            result.endDate = result.endDate + ' ' + result.endHour + ':00'
          }
          this.list.forEach((elem: ActivityList) => {
            let index = elem.activities.findIndex((el: Activity) => el.activityId === result.activityId) 
            if (index !== -1) {
              elem.activities[index] = result;
              elem.activities[index].editable = false;
              return
            }
          });
        
        }
        this.activity = new Activity();
      }
    });
  }

  onClickEditActivity(item: Activity) {
      this.activity = {...item};
      if (this.activity.startDate) {
        let start = this.activity.startDate.split(' ');
        let new_start_day = start[0].split('-')
        this.activity.startDate = new_start_day[2] + '-' + new_start_day[1] + '-' + new_start_day[0];
        let new_start_hour = start[1].split(':');
        this.activity.startHour = new_start_hour[0] + ':' + new_start_hour[1];
      }
      if (this.activity.endDate) {
        let end = this.activity.endDate.split(' ');
        let new_end_day = end[0].split('-')
        this.activity.endDate = new_end_day[2] + '-' + new_end_day[1] + '-' + new_end_day[0];
        let new_end_hour = end[1].split(':');
        this.activity.endHour = new_end_hour[0] + ':' + new_end_hour[1];
      }
      this.openFormAcrtivity();
  }

  formatearFecha(date: string): string {
    let d = date.split(" ")[1]
    return d ? d.substring(0, d.length - 3): '';
  }

  formatearFechaDatePicker(date: any, hour: string) {
    return(date._d.getFullYear().toString() + '-' + (date._d.getMonth() + 1 < 10 ? '0' + (date._d.getMonth() + 1).toString() : (date._d.getMonth() + 1).toString()) + '-' + date._d.getDate().toString() + ' ' + hour + ':00');
  }
}
