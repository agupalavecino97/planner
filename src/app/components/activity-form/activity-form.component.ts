import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Activity } from '../../models/Activity';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
})
export class ActivityFormComponent {

  constructor(
    public dialogRef: MatDialogRef<ActivityFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Activity,
  ) {
    console.log(data);
  }


  onDataChange(event: any) {
    console.log(event)
  }

  onDateChange(type: number, event: any) {
    type === 1 ? this.data.startDate = event.value : this.data.endDate = event.value 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

