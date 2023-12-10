import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../../General/ImgButton/ImgButton.component';
import { NotesService } from 'src/app/Services/NotesService';
import { ListMenu, ListMenuItem } from '../../General/ListMenu/ListMenu.component';
import { Router } from '@angular/router';

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
    {content: "Delete", onClick: { func: this.Delete, src: this }},
    {content: "Settings", onClick: { func: this.OpenSettings, src: this }, iconSrc: "/assets/NoteSettingsIcon.svg"}
  ]

  constructor(private notesService : NotesService, private router : Router) {}

  Delete() {
    this.notesService.Delete(this.noteId).subscribe(() => {
      this.router.navigate(['']);
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
        next: () => { 
          this.router.navigate(['']);
        },
        error: (error : any) => { 
          console.error("CheckDelete error:", error) 
        }
      })
    }
    else {
      this.router.navigate(['']);
    }
  }

  OnMoreOptionsClick(event : MouseEvent) {
    this.listMenu.ToggleVisibility();
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

  OpenSettings(event : MouseEvent | TouchEvent) {
    this.router.navigate(['note', this.noteId, 'settings'])
  }
}
