import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from 'src/app/Components/General/ImgButton/ImgButton.component';
import { FontSizeMenu } from './Menus/FontSizeMenu/FontSizeMenu.component';
import { SelectionManager } from 'src/app/Services/SelectionManager';
import { NoteFormater, SpanStyle } from 'src/app/Utils/NoteFormater';

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

  UpdateDisplay(tagStyle : SpanStyle | null) {
    if (tagStyle === null) {
      this.fontSizeMenu.SetSelected(16);
      this.UpdateFontSizeDisplay(16);
    } else {
      if (tagStyle.fontSize !== undefined) {
        const value = parseInt(tagStyle.fontSize);
        this.fontSizeMenu.SetSelected(value);
        this.UpdateFontSizeDisplay(value);
      }
    }
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

  OnClickTest() {
    NoteFormater.Test();

  }

}
