import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteDisplayMain } from './NoteDisplayMain/NoteDisplayMain.component';
import { NoteDisplayHeader } from './NoteDisplayHeader/NoteDisplayHeader.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteManager } from 'src/app/Services/NoteManager'; 

@Component({
  selector: 'NoteDisplay',
  standalone: true,
  imports: [CommonModule, NoteDisplayMain, NoteDisplayHeader ],
  templateUrl: './NoteDisplay.component.html',
  styleUrls: ['./NoteDisplay.component.css']
})
export class NoteDisplay {

  constructor(private router : Router, private route : ActivatedRoute, protected noteManager : NoteManager) {
    this.route.paramMap.subscribe(value => {
      const guid = value.get("guid");
      if (guid == null) {
        this.router.navigate(['']);
        return;
      }
      this.noteManager.Load(guid);
    })
  }

}
