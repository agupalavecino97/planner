import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Activity } from '../../models/Activity';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent {

  public email = new FormControl('');
  // public fechaInicio;
  // public fechaFin;

  constructor(
    public dialogRef: MatDialogRef<ActivityFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Activity,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

