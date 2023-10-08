import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../../General/ImgButton/ImgButton.component';
import { AppDisplayMode, DisplayModeService } from '../../../Services/DisplayModeService';

@Component({
  selector: 'NotesEditHeader',
  standalone: true,
  imports: [CommonModule, ImgButton ],
  templateUrl: './NotesEditHeader.component.html',
  styleUrls: ['./NotesEditHeader.component.css']
})
export class NotesEditHeader {
  backButtonProps: ImgButtonProp = {
    Button: {
      OnClick: this.OnBackButtonClick
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
      OnClick: (event : MouseEvent) => {}
    },
    Img: {
      Src: "/assets/MoreOptionsIcon.svg",
      Alt: "More options"
    }
  }

  OnBackButtonClick(event: MouseEvent) {
    DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
  }

}
