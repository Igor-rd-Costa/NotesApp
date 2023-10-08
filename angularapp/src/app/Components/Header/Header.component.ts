import { Component, effect } from '@angular/core';
import { NgIf } from '@angular/common';
import { NotesDisplayHeader } from './NotesDisplayHeader/NotesDisplayHeader.component';
import { NotesEditHeader } from './NotesEditHeader/NotesEditHeader.component';
import { AppDisplayMode, DisplayModeService, HeaderDisplayMode } from '../../Services/DisplayModeService';

@Component({
  standalone: true,
  selector: 'Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
  imports: [ NotesDisplayHeader, NotesEditHeader, NgIf ]
})
export class Header {
  DisplayModeService = DisplayModeService;
  AppDisplayMode = AppDisplayMode;
}
