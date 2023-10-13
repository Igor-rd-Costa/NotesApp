import { Component } from '@angular/core';
import { NoteCard } from './NoteCard/NoteCard.component';
import { SetScrollTop } from 'src/app/App.component';
import { touchInfo } from '../../../Utils/GlobalEventHandlers';
import { AppDisplayMode, DisplayModeService } from '../../../Services/DisplayModeService';
import { NgFor } from '@angular/common';
import { NotePreview, NotesService } from 'src/app/Services/NotesService';

const Months : string[] = [ "Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Set", "Oct", "Nov", "Dec" ]

type Note = {
  id: number,
  name: string,
  creation_Date: string,
  modify_Date: string,
  content: string
}

@Component({
  standalone: true,
  selector: 'NoteListMain',
  templateUrl: './NoteListMain.component.html',
  styleUrls: ['./NoteListMain.component.css'],
  imports: [ NoteCard, NgFor ]
})
export class NoteListMain {

  notes: Array<NotePreview> = new Array<NotePreview>;
  private count: number = 0;
  
  constructor(notesService : NotesService) {
    notesService.GetNotePreviews().then(notePreviews => {
      this.notes = notePreviews;
    })
  }

  OnBackToTopClick() {
    const Main = document.getElementById("notes-main") as HTMLElement;
    Main.scrollTo({ top: 0, behavior: "smooth" });
    SetScrollTop(0);
    touchInfo.touchStart.X = -1;
    touchInfo.touchStart.Y = -1;
    touchInfo.touchMove.X = -1;
    touchInfo.touchMove.Y = -1;
  }

  OnCreateNoteClick() {
    DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_DISPLAY);
  }
}
