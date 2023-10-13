import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './AppRouting.module';
import { App } from './App.component';

import { Header } from './Components/Header/Header.component';
import { Main } from './Components/Main/Main.component';
import { DisplayModeService } from './Services/DisplayModeService';
import { HttpClientModule } from '@angular/common/http';
import { NotesService } from './Services/NotesService';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    Header,
    Main,
  ],
  providers: [ DisplayModeService, NotesService ],
  bootstrap: [App]
})
export class AppModule { 
  
}
