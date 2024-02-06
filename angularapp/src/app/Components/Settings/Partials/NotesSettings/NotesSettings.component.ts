import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { NoteSettingsItem } from './NoteSettingsItem/NoteSettingsItem.component';
import { NoteSettingsCardInfo, NotesService } from 'src/app/Services/NotesService';
import { DateToLocal } from 'src/app/Utils/DateToLocal';

@Component({
  selector: 'NotesSettings',
  standalone: true,
  imports: [CommonModule, NoteSettingsItem, NgFor],
  templateUrl: './NotesSettings.component.html',
  styleUrls: ['./NotesSettings.component.css']
})
export class NotesSettings {
  noteCards : NoteSettingsCardInfo[] = [];
  constructor(private notesService : NotesService) {
    this.notesService.GetSettingsNoteCards().subscribe(noteCards => {
      noteCards.forEach(noteCard => {
        const createDate : Date = new Date(noteCard.createDate);
        noteCard.createDate = DateToLocal(createDate);
        noteCard.modifyDate = DateToLocal(new Date(noteCard.modifyDate));
        if (noteCard.name === "") {
          noteCard.name = `Text note ${createDate.getMonth() + 1}/${createDate.getDate()}`;
        }
      })
      this.noteCards = noteCards;
    })
  }
}
