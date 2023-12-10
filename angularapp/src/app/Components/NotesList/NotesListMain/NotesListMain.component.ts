import { Component, AfterViewChecked, effect, Output, EventEmitter } from '@angular/core';
import { NoteCard } from './NoteCard/NoteCard.component';
import { touchInfo } from '../../../Utils/GlobalEventHandlers';
import { DisplayModeService, HeaderDisplayMode } from '../../../Services/DisplayModeService';
import { NgFor } from '@angular/common';
import { NotesService } from 'src/app/Services/NotesService';
import AnimateElement from 'src/app/Utils/Animate';
import { Router } from '@angular/router';
import { NoteFormater } from 'src/app/Services/NoteFormater';

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

interface NoteCardInfo {
  id: string,
  name : string,
  modifyDate : string,
  preview : HTMLParagraphElement[]
}

@Component({
  standalone: true,
  selector: 'NotesListMain',
  templateUrl: './NotesListMain.component.html',
  styleUrls: ['./NotesListMain.component.css'],
  imports: [ NoteCard, NgFor ]
})
export class NotesListMain implements AfterViewChecked {
  @Output() scrolltop : EventEmitter<void> = new EventEmitter<void>;
  notes : NoteCardInfo[] = [];
  private isBackToTopButtonHidden : boolean = true;

  constructor(private notesService : NotesService, private noteFormater : NoteFormater, private router : Router) {
    window.addEventListener('resize', SetNoteWrapperSize);
    this.notesService.GetNotePreviews().subscribe(result => {
      result.forEach(note => {
        const date : Date = new Date(note.modifyDate); 
        let noteCard : NoteCardInfo = {
          id: note.id,
          name: note.name,
          modifyDate: this.notesService.GetNotePreviewDateText(date),
          preview: this.noteFormater.NoteToHMTL(note.preview)
        };
        if (noteCard.name === "") {
          noteCard.name = `Text note<br>${date.getMonth() + 1}/${date.getDate()}`;
        }
        this.notes.push(noteCard);  
      });
    })
  
    effect(() => {
      switch (DisplayModeService.GetHeaderDisplayMode())
      {
        case HeaderDisplayMode.HEADER_HIDDEN: {
          const main = document.getElementById("notes-main") as HTMLElement;
          main.style.height = "92.0dvh";
          main.style.overflow = "scroll";
        } break;
        case HeaderDisplayMode.HEADER_LARGE: {
          const main = document.getElementById("notes-main") as HTMLElement;
          main.style.height = "61.72dvh";
          main.style.overflow = "hidden";
        } break;
      }
    })
  }

  ngAfterViewChecked(): void {
    SetNoteWrapperSize();
  }

  OnBackToTopClick() {
    const Main = document.getElementById("notes-main") as HTMLElement;
    Main.scrollTo({ top: 0, behavior: "smooth" });
    this.scrolltop.emit();
    touchInfo.touchStart.X = -1;
    touchInfo.touchStart.Y = -1;
    touchInfo.touchMove.X = -1;
    touchInfo.touchMove.Y = -1;
  }

  OnCreateNoteClick() {
    this.notesService.Create().subscribe(id => {
      this.router.navigate(["note", id]);
    });
  }

  OnScroll(event : Event) {    
    const Target = event.target as HTMLElement;
    const BackToTopButton = document.getElementById("back-to-top") as HTMLElement;

    if ((Target.scrollTop + Target.clientHeight) >= Target.scrollHeight) {
      if (this.isBackToTopButtonHidden) {
        AnimateElement(BackToTopButton, { opacity: 0 }, { opacity: 1 } , 720);
        this.isBackToTopButtonHidden = false;
      }
    }
    else {
      if (!this.isBackToTopButtonHidden) {
        AnimateElement(BackToTopButton, { opacity: 1 }, { opacity: 0 } , 720);
        this.isBackToTopButtonHidden = true;
      }
    }
  }
}
