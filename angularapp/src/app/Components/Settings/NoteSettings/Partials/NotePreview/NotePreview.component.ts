import { Component, Input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarginFormat } from 'src/app/Services/NotesService';
import { NoteManager } from 'src/app/Services/NoteManager';

@Component({
  selector: 'NotePreview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NotePreview.component.html',
  styleUrls: ['./NotePreview.component.css']
})
export class NotePreview {
  protected marginFormat : MarginFormat = 'px';
  protected marginLeft: number = 0;
  protected marginRight: number = 0;
  protected marginTop: number = 0;
  protected marginBottom: number = 0;
  protected backgroundColor: string = "#FFFFFFFF";

  constructor(private noteManager : NoteManager) {
    effect(() => {
      this.marginFormat = this.noteManager.GetNoteMarginFormat();
      this.marginLeft = this.noteManager.GetNoteMarginLeft();;
      this.marginRight = this.noteManager.GetNoteMarginRight();
      this.marginTop = this.noteManager.GetNoteMarginTop();
      this.marginBottom = this.noteManager.GetNoteMarginBottom();
      this.backgroundColor = this.noteManager.GetNoteBackgroundColor();
    })
  }
}
