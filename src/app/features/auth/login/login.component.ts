import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES, ASSETS } from '@core/const';
import { IUser } from '@core/models';
import {
  AuthService,
  LoaderService,
  FormValidatorService,
} from '@core/services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly APP_ROUTES = APP_ROUTES;
  readonly ASSETS = ASSETS;

  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private toastService: MessageService,
    private formValidatorService: FormValidatorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  async login() {
    try {
      this.loaderService.showLoader();
      const email = this.f['email'].value;
      const password = this.f['password'].value;
      const res = await this.authService.login(email, password);
      this.toastService.add({
        severity: 'success',
        summary: 'User logged in successfully',
      });
      setTimeout(() => {
        this.router.navigate([APP_ROUTES.MAIN.MAIN_PAGE]);
      }, 500);
    } catch (err) {
      console.log('failed to login user');
      this.toastService.add({
        severity: 'danger',
        summary: 'Failed to login in',
      });
    } finally {
      this.loaderService.hideLoader();
    }
  }

  checkControlError(controlName: string, validationType: string): boolean {
    return this.formValidatorService.controlHasError(
      this.form,
      controlName,
      validationType
    );
  }
}
