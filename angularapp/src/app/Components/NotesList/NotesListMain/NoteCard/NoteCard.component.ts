import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppDisplayMode, DisplayModeService, SideMenuDisplayMode } from 'src/app/Services/DisplayModeService';

@Component({
  standalone: true,
  selector: 'NoteCard',
  templateUrl: './NoteCard.component.html',
  styleUrls: ['./NoteCard.component.css']
})
export class NoteCard {
  @Input() noteId: string = "";
  @Input() noteName: string = "";
  @Input() noteDate: string = "";
  @Input() notePreview: string = "";

  constructor(private router : Router) {}

  OnClick() {
    if (DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE) {
      DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_DISPLAY);
      this.router.navigate(["note", this.noteId]);
    }
  }
}
