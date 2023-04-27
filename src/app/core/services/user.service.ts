import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userSub$ = new BehaviorSubject<IUser | null>(null);
  constructor() {
    this.userSub$.next(JSON.parse(localStorage.getItem('User')!) || null);
  }

  get user() {
    return {
      value: this.userSub$.value,
      stream$: this.userSub$.asObservable(),
    };
  }

  setUser(user: IUser | null) {
    localStorage.setItem('User', JSON.stringify(user));
    this.userSub$.next(user);
  }

  clearUser() {
    this.userSub$.next(null);
  }
}
