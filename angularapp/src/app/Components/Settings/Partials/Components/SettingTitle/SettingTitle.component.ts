import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'SettingTitle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './SettingTitle.component.html',
  styleUrls: ['./SettingTitle.component.css']
})
export class SettingTitle {
  @Input() title = "";
}
