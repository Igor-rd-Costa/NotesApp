import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ImgButtonProp {
  Button: {
    Id?: string,
    OnClick: (event: MouseEvent) => void
  },
  Img: {
    Id?: string,
    Src?: string,
    Alt?: string
  }
}

@Component({
  selector: 'ImgButton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ImgButton.component.html',
  styleUrls: ['./ImgButton.component.css']
})
export class ImgButton {
  @Input() props: ImgButtonProp = {
    Button: {
      OnClick: (event: MouseEvent) => { }
    },
    Img: {}
  }
}
