import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading: boolean = false;

  showLoader() {
    setTimeout(() => {
      this.isLoading = true;
    });
  }

  hideLoader() {
    setTimeout(() => {
      this.isLoading = false;
    });
  }
}
