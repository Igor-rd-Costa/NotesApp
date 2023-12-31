import { Component, effect } from '@angular/core';
import { HandleTouchStart, HandleTouchMove, HandleTouchEnd, HandleWheel, touchInfo, ResetTouchInfoData } from './Utils/GlobalEventHandlers'
import { DisplayModeService, AppDisplayMode, HeaderDisplayMode, SideMenuDisplayMode } from './Services/DisplayModeService';
import AnimateElement from './Utils/Animate';
import { Router } from '@angular/router';

let scrollTopAtTouch : number = 0;
let folderDisplayLargeHeight : string = "";
let isHeaderVisible : boolean = true;



export function SetScrollTop(value : number) {
  scrollTopAtTouch = value;
}

function HideHeader() {
  const Header = document.getElementsByClassName("header-section")[0] as HTMLElement;
  const FolderName = Header.querySelector("#folder-name") as HTMLElement;
  const NoteCount = Header.querySelector("#note-count") as HTMLElement;

  const HeaderMenu = document.getElementsByClassName("header-menu-section")[0] as HTMLElement;
  const FolderNameSmall = HeaderMenu.querySelector("#folder-name") as HTMLElement;
  folderDisplayLargeHeight = getComputedStyle(Header).height;
  AnimateElement(Header, { height: folderDisplayLargeHeight }, { height: "1vh" }, 200);
  AnimateElement(FolderName, { opacity: 1 }, { opacity: 0 }, 90);
  AnimateElement(NoteCount, {  opacity: 1 },{ opacity: 0 }, 90)
  .addEventListener('finish', () => {
      AnimateElement(FolderNameSmall, { opacity: 0 }, { opacity: 1 }, 90)
      .addEventListener('finish', () => {
        DisplayModeService.SetHeaderDisplayMode(HeaderDisplayMode.HEADER_HIDDEN);
      });
  })
  isHeaderVisible = false;
}

function ShowHeader() {
  const Header = document.getElementsByClassName("header-section")[0] as HTMLElement;
  const FolderName = Header.querySelector("#folder-name") as HTMLElement;
  const NoteCount = Header.querySelector("#note-count") as HTMLElement;

  const HeaderMenu = document.getElementsByClassName("header-menu-section")[0] as HTMLElement;
  const FolderNameSmall = HeaderMenu.querySelector("#folder-name") as HTMLElement;

  AnimateElement(Header, { height: "1vh" }, { height: folderDisplayLargeHeight }, 200);
  AnimateElement(FolderName, { opacity: 0 }, { opacity: 1 }, 90);
  AnimateElement(FolderNameSmall, { opacity: 1 }, { opacity: 0 }, 90) 
  .addEventListener('finish', () => { 
      AnimateElement(NoteCount, { opacity: 0 }, {  opacity: 1 }, 90)
      .addEventListener('finish', () => {
        DisplayModeService.SetHeaderDisplayMode(HeaderDisplayMode.HEADER_LARGE);
      })
  });
  isHeaderVisible = true;
}

interface AppEvents {
  OnTouchStart: (event : TouchEvent) => void,
  OnTouchMove: (event: TouchEvent) => void,
  OnTouchEnd: () => void,
  OnWheel: (event : WheelEvent) => void
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class App {
  title = 'notes-app';
  private static scrollTargetId: string = "notes-app";
  DisplayModeService = DisplayModeService;
  AppDisplayMode = AppDisplayMode;

  public appEvents : AppEvents = {
    OnTouchStart: (event : TouchEvent) => {},
    OnTouchMove: (event : TouchEvent) => {},
    OnTouchEnd: () => {},
    OnWheel: (event : WheelEvent) => {}
  }
  
  constructor(private router : Router,) {
    effect(() => {
      switch (DisplayModeService.GetAppDisplayMode()) {
        case AppDisplayMode.NOTE_LIST: {
          this.appEvents.OnTouchStart = this.OnTouchStart;
          this.appEvents.OnTouchMove = this.OnTouchMove;
          this.appEvents.OnTouchEnd = this.OnTouchEnd;
          this.appEvents.OnWheel = this.OnWheel;
          const headerDisplay: HeaderDisplayMode = DisplayModeService.GetHeaderDisplayMode();
          if (headerDisplay === HeaderDisplayMode.HEADER_LARGE) {
            App.scrollTargetId = "notes-app";
            isHeaderVisible = true;
            ResetTouchInfoData(touchInfo);
          }
          else {
            App.scrollTargetId = "notes-main";
            isHeaderVisible = false;
            ResetTouchInfoData(touchInfo);
          }
          this.router.navigate(['']);
        } break;
        case AppDisplayMode.NOTE_DISPLAY: {
          this.appEvents.OnTouchStart = (event: TouchEvent) => { };
          this.appEvents.OnTouchMove = (event: TouchEvent) => { };
          this.appEvents.OnTouchEnd = () => { };
          this.appEvents.OnWheel = (event: WheelEvent) => { };
        } break;
      }
    })
  }

  OnTouchStart(event : TouchEvent) {
    HandleTouchStart(event);
    const AppElement = document.getElementById(App.scrollTargetId) as HTMLElement;
    scrollTopAtTouch = AppElement.scrollTop;
  }

  OnTouchMove(event : TouchEvent) {
    HandleTouchMove(event);
  }

  OnTouchEnd() {
    HandleTouchEnd();
    if (scrollTopAtTouch < 20) {
      if (touchInfo.touchDelta.Y < -1 && isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        HideHeader();
      else if (touchInfo.touchDelta.Y > 0 && !isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        ShowHeader();
  }
    const AppElement = document.getElementById(App.scrollTargetId) as HTMLElement;
    scrollTopAtTouch = AppElement.scrollTop;
  }

  OnWheel(event : WheelEvent) {
    HandleWheel(event);
    const AppElement = document.getElementById(App.scrollTargetId) as HTMLElement;
    scrollTopAtTouch = AppElement.scrollTop;
    if (scrollTopAtTouch < 20) {
      if (touchInfo.wheelDelta.Y > 0 && isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        HideHeader();
      else if (touchInfo.wheelDelta.Y < 0 && !isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        ShowHeader();
    }
  }
}
