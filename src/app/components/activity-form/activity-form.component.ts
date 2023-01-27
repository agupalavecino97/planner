import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Activity } from '../../models/Activity';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
})
export class ActivityFormComponent {

  minDate: Date = new Date();
  maxDate: Date = new Date();

 
  constructor(
    public dialogRef: MatDialogRef<ActivityFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.minDate.setDate(data.firstDate.getDate())
    this.maxDate.setDate(data.firstDate.getDate() + 2)

  }


  onDataChange(event: any) {
    console.log(event)
  }

  onDateChange(type: number, event: any) {
    type === 1 ? this.data.activity.startDate = event.value : this.data.activity.endDate = event.value 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

