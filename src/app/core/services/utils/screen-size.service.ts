import { Injectable } from '@angular/core';
import { SCREEN_SIZE } from '@core/enums';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  public screenSize$ = new BehaviorSubject<SCREEN_SIZE>(SCREEN_SIZE.LG);

  public currentScreenSize: SCREEN_SIZE = SCREEN_SIZE.LG;

  isSmallScreen: boolean = false;
  isMediumScreen: boolean = false;
  constructor() {
    this.updateCurrentScreenSize();
  }

  init() {
    this.calculateSize();
  }

  updateCurrentScreenSize() {
    this.screenSize$.subscribe((size: SCREEN_SIZE) => {
      this.currentScreenSize = size;
      this.checkSmallScreen();
      this.checkMediumScreen();
    });
  }

  calculateSize() {
    if (window.innerWidth < 576) return this.screenSize$.next(SCREEN_SIZE.XS);
    if (window.innerWidth >= 576 && window.innerWidth < 768)
      return this.screenSize$.next(SCREEN_SIZE.SM);
    if (window.innerWidth >= 768 && window.innerWidth < 992)
      return this.screenSize$.next(SCREEN_SIZE.MD);
    if (window.innerWidth >= 992 && window.innerWidth < 1400)
      return this.screenSize$.next(SCREEN_SIZE.LG);
    else this.screenSize$.next(SCREEN_SIZE.XL);
  }

  checkSmallScreen() {
    if (
      this.currentScreenSize === SCREEN_SIZE.SM ||
      this.currentScreenSize === SCREEN_SIZE.XS
    ) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  checkMediumScreen() {
    if (
      this.currentScreenSize === SCREEN_SIZE.MD ||
      this.currentScreenSize === SCREEN_SIZE.SM
    ) {
      this.isMediumScreen = true;
    } else {
      this.isMediumScreen = false;
    }
  }
}
