import { Component, effect } from '@angular/core';
import { NgIf } from '@angular/common';
import { NoteListMain } from './NoteListMain/NoteListMain.component';
import { NoteDisplayMain } from './NoteDisplayMain/NoteDisplayMain.component';
import { DisplayModeService, AppDisplayMode, HeaderDisplayMode } from 'src/app/Services/DisplayModeService';
import AnimateElement from '../../Utils/Animate';

@Component({
  standalone: true,
  selector: 'Main',
  templateUrl: './Main.component.html',
  styleUrls: ['./Main.component.css'],
  imports: [ NoteListMain , NoteDisplayMain, NgIf ]
})
export class Main {
  private isBackToTopButtonHidden : boolean = true;
  DisplayModeService = DisplayModeService;
  AppDisplayMode = AppDisplayMode;
  constructor()
  {
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

      if (DisplayModeService.GetAppDisplayMode() === AppDisplayMode.NOTE_DISPLAY) {
        const main = document.getElementById("notes-main") as HTMLElement;
        main.style.height = "93.46dvh";
      }
    })
  }

  OnScroll(event : Event) {
    
    const Target = event.target as HTMLElement;
    const BackToTopButton = document.getElementById("back-to-top") as HTMLElement;
    if ((Target.scrollTop + Target.clientHeight) === Target.scrollHeight) {
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
