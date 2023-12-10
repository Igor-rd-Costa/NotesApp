import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ClickHighlight } from 'src/app/Utils/ClickHighlight';

@Component({
  selector: 'FormButton',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './FormButton.html',
  styleUrls: ['./FormButton.css']
})
export class FormButton extends ClickHighlight {
  @Input() text : string = "";
  @Input() type : string = "";
  @Input() isActive : boolean = false;
  @Input() onClick : (event : MouseEvent) => void = (event) => {}

  @ViewChild("formButton") formButton! : ElementRef;
  constructor() {
    super();
  }

  SetActiveState(state : boolean) {
    this.isActive = state;
  }

  public UpdateFormButtonState(event : Event) : void {
    if (event.target === null || (event.target as HTMLElement).tagName !== "INPUT" || !(event.target as HTMLInputElement).required)
        return;
  

      const form = (event.target as HTMLInputElement).closest("FORM");
      if (!form)
        return;

      const inputList = form.getElementsByTagName("INPUT") as HTMLCollectionOf<HTMLInputElement>;
      const formButtons = form.getElementsByTagName("FormButton");
      if (inputList === undefined || formButtons === undefined) 
        return;

      
      let buttonState : boolean = true;
      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].required && inputList[i].value.trim().length === 0) {
          buttonState = false;
        }
      }
      this.isActive = buttonState;
  }
}
