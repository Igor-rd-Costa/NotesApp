import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayModeService, SideMenuDisplayMode } from 'src/app/Services/DisplayModeService';
import { NoteSettings } from 'src/app/Services/NotesService';

@Component({
  standalone: true,
  selector: 'NoteCard',
  templateUrl: './NoteCard.component.html',
  styleUrls: ['./NoteCard.component.css']
})
export class NoteCard implements AfterViewInit {
  @Input() noteId: string = "";
  @Input() noteName: string = "";
  @Input() noteDate: string = "";
  @Input() notePreview: HTMLParagraphElement[] = [];
  @Input() settings : {
    backgroundColor: string,
    marginFormat: string,
    marginLeft: number,
    marginRight: number,
    marginTop: number,
    marginBottom: number,
  } = {backgroundColor: "#FFFFFFFF", marginFormat: 'px', marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0};

  constructor(private router : Router) {
    
  }

  ngAfterViewInit(): void {
    let note = document.getElementsByClassName(this.noteId)[0] as HTMLElement;
    if (note) {
      while (note.childNodes.length > 0) {
        note.removeChild(note.childNodes[0]);
      }
      this.notePreview.forEach(paragraph => {
        note.appendChild(paragraph);
      })
    }
  }

  OnClick() {
    if (DisplayModeService.GetSideMenuDisplayMode() != SideMenuDisplayMode.VISIBLE) {
      this.router.navigate(["note", this.noteId]);
    }
  }
}
