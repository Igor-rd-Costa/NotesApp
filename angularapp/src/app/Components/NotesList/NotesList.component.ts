import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListHeader } from './NotesListHeader/NotesListHeader.component';
import { NotesListMain } from './NotesListMain/NotesListMain.component';
import { DisplayModeService, HeaderDisplayMode, SideMenuDisplayMode } from 'src/app/Services/DisplayModeService';
import { NotesService } from 'src/app/Services/NotesService';
import { HandleTouchStart, HandleTouchMove, HandleTouchEnd, HandleWheel, touchInfo, ResetTouchInfoData } from 'src/app/Utils/GlobalEventHandlers'
import AnimateElement from 'src/app/Utils/Animate';
import { SideMenu } from './SideMenu/SideMenu.component';

@Component({
  selector: 'NotesList',
  standalone: true,
  imports: [CommonModule, NotesListHeader, NotesListMain, SideMenu ],
  templateUrl: './NotesList.component.html',
  styleUrls: ['./NotesList.component.css']
})
export class NotesList {
  protected noteCount = signal<number>(0);
  private scrollTargetId: string = "notes-app";
  private scrollTopAtTouch : number = 0;
  private folderDisplayLargeHeight : string = "";
  private isHeaderVisible : boolean = true;
  
  constructor(private noteService : NotesService) {
    this.noteService.GetNoteCount().subscribe(count => {this.noteCount.set(count)});
    effect(() => {
          const headerDisplay: HeaderDisplayMode = DisplayModeService.GetHeaderDisplayMode();
          if (headerDisplay === HeaderDisplayMode.HEADER_LARGE) {
            this.scrollTargetId = "notes-app";
            this.isHeaderVisible = true;
            ResetTouchInfoData(touchInfo);
          }
          else {
            this.scrollTargetId = "notes-main";
            this.isHeaderVisible = false;
            ResetTouchInfoData(touchInfo);
          }
    });
  }

  protected OnClick(event : MouseEvent) : void { 
    if (DisplayModeService.GetSideMenuDisplayMode() === SideMenuDisplayMode.VISIBLE) {
      if ((event.target as HTMLElement).closest("#profile-menu") === null && SideMenu.isProfileMenuVisible) {
        SideMenu.HideProfileMenu();
      }

      if ((event.target as HTMLElement).closest("sidemenu") === null)
        DisplayModeService.NotesListDisplayMode.HideSideMenu();
    }
  }

  protected OnTouchStart(event : TouchEvent) {
    HandleTouchStart(event);
    const AppElement = document.getElementById(this.scrollTargetId) as HTMLElement;
    this.scrollTopAtTouch = AppElement.scrollTop;
  }

  protected OnTouchMove(event : TouchEvent) {
    HandleTouchMove(event);
  }

  protected OnTouchEnd() {
    HandleTouchEnd();
    if (this.scrollTopAtTouch < 20) {
      if (touchInfo.touchDelta.Y < -1 && this.isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        this.HideHeader();
      else if (touchInfo.touchDelta.Y > 0 && !this.isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        this.ShowHeader();
  }
    const AppElement = document.getElementById(this.scrollTargetId) as HTMLElement;
    this.scrollTopAtTouch = AppElement.scrollTop;
  }

  protected OnWheel(event : WheelEvent) {
    HandleWheel(event);
    const AppElement = document.getElementById(this.scrollTargetId) as HTMLElement;
    this.scrollTopAtTouch = AppElement.scrollTop;
    if (this.scrollTopAtTouch < 20) {
      if (touchInfo.wheelDelta.Y > 0 && this.isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        this.HideHeader();
      else if (touchInfo.wheelDelta.Y < 0 && !this.isHeaderVisible && DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE)
        this.ShowHeader();
    }
  }

  protected OnMainScrollTop() {
    this.scrollTopAtTouch = 0;
  }

  private HideHeader() {
    const Header = document.getElementsByClassName("header-section")[0] as HTMLElement;
    const FolderName = Header.querySelector("#folder-name") as HTMLElement;
    const NoteCount = Header.querySelector("#note-count") as HTMLElement;
  
    const HeaderMenu = document.getElementsByClassName("header-menu-section")[0] as HTMLElement;
    const FolderNameSmall = HeaderMenu.querySelector("#folder-name") as HTMLElement;
    this.folderDisplayLargeHeight = getComputedStyle(Header).height;
    AnimateElement(Header, { height: this.folderDisplayLargeHeight }, { height: "1vh" }, 200);
    AnimateElement(FolderName, { opacity: 1 }, { opacity: 0 }, 90);
    AnimateElement(NoteCount, {  opacity: 1 },{ opacity: 0 }, 90)
    .addEventListener('finish', () => {
        AnimateElement(FolderNameSmall, { opacity: 0 }, { opacity: 1 }, 90)
        .addEventListener('finish', () => {
          DisplayModeService.SetHeaderDisplayMode(HeaderDisplayMode.HEADER_HIDDEN);
        });
    })
    this.isHeaderVisible = false;
  }
  
  private ShowHeader() {
    const Header = document.getElementsByClassName("header-section")[0] as HTMLElement;
    const FolderName = Header.querySelector("#folder-name") as HTMLElement;
    const NoteCount = Header.querySelector("#note-count") as HTMLElement;
  
    const HeaderMenu = document.getElementsByClassName("header-menu-section")[0] as HTMLElement;
    const FolderNameSmall = HeaderMenu.querySelector("#folder-name") as HTMLElement;
  
    AnimateElement(Header, { height: "1vh" }, { height: this.folderDisplayLargeHeight }, 200);
    AnimateElement(FolderName, { opacity: 0 }, { opacity: 1 }, 90);
    AnimateElement(FolderNameSmall, { opacity: 1 }, { opacity: 0 }, 90) 
    .addEventListener('finish', () => { 
        AnimateElement(NoteCount, { opacity: 0 }, {  opacity: 1 }, 90)
        .addEventListener('finish', () => {
          DisplayModeService.SetHeaderDisplayMode(HeaderDisplayMode.HEADER_LARGE);
        })
    });
    this.isHeaderVisible = true;
  }
}
