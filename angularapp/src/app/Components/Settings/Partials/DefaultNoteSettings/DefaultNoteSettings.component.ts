import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarginFormat, NotesService } from 'src/app/Services/NotesService';
import { NotePreview } from '../Components/NotePreview/NotePreview.component';
import { MarginInputChange, MarginInputType, MarginSettings } from '../Components/MarginSettings/MarginSettings.component';
import { BackgroundColorSettings } from '../Components/BackgroundColorSettings/BackgroundColorSettings.component';
import { NumberInput } from '../Components/NumberInput/NumberInput.component';

@Component({
  selector: 'DefaultNoteSettings',
  standalone: true,
  imports: [CommonModule, NotePreview, MarginSettings, BackgroundColorSettings, NumberInput ],
  templateUrl: './DefaultNoteSettings.component.html',
  styleUrls: ['./DefaultNoteSettings.component.css']
})
export class DefaultNoteSettings {
  protected increment : number = 1;
  protected fractionDigits : number = 0;
  protected marginFormat = signal<MarginFormat>('px');
  protected marginLeft = signal<number>(0);
  protected marginRight = signal<number>(0);
  protected marginTop = signal<number>(0);
  protected marginBottom = signal<number>(0);
  protected backgroundColor = signal("0xFFFFFFFF");

  constructor(private noteService : NotesService) {
    this.noteService.GetDefaultNoteSettings().subscribe(settings => {
      console.log(settings);
      this.marginFormat.set(settings.marginFormat);
      this.marginLeft.set(settings.marginLeft);
      this.marginRight.set(settings.marginRight);
      this.marginTop.set(settings.marginTop);
      this.marginBottom.set(settings.marginBottom);
      this.backgroundColor.set(settings.backgroundColor);
    });

    effect(() => {
      if (this.marginFormat() === 'px') {
        this.increment = 1;
        this.fractionDigits = 0;
      } else {
        this.increment = 0.1;
        this.fractionDigits = 2;
      }
    })
  }

  protected HandleMarginChange(event : MarginInputChange) {
    switch(event.type) {
      case MarginInputType.MARGIN_FORMAT: {
        this.noteService.UpdateDefaultSettings('marginFormat', event.value as MarginFormat).subscribe(a => {
          this.marginFormat.set(event.value as MarginFormat);
        });
      } break;
      case MarginInputType.MARGIN_LEFT: {
        this.noteService.UpdateDefaultSettings('marginLeft', event.value).subscribe(a => {
          this.marginLeft.set(parseFloat(event.value));
        });
      } break;
      case MarginInputType.MARGIN_RIGHT: {
        this.noteService.UpdateDefaultSettings('marginRight', event.value).subscribe(a => {
          this.marginRight.set(parseFloat(event.value));
        });
      } break;
      case MarginInputType.MARGIN_BOTTOM: {
        this.noteService.UpdateDefaultSettings('marginBottom', event.value).subscribe(a => {
          this.marginBottom.set(parseFloat(event.value));
        });
      } break;
      case MarginInputType.MARGIN_TOP: {
        this.noteService.UpdateDefaultSettings('marginTop', event.value).subscribe(a => {
          this.marginTop.set(parseFloat(event.value));
        });
      } break;
    }
  }

  protected HandleBackgroundColorChange(newColor : string) {
    this.noteService.UpdateDefaultSettings('backgroundColor', newColor).subscribe(a => {
      console.log(a);
      this.backgroundColor.set(newColor);
    });
  }
}
