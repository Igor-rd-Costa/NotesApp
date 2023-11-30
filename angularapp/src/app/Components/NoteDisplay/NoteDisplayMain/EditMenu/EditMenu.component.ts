import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from 'src/app/Components/General/ImgButton/ImgButton.component';
import { NoteSelection, SelectionManager } from 'src/app/Services/SelectionManager';
import { NoteFormater, NoteNodeStyles } from 'src/app/Services/NoteFormater';
import { ListMenu, ListMenuItem } from 'src/app/Components/General/ListMenu/ListMenu.component';
import { NoteManager } from 'src/app/Services/NoteManager';

@Component({
  selector: 'EditMenu',
  standalone: true,
  imports: [CommonModule, ImgButton, ListMenu ],
  templateUrl: './EditMenu.component.html',
  styleUrls: ['./EditMenu.component.css']
})
export class EditMenu implements AfterViewInit {
  fontSize : number = 16;
  @ViewChild(ListMenu) listMenu! : ListMenu;
  constructor(private noteManager : NoteManager, private noteFormater : NoteFormater) {}

  ngAfterViewInit(): void {
    this.listMenu.SetSelectedByContent("16", false);
  }

  undoButtonProps : ImgButtonProp = {
    Button: {},
    Img: {
      Src: '/assets/UndoIcon.svg',
      Alt: 'Undo icon'
    }
  }

  fontSizeMenuItems : ListMenuItem[] = [
    {content: "6",  onClick: null},
    {content: "7",  onClick: null},
    {content: "8",  onClick: null},
    {content: "9",  onClick: null},
    {content: "10", onClick: null},
    {content: "11", onClick: null},
    {content: "12", onClick: null},
    {content: "13", onClick: null},
    {content: "14", onClick: null},
    {content: "15", onClick: null},
    {content: "16", onClick: null},
    {content: "17", onClick: null},
    {content: "18", onClick: null},
    {content: "19", onClick: null},
    {content: "20", onClick: null},
    {content: "22", onClick: null},
    {content: "24", onClick: null},
    {content: "26", onClick: null},
    {content: "28", onClick: null},
    {content: "30", onClick: null},
    {content: "32", onClick: null},
    {content: "34", onClick: null},
    {content: "36", onClick: null},
    {content: "38", onClick: null},
    {content: "40", onClick: null},
    {content: "44", onClick: null},
    {content: "48", onClick: null},
    {content: "52", onClick: null},
    {content: "56", onClick: null},
    {content: "60", onClick: null},
    {content: "64", onClick: null},
  ]

  UpdateDisplay(tagStyle : NoteNodeStyles | null) {
    if (tagStyle && tagStyle.fontSize !== undefined) {
      this.UpdateFontSizeDisplay(tagStyle.fontSize);
      return;
    }
    this.UpdateFontSizeDisplay(16);
  }

  UpdateFontSizeDisplay(value : number) {
    this.fontSize = value;
    this.listMenu.SetSelectedByContent(value.toString(), false);
  }

  FontSizeButtonOnClick(event : Event) {
    //event.stopPropagation();
    this.listMenu.ToggleVisibility();
    SelectionManager.UpdateSelection();
  }

  OnFontSizeSelect(element : HTMLLIElement) {
    const value : number = parseInt(element.innerText);
    const newContent = this.noteFormater.SetFontSize(value);
    this.UpdateFontSizeDisplay(value);
    this.noteManager.SaveNote(newContent);
    SelectionManager.RestoreSelection();
    this.listMenu.ToggleVisibility();
  }
}
