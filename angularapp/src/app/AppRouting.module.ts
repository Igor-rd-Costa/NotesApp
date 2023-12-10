import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteDisplay } from './Components/NoteDisplay/NoteDisplay.component';
import { Index } from './Components/Index/Index.component';
import { Settings } from './Components/Settings/Settings.component';
import { NotesList } from './Components/NotesList/NotesList.component';

const routes: Routes = [{
  path: '',
  component: NotesList
},
{
  path: 'login',
  component: Index  
},
{
  path: 'register',
  component: Index  
},
{
  path: 'note/:guid',
  component: NoteDisplay
},
{
  path: 'settings/profile',
  component: Settings
},
{
  path: 'settings/new-notes',
  component: Settings
},
{
  path: 'settings/notes',
  component: Settings
},
{
  path: 'settings/notes/:guid',
  component: Settings
},
{
  path: 'settings',
  redirectTo: 'settings/profile'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
