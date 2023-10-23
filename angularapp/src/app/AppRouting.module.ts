import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteDisplay } from './Components/NoteDisplay/NoteDisplay.component';
import { Index } from './Components/Index/Index.component';

const routes: Routes = [{
path: '',
component: Index
},
{
path: 'note/:guid',
component: NoteDisplay
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
