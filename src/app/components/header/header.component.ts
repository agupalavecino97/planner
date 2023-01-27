import { Component, } from '@angular/core';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
 
  constructor(private activityService: ActivityService) {}

  onClickNuevaActividad() {
    this.activityService.onEmit();
  }
}
