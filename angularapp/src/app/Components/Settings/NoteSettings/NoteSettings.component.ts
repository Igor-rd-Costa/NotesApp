import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotePreview } from './Partials/NotePreview/NotePreview.component';
import { NumberInput } from './Partials/NumberInput/NumberInput.component';
import { MarginFormat, NotesService } from 'src/app/Services/NotesService';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteManager } from 'src/app/Services/NoteManager';
import { MarginSettings } from './Partials/MarginSettings/MarginSettings.component';
import { BackgroundColorSettings } from './Partials/BackgroundColorSettings/BackgroundColorSettings.component';

@Component({
  selector: 'NoteSettings',
  standalone: true,
  imports: [CommonModule, NotePreview, MarginSettings, BackgroundColorSettings, NumberInput ],
  templateUrl: './NoteSettings.component.html',
  styleUrls: ['./NoteSettings.component.css']
})
export class NoteSettings {
  protected increment : number = 1;
  protected fractionDigits : number = 0;
  protected marginFormat : MarginFormat = 'px';
  protected marginLeft : number = 0;
  protected marginRight : number = 0;
  protected marginTop : number = 0;
  protected marginBottom : number = 0;
  protected backgroundColor : string = "0xFFFFFFFF";
  
  constructor(private router : Router, private route : ActivatedRoute, private noteManager : NoteManager, private noteService : NotesService) {
    this.route.paramMap.subscribe(value => {
      const guid = value.get('guid');
      if (guid === null) {
        this.router.navigate(['']);
        return;
      }
      this.noteManager.Load(guid);
      effect(() => {
        this.marginFormat = this.noteManager.GetNoteMarginFormat();
        if (this.marginFormat === 'px') {
          this.increment = 1;
          this.fractionDigits = 0;
        } else {
          this.increment = 0.1;
          this.fractionDigits = 2;
        }
        this.marginLeft = this.noteManager.GetNoteMarginLeft();
        this.marginRight = this.noteManager.GetNoteMarginRight();
        this.marginTop = this.noteManager.GetNoteMarginTop();
        this.marginBottom = this.noteManager.GetNoteMarginBottom();
        this.backgroundColor = this.noteManager.GetNoteBackgroundColor();
      })
    })
  }

  protected MarginFormatChange(event : Event) {
    if (event.target === null)
      return;
    const target = event.target as HTMLSelectElement;
    const val = target.value;
    if (val === 'px' || val === 'cm')
    {
      this.marginFormat = val;
      this.noteService.UpdateSettings(this.noteManager.GetNoteGuid(), 'marginFormat', val).subscribe();
      if (val === 'px') {
        this.increment = 1;
        this.fractionDigits = 0;
      } else {
        this.increment = 0.1;
        this.fractionDigits = 2;
      } 
    }
  }

  protected ChangeMarginLeft(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.marginLeft = newVal;
    this.noteService.UpdateSettings(this.noteManager.GetNoteGuid(), 'marginLeft', newVal.toString()).subscribe();
  }

  protected ChangeMarginRight(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.marginRight = newVal;
    this.noteService.UpdateSettings(this.noteManager.GetNoteGuid(), 'marginRight', newVal.toString()).subscribe();
  }

  protected ChangeMarginTop(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.marginTop = newVal;
    this.noteService.UpdateSettings(this.noteManager.GetNoteGuid(), 'marginTop', newVal.toString()).subscribe();
  }

  protected ChangeMarginBottom(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.marginBottom = newVal;
    this.noteService.UpdateSettings(this.noteManager.GetNoteGuid(), 'marginBottom', newVal.toString()).subscribe();
  }
}
