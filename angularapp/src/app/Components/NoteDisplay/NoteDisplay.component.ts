import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteDisplayMain } from './NoteDisplayMain/NoteDisplayMain.component';
import { NoteDisplayHeader } from './NoteDisplayHeader/NoteDisplayHeader.component';
import { ActivatedRoute } from '@angular/router';
import { AppDisplayMode, DisplayModeService } from 'src/app/Services/DisplayModeService';
import { NoteInfo, NotesService } from 'src/app/Services/NotesService';

@Component({
  selector: 'NoteDisplay',
  standalone: true,
  imports: [CommonModule, NoteDisplayMain, NoteDisplayHeader ],
  templateUrl: './NoteDisplay.component.html',
  styleUrls: ['./NoteDisplay.component.css']
})
export class NoteDisplay {
noteInfo : NoteInfo = {
  id: "",
  name: "",
  content: "",
  date: ""
};

  constructor(private route : ActivatedRoute, private notesService : NotesService) {
    this.route.paramMap.subscribe(value => {
      const guid = value.get("guid");
      if (guid == null) {
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
        return;
      }
      this.notesService.GetNote(guid).subscribe((note) => {
        let content : string = "";
        let index : number = 0;
        let start : number = 0;
        while(true) {
          index = note.content.indexOf('\n', index);
          
          if (index === -1)
            break;
        
          content += `<span>${note.content.substring(start, index)}</span><br>`;
          index++;
          start = index;
        }
        note.content = content;
        this.noteInfo = note;
      });
    })
  }

}
