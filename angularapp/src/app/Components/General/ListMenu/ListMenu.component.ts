import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { App } from 'src/app/App.component';
import { ClickHighlight } from 'src/app/Utils/ClickHighlight';

export interface ListMenuItem {
  content: string,
  onClick: {
    func: (event : MouseEvent | TouchEvent) => void,
    src : object 
  } | null,
    iconSrc?: string
}

export interface ListMenuPosition {
  top: number | string,
  left: number | string,
  bottom: number | string,
  right: number | string
}

@Component({
  selector: 'ListMenu',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf ],
  templateUrl: './ListMenu.component.html',
  styleUrls: ['./ListMenu.component.css']
})
export class ListMenu extends ClickHighlight {
  @Input() items : ListMenuItem[] = [];
  @Input() id: string = `list-menu`;
  @Input() triggerId: string | null = null;
  @Input() top: string = "auto";
  @Input() left: string = "auto";
  @Input() bottom: string = "auto";
  @Input() right: string = "auto";
  @Input() width : string = '8rem';
  @Input() height : string = 'fit-content';
  @Input() itemHeight : string = "2rem";
  @Input() selectable : boolean = true;
  @Input() hasIcons : boolean = false;
  
  @Output() select : EventEmitter<HTMLLIElement> = new EventEmitter<HTMLLIElement>;
  
  @ViewChild("listElement") listElement! : ElementRef;
  isVisible : boolean = false;
  selected : HTMLLIElement | null = null;
  constructor() {
    super();
    App.RegisterClickWatcher(this.OnAppClick, this);
  }

  ToggleVisibility() {
    this.isVisible = !this.isVisible;
    if (this.selected)
      this.listElement.nativeElement.scrollTop = this.selected.offsetTop;
  }

  SetSelectedByContent(content : string, emitEvent : boolean) {
    if (!this.selectable)
      return;

    const list = this.listElement.nativeElement as HTMLUListElement;
    for (let i = 0; i < list.children.length; i++) {
      if (list.children[i].tagName === "LI") {
        const listItem = list.children[i] as HTMLLIElement;
        if (listItem.firstChild && listItem.firstChild.textContent?.trim() === content) {
          if (this.selected)
            this.selected.classList.remove("selected");
          listItem.classList.add("selected");
          this.selected = listItem;
          if (emitEvent)
            this.select.emit(listItem);
        }
      }
    }
  }

  OnClick(event : MouseEvent) {
    if (event.target === null || (event.target as HTMLElement).tagName !== "LI")
      return;

    const target = event.target as HTMLLIElement;
    if (this.selectable) {
      if (this.selected)
      this.selected.classList.remove("selected");
      target.classList.add("selected");
      this.selected = target;
    }
    this.select.emit(target);
  }

  OnAppClick(event : Event) {
    if (event.target === null || this.isVisible === false)
      return;
    
    const target = event.target as HTMLElement;
    if (target.closest(`#${this.id}`) === null && (this.triggerId === null || target.closest(`#${this.triggerId}`) === null)) {
      this.ToggleVisibility();
    }    
  }

  CallItemFunc(item : ListMenuItem, event : MouseEvent) {
    if (item.onClick === null)
      return;

    item.onClick.func.call(item.onClick.src, event);
  }
}
