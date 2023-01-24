import { Component } from '@angular/core';
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
          startDate: "2022-01-22 01:30:00",
          endDate: "2022-01-22 23:30:00",
          status: "DONE",
          },
          {
            activityId: 3,
            title: "Almuerzo",
            type: "FOOD",
            startDate: "2022-01-22 01:30:00",
            endDate: "2022-01-22 23:30:00",
            status: null,
          }
      ]
    },
    {
      nombre: '24 de Enero',
      activities: [
        {
          activityId : 4,
          title: "Subida al cerro otto",
          type: "ACTIVITY",
          startDate: "2022-01-23 13:30:00",
          endDate: "2022-01-23 18:30:00",
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
      nombre: '25 de Enero',
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
      nombre: '26 de Enero',
      activities: []
    }
  ]

  public activity: Activity | undefined;

  constructor(public dialog: MatDialog) {
    this.activity = new Activity();
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
        { data: this.activity,  
          width: '40%',
          height: '100%',
          position: { right: '0' }
        });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // this.activity = result;
    });
  }
}
