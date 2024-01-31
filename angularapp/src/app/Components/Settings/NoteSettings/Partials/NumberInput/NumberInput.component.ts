import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'NumberInput',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NumberInput.component.html',
  styleUrls: ['./NumberInput.component.css']
})
export class NumberInput {
  @Input() imgSrc : string = '';
  @Input() value : number = 0;
  @Input() increment : number = 1;
  @Input() fractionDigits : number = 0;
  @Output() onChange : EventEmitter<number> = new EventEmitter<number>;

  Increase() {
    if (this.value + this.increment <= 999) {
      this.value = parseFloat(this.value.toFixed(2));
      this.value += this.increment;
      this.onChange.emit(this.value);
    }
  }
  
  Decrease() {
    if (this.value - this.increment >= 0) {
      this.value = parseFloat(this.value.toFixed(2));
      this.value -= this.increment;
      this.onChange.emit(this.value);
    }
  }
}
