import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteDisplayMain } from './NoteDisplayMain/NoteDisplayMain.component';
import { NoteDisplayHeader } from './NoteDisplayHeader/NoteDisplayHeader.component';
import { ActivatedRoute } from '@angular/router';
import { AppDisplayMode, DisplayModeService } from 'src/app/Services/DisplayModeService';
import { NoteManager } from 'src/app/Services/NoteManager'; 

@Component({
  selector: 'NoteDisplay',
  standalone: true,
  imports: [CommonModule, NoteDisplayMain, NoteDisplayHeader ],
  templateUrl: './NoteDisplay.component.html',
  styleUrls: ['./NoteDisplay.component.css']
})
export class NoteDisplay {
  noteId : string = "";
  noteName : string = "";

  constructor(private route : ActivatedRoute, private noteManager : NoteManager) {
    effect(() => {
      this.noteId = this.noteManager.GetNoteId();
      this.noteName = this.noteManager.GetNoteName();
    })

    this.route.paramMap.subscribe(value => {
      const guid = value.get("guid");
      if (guid == null) {
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
        return;
      }
      this.noteManager.Load(guid);
    })
  }

}
