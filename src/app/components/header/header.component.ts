import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() onEmitAgregar: EventEmitter<any> = new EventEmitter<any>();

  onClickNuevaActividad() {
    this.onEmitAgregar.emit()
  }
}
