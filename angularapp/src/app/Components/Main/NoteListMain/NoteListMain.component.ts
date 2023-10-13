import { Component, AfterViewChecked, AfterContentInit } from '@angular/core';
import { NoteCard } from './NoteCard/NoteCard.component';
import { SetScrollTop } from 'src/app/App.component';
import { touchInfo } from '../../../Utils/GlobalEventHandlers';
import { AppDisplayMode, DisplayModeService } from '../../../Services/DisplayModeService';
import { NgFor } from '@angular/common';
import { NotePreview, NotesService } from 'src/app/Services/NotesService';

function SetNoteWrapperSize() {
  const NoteWrapper = document.getElementById("notes-wrapper");
  const note = document.getElementById("note");
  if (NoteWrapper != null && note != null) {
    const windowWidth = window.innerWidth;
    const noteWidth = parseFloat(getComputedStyle(note).width);
    let gap = windowWidth * 0.05;
    if (gap < 18) gap = 18;
    if (gap > 32) gap = 32;
    let size = 0;
    size += noteWidth;
    while(true) {
      if ((size + (noteWidth + gap)) > windowWidth) 
        break;
      size += (noteWidth + gap);
    }
    NoteWrapper.style.width = size + "px";
  }
}

@Component({
  standalone: true,
  selector: 'NoteListMain',
  templateUrl: './NoteListMain.component.html',
  styleUrls: ['./NoteListMain.component.css'],
  imports: [ NoteCard, NgFor ]
})
export class NoteListMain implements AfterViewChecked {
  notes: Array<NotePreview> = new Array<NotePreview>;

  constructor(notesService : NotesService) {
    window.addEventListener('resize', SetNoteWrapperSize);
    notesService.GetNotePreviews().then(notePreviews => {
      this.notes = notePreviews;
    })
  }

  ngAfterViewChecked(): void {
    SetNoteWrapperSize();
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
