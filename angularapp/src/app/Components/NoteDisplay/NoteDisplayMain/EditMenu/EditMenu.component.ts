import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from 'src/app/Components/General/ImgButton/ImgButton.component';
import { FontSizeMenu } from './Menus/FontSizeMenu/FontSizeMenu.component';
import { SelectionManager } from 'src/app/Services/SelectionManager';
import { NoteNodeStyles } from 'src/app/Utils/NoteFormater';

@Component({
  selector: 'EditMenu',
  standalone: true,
  imports: [CommonModule, ImgButton, FontSizeMenu],
  templateUrl: './EditMenu.component.html',
  styleUrls: ['./EditMenu.component.css']
})
export class EditMenu {
  fontSize : number = 16;
  @ViewChild(FontSizeMenu) fontSizeMenu! : FontSizeMenu;

  constructor() {}

  undoButtonProps : ImgButtonProp = {
    Button: {
      OnClick: this.UndoButtonOnClick
    },
    Img: {
      Src: '/assets/UndoIcon.svg',
      Alt: 'Undo icon'
    }
  }

  UpdateDisplay(tagStyle : NoteNodeStyles | null) {
    if (tagStyle && tagStyle.fontSize !== undefined) {
      this.fontSizeMenu.SetSelected(tagStyle.fontSize);
      this.UpdateFontSizeDisplay(tagStyle.fontSize);
      return;
    }
    this.fontSizeMenu.SetSelected(16);
    this.UpdateFontSizeDisplay(16);
  }

  UpdateFontSizeDisplay(value : number) {
    this.fontSize = value;
    SelectionManager.SetSelection();
  }

  FontSizeButtonOnClick(event : Event) {
    let width = window.visualViewport?.width;
    if (width == undefined)
      return;
    
    SelectionManager.UpdateSelection();
    FontSizeMenu.Toggle(parseFloat((width * 0.65).toFixed(2)), -192);
    event.stopPropagation();
  }

  UndoButtonOnClick() {

  }
}
