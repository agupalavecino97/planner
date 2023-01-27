import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.minDate = new Date(
      data.firstDate.getFullYear(),
      data.firstDate.getMonth(),
      data.firstDate.getDate()
    );
    this.maxDate = new Date(
      data.firstDate.getFullYear(),
      data.firstDate.getMonth(),
      data.firstDate.getDate() + 2
    );
    if (data.activity.startDate) {
      data.activity.startDate = new FormControl(data.activity.startDate);
      data.activity.endDate = new FormControl(data.activity.endDate);
    }
  }

  onDateChange(type: number, event: any) {
    type === 1
      ? (this.data.activity.startDateMoment = event.value)
      : (this.data.activity.endDateMoment = event.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
