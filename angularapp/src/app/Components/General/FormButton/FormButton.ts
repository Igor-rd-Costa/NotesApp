import { Component, Input } from '@angular/core';
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

  constructor() {
    super();
  }

  SetActiveState(state : boolean) {
    this.isActive = state;
  }

  public static UpdateFormButtonState(event : Event) : boolean {
    if (event.target === null || (event.target as HTMLElement).tagName !== "INPUT" || !(event.target as HTMLInputElement).required)
        return false;
  
      const target = event.target as HTMLInputElement;
      const inputList = target.closest("FORM")?.getElementsByTagName("INPUT") as HTMLCollectionOf<HTMLInputElement>;
      if (inputList === undefined) 
        return false;
  
      let buttonState : boolean = true;
      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].required && inputList[i].value.trim().length === 0) {
          buttonState = false;
        }
      }
      return buttonState;
  }
}
