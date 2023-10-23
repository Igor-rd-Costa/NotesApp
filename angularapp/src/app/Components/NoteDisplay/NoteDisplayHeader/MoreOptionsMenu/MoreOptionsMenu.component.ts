import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from 'src/app/Services/NotesService';
import { AppDisplayMode, DisplayModeService } from 'src/app/Services/DisplayModeService';

@Component({
  selector: 'MoreOptionsMenu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './MoreOptionsMenu.component.html',
  styleUrls: ['./MoreOptionsMenu.component.css']
})
export class MoreOptionsMenu {
  constructor(private notesService : NotesService) {}
  private isVisible : boolean = false;
  @Input() noteId : string = "";

  Delete() {
    this.notesService.Delete(this.noteId).subscribe(status => {
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    })
  }

  public ToggleVisibility() {
    const section = document.getElementById("more-options-menu") as HTMLElement;
    if (section == null)
      return;
    if (this.isVisible) {
      section.style.visibility = "hidden";
    }
    else {
      section.style.visibility = "visible";
    }
    this.isVisible = !this.isVisible;
  }
}
