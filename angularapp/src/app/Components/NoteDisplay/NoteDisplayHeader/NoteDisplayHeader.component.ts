import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../../General/ImgButton/ImgButton.component';
import { AppDisplayMode, DisplayModeService } from '../../../Services/DisplayModeService';
import { NotesService } from 'src/app/Services/NotesService';
import { ListMenu, ListMenuItem } from '../../General/ListMenu/ListMenu.component';

@Component({
  selector: 'NoteDisplayHeader',
  standalone: true,
  imports: [CommonModule, ImgButton, ListMenu ],
  templateUrl: './NoteDisplayHeader.component.html',
  styleUrls: ['./NoteDisplayHeader.component.css']
})
export class NoteDisplayHeader {
  @Input() noteName : string = "";
  @Input() noteId : string = "";

  @ViewChild(ListMenu) listMenu! : ListMenu;
  moreOptionsMenuItems : ListMenuItem[] = [
    {content: "Delete", onClick: { func: this.Delete, src: this }}
  ]

  constructor(private notesService : NotesService) {}

  Delete() {
    this.notesService.Delete(this.noteId).subscribe(() => {
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    })
  }
  
  backButtonProps: ImgButtonProp = {
    Button: {},
    Img: {
      Src: "/assets/BackArrow.png",
      Alt: "Back button"
    }
  }

  readModeButtonProps: ImgButtonProp = {
    Button: {},
    Img: {
      Src: "/assets/BookIcon.png",
      Alt: "Read mode"
    }
  }

  appendButtonProps: ImgButtonProp = {
    Button: {},
    Img: {
      Src: "/assets/ClipIcon.png",
      Alt: "Append"
    }
  }

  moreOptionsButtonProps : ImgButtonProp = {
    Button: {},
    Img: {
      Src: "/assets/MoreOptionsIcon.svg",
      Alt: "More options"
    }
  }

  OnBackButtonClick(event: MouseEvent) {
    const name = document.getElementById("note-name") as HTMLInputElement;
    const content = document.getElementsByClassName("note-page")[0] as HTMLDivElement;
    if (name == null || content == null)
      return;

    if (name.value === "" && (content.innerText === "" || content.innerText === '\n')) {
      this.notesService.CheckDelete(this.noteId).subscribe({
        next: () => { DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST)},
        error: (error : any) => { console.log(error) }
      })
    }
    else {
      DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    }
  }

  OnMoreOptionsClick(event : MouseEvent) {
    this.listMenu.ToggleVisibility();
    event.stopPropagation();
  }

  OnBlur() {
    const nameField = document.getElementById("note-name") as HTMLInputElement;
    if (nameField == null)
      return;

    const newName : string = nameField.value;
    if (newName != this.noteName) {
      this.notesService.Rename(this.noteId, newName).subscribe(result => {
        if (result) {
          this.noteName = newName;
        }
      });
    }
  }
}
