import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppDisplayMode, DisplayModeService, SideMenuDisplayMode } from 'src/app/Services/DisplayModeService';

@Component({
  standalone: true,
  selector: 'NoteCard',
  templateUrl: './NoteCard.component.html',
  styleUrls: ['./NoteCard.component.css']
})
export class NoteCard implements AfterViewInit {
  @Input() noteId: string = "";
  @Input() noteName: string = "";
  @Input() noteDate: string = "";
  @Input() notePreview: HTMLParagraphElement[] = [];

  constructor(private router : Router) {
    
  }

  ngAfterViewInit(): void {
    let note = document.getElementsByClassName(this.noteId)[0] as HTMLElement;
    if (note) {
      while (note.childNodes.length > 0) {
        note.removeChild(note.childNodes[0]);
      }
      this.notePreview.forEach(paragraph => {
        note.appendChild(paragraph);
      })
    }
  }

  OnClick() {
    if (DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE) {
      DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_DISPLAY);
      this.router.navigate(["note", this.noteId]);
    }
  }
}
