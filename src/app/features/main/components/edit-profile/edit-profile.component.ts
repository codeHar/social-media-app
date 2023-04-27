import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  collection,
  addDoc,
  Firestore,
  collectionData,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  DocumentReference,
} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IUser } from '@core/models';
import {
  FormValidatorService,
  LoaderService,
  ScreenSizeService,
  UserService,
} from '@core/services';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { tap, finalize, firstValueFrom, catchError, of } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  @ViewChild(FileUpload) fileUpload!: FileUpload;
  @Output() closeDialog = new EventEmitter();

  display: boolean = true;
  user!: IUser;
  task!: AngularFireUploadTask;
  form!: FormGroup;

  selectedImageUrl: SafeUrl = '';
  selectedImage!: File;

  constructor(
    private storage: AngularFireStorage,
    private fireStore: Firestore,
    private sanitizer: DomSanitizer,
    private toastService: MessageService,
    private formValidatorService: FormValidatorService,
    private _fb: FormBuilder,
    private loaderService: LoaderService,
    public screenSizeService: ScreenSizeService,
    private userService: UserService
  ) {
    this.userService.userSub$.subscribe((user) => {
      this.user = user!;
      if (this.user.image) {
        this.selectedImageUrl = this.user.image;
      }
    });
  }

  ngOnInit() {
    this.form = this._fb.group({
      name: [this.user.name, Validators.required],
      description: [this.user.description ? this.user.description : ''],
    });
  }

  get f() {
    return this.form.controls;
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    this.selectedImage = file;
    this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
    this.fileUpload.clear();
  }

  updateProfileWithImage(userDoc: DocumentReference) {
    try {
      const path = `gallery/${Date.now()}_${this.selectedImage.name}`;

      const ref = this.storage.ref(path);
      this.task = this.storage.upload(path, this.selectedImage);

      this.task
        .snapshotChanges()
        .pipe(
          tap((_) => this.loaderService.showLoader()),
          finalize(async () => {
            const imageUrl = await firstValueFrom(ref.getDownloadURL());
            await updateDoc(userDoc, {
              name: this.f['name'].value,
              image: imageUrl,
              description: this.f['description'].value,
            });
            const updatedUserData: IUser = {
              image: imageUrl,
              name: this.f['name'].value,
              user_id: this.user.user_id,
              description: this.f['description'].value,
            };
            this.userService.setUser(updatedUserData);
            this.loaderService.hideLoader();
            this.toastService.add({
              severity: 'success',
              summary: 'Successfully updated profile',
            });
            this.closeDialog.emit();
          }),
          catchError((err) => {
            console.log(err);
            this.loaderService.hideLoader();
            this.toastService.add({
              severity: 'danger',
              summary: 'Failed to update profile',
            });
            return of([]);
          })
        )
        .subscribe();
    } catch (err) {
      console.log(err);
    } finally {
    }
  }

  async updateProfile() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.add({
        severity: 'danger',
        summary: 'Make sure you have entered all required fields.',
      });
      return;
    } else {
      const clc = collection(this.fireStore, 'Users');
      const userRef = await getDocs(clc);
      const userId = userRef.docs.filter(
        (item) => item.data()['user_id'] == this.user.user_id
      )[0].id;

      const userDoc = doc(this.fireStore, 'Users', userId);

      if (this.selectedImage) {
        this.updateProfileWithImage(userDoc);
      } else {
        try {
          this.loaderService.showLoader();
          await updateDoc(userDoc, {
            name: this.f['name'].value,
            description: this.f['description'].value,
          });

          const updatedUserData: IUser = {
            image: this.user.image,
            name: this.f['name'].value,
            user_id: this.user.user_id,
            description: this.f['description'].value,
          };
          this.userService.setUser(updatedUserData);
          this.toastService.add({
            severity: 'success',
            summary: 'Successfully updated profile',
          });
          this.closeDialog.emit();
        } catch (err) {
          console.log(err);
          this.toastService.add({
            severity: 'danger',
            summary: 'Failed to update profile',
          });
        } finally {
          this.loaderService.hideLoader();
        }
      }
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
