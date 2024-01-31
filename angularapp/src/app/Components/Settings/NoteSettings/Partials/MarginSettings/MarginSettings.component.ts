import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInput } from '../NumberInput/NumberInput.component';
import { MarginFormat } from 'src/app/Services/NotesService';
import { NoteManager } from 'src/app/Services/NoteManager';

@Component({
  selector: 'MarginSettings',
  standalone: true,
  imports: [CommonModule, NumberInput ],
  templateUrl: './MarginSettings.component.html',
  styleUrls: ['./MarginSettings.component.css']
})
export class MarginSettings {
  protected increment : number = 1;
  protected fractionDigits : number = 0;
  protected marginFormat : MarginFormat = 'px';
  protected marginLeft : number = 0;
  protected marginRight : number = 0;
  protected marginTop : number = 0;
  protected marginBottom : number = 0;

  constructor(private noteManager : NoteManager) {
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
    })
  }
  
  protected MarginFormatChange(event : Event) {
    if (event.target === null)
      return;
    const target = event.target as HTMLSelectElement;
    const val = target.value;
    if (val === 'px' || val === 'cm')
    {
      this.noteManager.UpdateMarginFormat(val);
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
    this.noteManager.UpdateMarginLeft(newVal);
  }

  protected ChangeMarginRight(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.noteManager.UpdateMarginRight(newVal);
  }

  protected ChangeMarginTop(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.noteManager.UpdateMarginTop(newVal);
  }

  protected ChangeMarginBottom(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.noteManager.UpdateMarginBottom(newVal);
  }
}
