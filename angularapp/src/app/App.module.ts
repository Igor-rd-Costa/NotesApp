import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './AppRouting.module';
import { App } from './App.component';
import { DisplayModeService } from './Services/DisplayModeService';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotesService } from './Services/NotesService';
import { NotesList } from './Components/NotesList/NotesList.component';
import { NgIf } from '@angular/common';
import { NoteDisplay } from './Components/NoteDisplay/NoteDisplay.component';
import { AuthService } from './Services/AuthService';
import { NoAuthInterceptor } from './Components/General/NoAuthInterceptor';
import { NoteManager } from './Services/NoteManager';
import { NoteFormater } from './Services/NoteFormater';
import { RouteService } from './Services/RouteService';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NotesList,
    NoteDisplay,
    NgIf
  ],
  providers: [ DisplayModeService, NotesService, AuthService, NoteManager, NoteFormater, RouteService, {provide: HTTP_INTERCEPTORS, useClass: NoAuthInterceptor, multi: true } ],
  bootstrap: [App]
})
export class AppModule { 
  
}
