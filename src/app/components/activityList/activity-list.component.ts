import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Activity } from '../../models/Activity';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

export interface ActivityList {
    nombre: string;
    activities: Array<Activity>;
  }

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit{
    @Input() list: Array<ActivityList> | undefined;
    @Output() onDrop: EventEmitter<any> = new EventEmitter<any>();
 
    public event: CdkDragDrop<Activity[]> | undefined;
    
    ngOnInit() {
		console.log(this.list);
	}

    drop(event: CdkDragDrop<Activity[]>) {
        this.event = event
        this.onDrop.emit(this.event);
    }
    

}