import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from './Page/Page.component';
import { ImgButton } from '../../General/ImgButton/ImgButton.component';
import { EditMenu } from './EditMenu/EditMenu.component';
import { NoteManager } from 'src/app/Services/NoteManager';
import { NoteFormater } from 'src/app/Services/NoteFormater';
import { SelectionManager } from 'src/app/Services/SelectionManager';

@Component({
  selector: 'NoteDisplayMain',
  standalone: true,
  imports: [CommonModule, Page, ImgButton, EditMenu ],
  templateUrl: './NoteDisplayMain.component.html',
  styleUrls: ['./NoteDisplayMain.component.css']
})
export class NoteDisplayMain {
  constructor(protected noteManager : NoteManager, private noteFormater : NoteFormater) {
    
  }
  @ViewChild(EditMenu) editMenu! : EditMenu;

  OnKeyDown(event : KeyboardEvent) { 
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      this.UpdateDisplay();
    }
  }

  UpdateDisplay() { // Updates the display with information about the element that contains the caret.
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection !== null) {
        const anchor : Node | null = selection.anchorNode;
        if (anchor !== null) {
          let parent = anchor;
          while (parent.nodeName !== "P" && parent.nodeName !== "SPAN" && parent.parentElement !== null) {
            parent = parent.parentElement;
          }
          if (parent === this.noteFormater.GetFocusedElement())
            return;

          this.noteFormater.SetFocusedElement(parent as HTMLElement);
          if (parent.nodeName === "P") {
            this.editMenu.UpdateDisplay(null);
          } else if (parent.nodeName === "SPAN") {
            let tagStyle = this.noteFormater.GetSpanStyle(parent as HTMLSpanElement);
            this.editMenu.UpdateDisplay(tagStyle);
          } else {
            console.error("Font display update error: Unexpected anchor node", parent);
          }
        }
      }
    }, 10);
  }
}
