import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInput } from '../NumberInput/NumberInput.component';
import { MarginFormat } from 'src/app/Services/NotesService';
import { NoteManager } from 'src/app/Services/NoteManager';
import { SettingTitle } from '../SettingTitle/SettingTitle.component';

export enum MarginInputType {
  MARGIN_FORMAT, MARGIN_LEFT, MARGIN_RIGHT, MARGIN_TOP, MARGIN_BOTTOM
}

export type MarginInputChange = {
  type: MarginInputType,
  value: string
}

@Component({
  selector: 'MarginSettings',
  standalone: true,
  imports: [CommonModule, NumberInput, SettingTitle ],
  templateUrl: './MarginSettings.component.html',
  styleUrls: ['./MarginSettings.component.css']
})
export class MarginSettings implements OnChanges {
  @Input() increment : number = 1;
  @Input() fractionDigits : number = 0;
  @Input() marginFormat : MarginFormat = 'px';
  @Input() marginLeft : number = 0;
  @Input() marginRight : number = 0;
  @Input() marginTop : number = 0;
  @Input() marginBottom : number = 0;
  @Output() onInputChange = new EventEmitter<MarginInputChange>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.marginFormat == 'px') {
      this.increment = 1;
      this.fractionDigits = 0;
    } else {
      this.increment = 0.1;
      this.fractionDigits = 2;
    } 
  }
  
  protected MarginFormatChange(event : Event) {
    if (event.target === null)
      return;
    const target = event.target as HTMLSelectElement;
    const val = target.value;
    if (val === 'px' || val === 'cm')
    {
      if (val === 'px') {
        this.increment = 1;
        this.fractionDigits = 0;
      } else {
        this.increment = 0.1;
        this.fractionDigits = 2;
      } 
      this.onInputChange.emit({type: MarginInputType.MARGIN_FORMAT, value: val});
    }
  }

  protected ChangeMarginLeft(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.onInputChange.emit({type: MarginInputType.MARGIN_LEFT, value: newVal.toString()})
  }

  protected ChangeMarginRight(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.onInputChange.emit({type: MarginInputType.MARGIN_RIGHT, value: newVal.toString()})
  }

  protected ChangeMarginTop(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.onInputChange.emit({type: MarginInputType.MARGIN_TOP, value: newVal.toString()})
  }

  protected ChangeMarginBottom(newVal : number) {
    if (this.marginFormat === 'px')
      newVal = Math.floor(newVal);
    this.onInputChange.emit({type: MarginInputType.MARGIN_BOTTOM, value: newVal.toString()})
  }
}
