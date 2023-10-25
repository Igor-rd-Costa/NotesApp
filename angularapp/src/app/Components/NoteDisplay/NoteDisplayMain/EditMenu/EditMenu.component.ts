import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from 'src/app/Components/General/ImgButton/ImgButton.component';
import { FontSizeMenu } from './Menus/FontSizeMenu/FontSizeMenu.component';

@Component({
  selector: 'EditMenu',
  standalone: true,
  imports: [CommonModule, ImgButton, FontSizeMenu],
  templateUrl: './EditMenu.component.html',
  styleUrls: ['./EditMenu.component.css']
})
export class EditMenu {
  fontSize : number = 16;

  undoButtonProps : ImgButtonProp = {
    Button: {
      OnClick: this.UndoButtonOnClick
    },
    Img: {
      Src: '/assets/UndoIcon.svg',
      Alt: 'Undo icon'
    }
  }

  UpdateFontSizeDisplay(value : number) {
    this.fontSize = value;
  }

  FontSizeButtonOnClick(event : Event) {
    let width = window.visualViewport?.width;
    if (width == undefined)
      return;
    FontSizeMenu.Toggle(parseFloat((width * 0.65).toFixed(2)), -192);
    event.stopPropagation();
  }

  UndoButtonOnClick() {

  }

}
