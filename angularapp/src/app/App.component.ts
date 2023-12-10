import { Component } from '@angular/core';
import { AuthService } from './Services/AuthService';
import { Router } from '@angular/router';

interface ClickWatcher {
  watcher: (event : Event) => void,
  src: object
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class App {
  title = 'notes-app';
  private static clickWatchers : ClickWatcher[] = [];

  constructor(private router : Router, private authService : AuthService) {
    this.authService.IsLogged().subscribe((isLogged) => {
      if (!isLogged)
        this.router.navigate(['login']);
    });
  }

  public static RegisterClickWatcher(watcher :(event : Event) => void, src : object) {
    App.clickWatchers.push({ watcher, src });
  }

  AppClick(event : Event) {
    for (let i = 0; i < App.clickWatchers.length; i++) {
      App.clickWatchers[i].watcher.call(App.clickWatchers[i].src, event); 
    }
  }
}
