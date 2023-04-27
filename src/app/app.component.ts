import { Component } from '@angular/core';
import { LoaderService, ScreenSizeService } from '@core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'social-media';

  constructor(
    public loaderService: LoaderService,
    private screenSizeService: ScreenSizeService
  ) {
    this.screenSizeService.init();
  }
}
