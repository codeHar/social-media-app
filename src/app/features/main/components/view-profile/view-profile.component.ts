import { Component, EventEmitter, Output } from '@angular/core';
import { IUser } from '@core/models';
import { ScreenSizeService, UserService } from '@core/services';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent {
  @Output() closeDialog = new EventEmitter();

  display: boolean = true;
  user!: IUser;
  showEditProfile: boolean = false;

  constructor(
    public screenSizeService: ScreenSizeService,
    private userService: UserService
  ) {
    this.userService.userSub$.subscribe((user) => (this.user = user!));
  }

  toggleEditProfile() {
    this.showEditProfile = !this.showEditProfile;
  }
}
