import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'Page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Page.component.html',
  styleUrls: ['./Page.component.css']
})
export class Page {
  @Output() FocusOut = new EventEmitter<void>(false);
  @Input() content : string = "";

  Blur() {
   this.FocusOut.emit();
  }
}
