import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, effect } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { SettingTitle } from '../SettingTitle/SettingTitle.component';
import { NoteManager } from 'src/app/Services/NoteManager';

@Component({
  selector: 'BackgroundColorSettings',
  standalone: true,
  imports: [CommonModule, SettingTitle, NgFor],
  templateUrl: './BackgroundColorSettings.component.html',
  styleUrls: ['./BackgroundColorSettings.component.css']
})
export class BackgroundColorSettings implements OnChanges, AfterViewInit {
  @Input() backgroundColor : string = "#FFFFFFFF";
  @Output() onBackgroundColorChange = new EventEmitter<string>();
  @ViewChild("scroller") scroller! : ElementRef;
  @ViewChild('tabIcons') tabIcons! : ElementRef;
  @ViewChild('cardsWrapper') cardsWrapper! : ElementRef;
  colors = [
    "#FFFFFFFF", "#E6E6E6FF", "#F4E4D7FF", "#F5DDDDFF", 
    "#CBDADDFF", "#171717FF", "#FFC59DFF", "#FFEC95FF",
    "#C8F0E7FF", "#C8E0F8FF", "#E5DCF9FF", "#FECACEFF",
    "#EFC9BCFF", "#A7C9CBFF", "#B0B2C7FF", "#78B68FFF",
    "#6491B0FF", "#CD9191FF"
  ];
  iconCount = Math.ceil(this.colors.length / 4);
  private scrollLeft = 0;

  constructor(private noteManager : NoteManager) {

  }

  HighlightSelected() {
    if (this.scroller) {
      const scroller = this.scroller.nativeElement as HTMLElement;
      const cards = scroller.getElementsByClassName('color-card');
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute('color') === this.backgroundColor) {
          const selected = scroller.getElementsByClassName('selected')[0];
          if (selected !== cards[i]) {
            if (selected) {
              selected.classList.remove('selected');
            }
            cards[i].classList.add('selected');
          }
          const cardPos = Math.floor(i / 4);
          const icons = (this.tabIcons.nativeElement as HTMLElement).getElementsByClassName('tab-icon');
          const selectedIcon = (this.tabIcons.nativeElement as HTMLElement).getElementsByClassName('selected')[0];
          if (selectedIcon !== icons[cardPos]) {
            if (selectedIcon) {
              selectedIcon.classList.remove('selected');
            }
            for (let j = 0; j < icons.length; j++) {
              if (j === cardPos) {
                icons[j].classList.add('selected');
              }
            }
          }
          scroller.scrollTo({left: (22 * 16) * cardPos, behavior: 'smooth'})
          this.scrollLeft = (22 * 16) * cardPos;
        }
      }
    }
  }

  GenerateIcons() {
    let res : number[] = [];
    for (let i = 0; i < Math.ceil(this.colors.length / 4); i++){
      res.push(1);
    }
    return res;
  }

  ngAfterViewInit(): void {
    if (!this.scroller)
      return;
    const scroller = this.scroller.nativeElement as HTMLElement;
    const tabIcons = this.tabIcons.nativeElement as HTMLElement;
    scroller.getElementsByClassName('color-card')[0].classList.add('selected');
    scroller.scrollLeft = 0;
    tabIcons.getElementsByClassName('tab-icon')[0].classList.add('selected');
    const cardsWrapper = this.cardsWrapper.nativeElement as HTMLElement;
    let size = this.colors.length;
    while (size % 4 !== 0) {
      size++;
    }
    cardsWrapper.style.width = ((size * 5) + ((size - 2) * 0.5) + 1)+'rem';
  }

  ngOnChanges(): void {
    this.HighlightSelected();
  }

  UpdateSelection(event : MouseEvent) {
    if (event.target === null)
      return;
    const target = event.target as HTMLElement;
    if (!target.classList.contains('color-card'))
      return;
    const scroller = this.scroller.nativeElement as HTMLElement;
    const selected = scroller.getElementsByClassName('selected')[0] ?? null;
    if (selected !== target) {
      const color = target.getAttribute('color');
      if (color === null)
        return;
      if (selected !== null) {
        selected.classList.remove('selected');
      }
      target.classList.add('selected');
      this.onBackgroundColorChange.emit(color);
    }
  }

  GoRight() {
    const scroller = this.scroller.nativeElement as HTMLElement;
    const tabIcons = this.tabIcons.nativeElement as HTMLElement;
    const icons = tabIcons.getElementsByClassName('tab-icon');
    for (let i = 0; i < icons.length; i++) {
      if (icons[i].classList.contains('selected')) {
        if ((i + 1) < icons.length) {
          icons[i].classList.remove('selected');
          icons[i+1].classList.add('selected');
          scroller.scrollTo({left: this.scrollLeft + (22 * 16), behavior: 'smooth'});
          this.scrollLeft += (22 * 16);
          break;
        }

      }
    }
  }
  GoLeft() {
    const scroller = this.scroller.nativeElement as HTMLElement;
    const tabIcons = this.tabIcons.nativeElement as HTMLElement;
    const icons = tabIcons.getElementsByClassName('tab-icon');
    for (let i = 0; i < icons.length; i++) {
      if (icons[i].classList.contains('selected')) {
        if ((i - 1) >= 0) {
          icons[i].classList.remove('selected');
          icons[i-1].classList.add('selected');
          scroller.scrollTo({left: (this.scrollLeft - (22 * 16)), behavior: 'smooth'});
          this.scrollLeft -=(22 * 16);
          break;
        }

      }
    }
  }
}
