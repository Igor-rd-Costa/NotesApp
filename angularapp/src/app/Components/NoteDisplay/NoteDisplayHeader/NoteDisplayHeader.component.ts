import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../../General/ImgButton/ImgButton.component';
import { AppDisplayMode, DisplayModeService } from '../../../Services/DisplayModeService';
import { NotesService } from 'src/app/Services/NotesService';
import { MoreOptionsMenu } from './MoreOptionsMenu/MoreOptionsMenu.component';

@Component({
  selector: 'NoteDisplayHeader',
  standalone: true,
  imports: [CommonModule, ImgButton, MoreOptionsMenu ],
  templateUrl: './NoteDisplayHeader.component.html',
  styleUrls: ['./NoteDisplayHeader.component.css']
})
export class NoteDisplayHeader implements AfterViewInit {
  @Input() noteName : string = "";
  @Input() noteId : string = "";
  @ViewChild(MoreOptionsMenu) moreOptionsMenu!: MoreOptionsMenu;

  constructor(private notesService : NotesService) {}

  ngAfterViewInit(): void {
      this.moreOptionsButtonProps.Button.UserData = { MoreOptionsMenu: this.moreOptionsMenu }
  }

  backButtonProps: ImgButtonProp = {
    Button: {
      OnClick: this.OnBackButtonClick,
      UserData: { Header: this }
    },
    Img: {
      Src: "/assets/BackArrow.png",
      Alt: "Back button"
    }
  }

  readModeButtonProps: ImgButtonProp = {
    Button: {
      OnClick: (event : MouseEvent) => {}
    },
    Img: {
      Src: "/assets/BookIcon.png",
      Alt: "Read mode"
    }
  }

  appendButtonProps: ImgButtonProp = {
    Button: {
      OnClick: (event : MouseEvent) => {}
    },
    Img: {
      Src: "/assets/ClipIcon.png",
      Alt: "Append"
    }
  }

  moreOptionsButtonProps : ImgButtonProp = {
    Button: {
      OnClick: this.OnMoreOptionsClick,
    },
    Img: {
      Src: "/assets/MoreOptionsIcon.svg",
      Alt: "More options"
    }
  }

  OnBackButtonClick(event: MouseEvent, userData : any | undefined) {
    const name = document.getElementById("note-name") as HTMLInputElement;
    const content = document.getElementsByClassName("note-page")[0] as HTMLDivElement;
    if (name == null || content == null)
      return;

    if (name.value === "" && content.innerText === "") {
      userData.Header.notesService.CheckDelete(userData.Header.noteId).subscribe({
        next: () => { DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST)},
        error: (error : any) => { console.log(error) }
      })
    }
    else {
      DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    }
  }

  OnMoreOptionsClick(event : MouseEvent, userData : any) {
    userData.MoreOptionsMenu.ToggleVisibility();
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
