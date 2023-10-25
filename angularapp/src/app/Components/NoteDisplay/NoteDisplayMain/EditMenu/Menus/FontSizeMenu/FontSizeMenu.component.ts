import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from 'src/app/App.component';

@Component({
  selector: 'FontSizeMenu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './FontSizeMenu.component.html',
  styleUrls: ['./FontSizeMenu.component.css']
})
export class FontSizeMenu implements AfterViewInit {
  private static isVisible : boolean = false;
  private static selected : HTMLLIElement;
  @Output() SelectionChange = new EventEmitter<number>(false);

  ngAfterViewInit(): void {
    const menu = document.getElementById("font-size-menu") as HTMLElement;
    const lis = menu.getElementsByTagName("LI");
    App.RegisterClickWatcher(this.OnAppClick);

    for (let i = 0; i < lis.length; i++) {
      if ((lis[i] as HTMLLIElement).firstChild?.nodeValue?.trim() === "16") {
        console.log("Selected", lis[i]);
        FontSizeMenu.selected = lis[i] as HTMLLIElement;
        FontSizeMenu.selected.classList.add("selected");
        break;
      }
    }
  }

  top : string = "0px";
  left : string = "0px";
  
  OnAppClick(event : Event) {
    if (event.target === null || FontSizeMenu.isVisible === false) {
      return;

    }
    
    const target = event.target as HTMLElement;
    if (target.closest("#font-size-menu") === null) {
      FontSizeMenu.Hide();
    }    
  }

  public static Toggle(x : number, y : number) {
    FontSizeMenu.isVisible === true ? FontSizeMenu.Hide() : FontSizeMenu.Show(x, y);
  }

  public static Show(x : number, y : number) {
    const menu = document.getElementById("font-size-menu") as HTMLElement;
    if (menu == null)
      return;

    menu.style.left = x + "px";
    menu.style.top = y + "px";
    menu.style.visibility = "visible";
    FontSizeMenu.isVisible = true;
  }

  public static Hide() {
    const menu = document.getElementById("font-size-menu") as HTMLElement;
    if (menu == null)
      return;

    menu.style.visibility = "hidden";
    FontSizeMenu.isVisible = false;   
  }

  Select(event : Event) {
    const target = event.target as HTMLLIElement;
    if (target === null || event.target instanceof HTMLLIElement === false 
      || target.firstChild === null || target.firstChild.nodeValue === null) {
      return;
    }

    FontSizeMenu.selected.classList.remove("selected");
    target.classList.add("selected");
    let value : number = parseInt(target.firstChild.nodeValue.trim());
    FontSizeMenu.selected = target;
    this.SelectionChange.emit(value);
  }
}
