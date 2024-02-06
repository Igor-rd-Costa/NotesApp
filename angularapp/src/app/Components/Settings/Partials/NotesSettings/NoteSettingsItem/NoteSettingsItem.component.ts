import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteSettingsCardInfo } from 'src/app/Services/NotesService';
import { Router } from '@angular/router';

@Component({
  selector: 'NoteSettingsItem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NoteSettingsItem.component.html',
  styleUrls: ['./NoteSettingsItem.component.css']
})
export class NoteSettingsItem {
  @Input() cardInfo! : NoteSettingsCardInfo;

  constructor(private router : Router) {}

  OpenNoteSettings() {
    this.router.navigate(['settings', 'note', this.cardInfo.guid]);
  }
}
