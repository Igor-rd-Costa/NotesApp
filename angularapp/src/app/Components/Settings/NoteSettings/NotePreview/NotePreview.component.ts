import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarginFormat } from 'src/app/Services/NotesService';

@Component({
  selector: 'NotePreview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NotePreview.component.html',
  styleUrls: ['./NotePreview.component.css']
})
export class NotePreview {
  @Input() marginFormat : MarginFormat = 'px';
  @Input() marginLeft: number = 0;
  @Input() marginRight: number = 0;
  @Input() marginTop: number = 0;
  @Input() marginBottom: number = 0;
  @Input() backgroundColor: string = "#FFFFFFFF";
}
