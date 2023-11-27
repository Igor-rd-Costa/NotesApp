import { Component, EventEmitter, Output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteManager } from 'src/app/Services/NoteManager';
import { NoteFormater } from 'src/app/Utils/NoteFormater';

@Component({
  selector: 'Page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Page.component.html',
  styleUrls: ['./Page.component.css']
})
export class Page {

  constructor(private noteManager : NoteManager) {
    effect(() => {
      const content = this.noteManager.GetNoteContent();
      const page = document.getElementsByClassName("note-page")[0] as HTMLElement;
      const html = NoteFormater.NoteToHMTL(content);
      while (page.childNodes.length > 0) {
        page.removeChild(page.childNodes[0]);
      }
      html.forEach(element => {
        page.appendChild(element);
      })
    })
  }

  Blur(event : FocusEvent) {
    NoteFormater.SetFocusedElement(null);
    if (event.relatedTarget === null || (event.relatedTarget as HTMLElement).closest(".edit-menu") === null) {
      this.noteManager.SaveNote();
    }
  }
}
