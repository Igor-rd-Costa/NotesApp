import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'NoteCard',
  templateUrl: './NoteCard.component.html',
  styleUrls: ['./NoteCard.component.css']
})
export class NoteCard {
  @Input() noteName: string = "";
  @Input() noteDate: string = "";
  @Input() notePreview: string = "";
}
