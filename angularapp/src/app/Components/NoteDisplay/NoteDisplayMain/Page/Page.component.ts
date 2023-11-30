import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteManager } from 'src/app/Services/NoteManager';
import { NoteFormater } from 'src/app/Services/NoteFormater';

@Component({
  selector: 'Page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Page.component.html',
  styleUrls: ['./Page.component.css']
})
export class Page {

  constructor(private noteManager : NoteManager, private noteFormater : NoteFormater) {
    effect(() => {
      const content = this.noteManager.GetNoteContent();
      const page = document.getElementsByClassName("note-page")[0] as HTMLElement;
      const html = this.noteFormater.NoteToHMTL(content);
      while (page.childNodes.length > 0) {
        page.removeChild(page.childNodes[0]);
      }
      html.forEach(element => {
        page.appendChild(element);
      })
    })
  }

  Blur(event : FocusEvent) {
    if (event.relatedTarget === null || (event.relatedTarget as HTMLElement).closest(".edit-menu") === null) {
      const page = (event.target as HTMLElement).closest(".note-page");
      if (page) {
        let newContent = NoteFormater.ParseNode(page).trimEnd();
        this.noteManager.SaveNote(newContent);
      }
    }
    this.noteFormater.SetFocusedElement(null);
  }
}
