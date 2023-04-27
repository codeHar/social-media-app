import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES, ASSETS } from '@core/const';
import { IUser } from '@core/models';
import { UserService } from '@core/services';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly ASSETS = ASSETS;
  readonly APP_ROUTES = APP_ROUTES;

  items!: MenuItem[];

  user!: IUser;

  showProfile: boolean = false;

  constructor(private userService: UserService, private router: Router) {
    this.userService.userSub$.subscribe((user) => (this.user = user!));
  }

  ngOnInit() {
    this.items = [
      {
        label: 'View Profile',
        icon: 'pi pi-user',
        command: () => {
          this.viewProfile();
        },
      },
      {
        label: 'Log Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logOut();
        },
      },
    ];
  }

  viewProfile() {
    this.showProfile = true;
  }

  hideProfile() {
    this.showProfile = false;
  }

  logOut() {
    this.userService.setUser(null);
    localStorage.clear();
    this.router.navigate([APP_ROUTES.AUTH.LOGIN]);
  }
}
