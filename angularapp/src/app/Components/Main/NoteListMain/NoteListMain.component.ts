import { Component } from '@angular/core';
import { NoteCard } from './NoteCard/NoteCard.component';
import { SetScrollTop } from 'src/app/App.component';
import { touchInfo } from '../../../Utils/GlobalEventHandlers';
import { AppDisplayMode, DisplayModeService } from '../../../Services/DisplayModeService';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';

const Months : string[] = [ "Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Set", "Oct", "Nov", "Dec" ]

type Note = {
  id: number,
  name: string,
  creation_Date: string,
  modify_Date: string,
  content: string
}

interface NotePreview {
  id: number,
  name: string,
  modifyDate: string,
  preview: string
}

@Component({
  standalone: true,
  selector: 'NoteListMain',
  templateUrl: './NoteListMain.component.html',
  styleUrls: ['./NoteListMain.component.css'],
  imports: [ NoteCard, NgFor ]
})
export class NoteListMain {

  notes: Array<NotePreview> = new Array<NotePreview>;
  private count: number = 0;
  
  constructor(http: HttpClient) {
    http.get<Array<NotePreview>>('https://localhost:7216/').subscribe(result => {
      for (let i = 0; i < result.length; i++) {
        this.notes[i] = result[i];
        let modifyDate: Date = new Date(result[i].modifyDate);
        this.notes[i].modifyDate = this.GetNoteDate(modifyDate);
      }
    })
  }

  GetNoteDate(date : Date): string {
    return Months[date.getMonth()] + ' ' + (date.getDate()); 
  }

  OnBackToTopClick() {
    const Main = document.getElementById("notes-main") as HTMLElement;
    Main.scrollTo({ top: 0, behavior: "smooth" });
    SetScrollTop(0);
    touchInfo.touchStart.X = -1;
    touchInfo.touchStart.Y = -1;
    touchInfo.touchMove.X = -1;
    touchInfo.touchMove.Y = -1;
  }

  OnCreateNoteClick() {
    DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_DISPLAY);
  }
}
