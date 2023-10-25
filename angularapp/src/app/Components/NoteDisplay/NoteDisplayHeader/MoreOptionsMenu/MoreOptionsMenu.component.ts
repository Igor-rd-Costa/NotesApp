import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from 'src/app/Services/NotesService';
import { AppDisplayMode, DisplayModeService } from 'src/app/Services/DisplayModeService';
import { App } from 'src/app/App.component';

@Component({
  selector: 'MoreOptionsMenu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './MoreOptionsMenu.component.html',
  styleUrls: ['./MoreOptionsMenu.component.css']
})
export class MoreOptionsMenu {
  constructor(private notesService : NotesService) {
    App.RegisterClickWatcher(this.OnAppClick);
  }
  private static isVisible : boolean = false;
  @Input() noteId : string = "";

  Delete() {
    this.notesService.Delete(this.noteId).subscribe(() => {
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    })
  }

  private OnAppClick(event : Event) {
    if (event.target === null || MoreOptionsMenu.isVisible === false)
      return;

    const target = event.target as HTMLElement;
    if (target.closest("#more-options-menu") === null) {
      MoreOptionsMenu.Hide();
    }
  }

  public static Toggle() {
    MoreOptionsMenu.isVisible === true ? MoreOptionsMenu.Hide() : MoreOptionsMenu.Show();
  }

  public static Show() {
    const section = document.getElementById("more-options-menu") as HTMLElement;
    if (section == null)
      return;

    section.style.visibility = "visible";
    MoreOptionsMenu.isVisible = true;
  }

  public static Hide() {
    const section = document.getElementById("more-options-menu") as HTMLElement;
    if (section == null)
      return;

    section.style.visibility = "hidden";
    MoreOptionsMenu.isVisible = false;
  }
}
