import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Activity } from '../../models/Activity';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  sinAsignar: Array<Activity> = [
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
        status: "null",
      }
  ];

  dia_1: Array<Activity> = [
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
  ];

  dia_2: Array<Activity> = [{
    activityId : 4,
    title: "Subida al cerro otto",
    type: "ACTIVITY",
    startDate: "2022-01-23 13:30:00",
    endDate: "2022-01-23 18:30:00",
    status: "IN_PROGRESS",
    },];

  dia_3: Array<Activity> = [];

  drop(event: CdkDragDrop<Activity[]>) {
    console.log(event);
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
}
