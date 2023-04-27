import { Component } from '@angular/core';
import { collection, addDoc, Firestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES, ASSETS } from '@core/const';
import {
  AuthService,
  LoaderService,
  FormValidatorService,
} from '@core/services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  readonly APP_ROUTES = APP_ROUTES;
  readonly ASSETS = ASSETS;

  form!: FormGroup;

  constructor(
    private fireStore: Firestore,
    private authService: AuthService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private toastService: MessageService,
    private formValidatorService: FormValidatorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  async register() {
    try {
      this.loaderService.showLoader();
      const email = this.f['email'].value;
      const password = this.f['password'].value;
      const res = await this.authService.register(email, password);
      const clc = collection(this.fireStore, 'Users');
      await addDoc(clc, {
        name: this.f['name'].value,
        email: this.f['email'].value,
        password: this.f['password'].value,
        image: '',
        description:'',
        user_id: res.user.uid,
      });
      this.toastService.add({
        severity: 'success',
        summary: 'Registered User successfully',
      });
      this.router.navigate([APP_ROUTES.AUTH.LOGIN]);
    } catch (err) {
      console.log('failed to create user');
      this.toastService.add({
        severity: 'danger',
        summary: 'Failed to register user',
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
