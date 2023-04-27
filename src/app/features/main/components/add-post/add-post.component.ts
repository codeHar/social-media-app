import { Component, ViewChild } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { collection, addDoc, Firestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IPost, IUser } from '@core/models';
import {
  FormValidatorService,
  LoaderService,
  ScreenSizeService,
} from '@core/services';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { tap, finalize, firstValueFrom, catchError, of } from 'rxjs';
import { UserService } from '@core/services';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent {
  @ViewChild(FileUpload) fileUpload!: FileUpload;

  text: string = '';
  selectedImageUrl: SafeUrl = '';
  selectedImage: File | null = null;
  task!: AngularFireUploadTask;

  user: IUser | null = null;

  constructor(
    private storage: AngularFireStorage,
    private fireStore: Firestore,
    private sanitizer: DomSanitizer,
    private toastService: MessageService,
    private postService: PostService,
    private loaderService: LoaderService,
    public screenSizeService: ScreenSizeService,
    private userService: UserService
  ) {
    this.userService.user.stream$.subscribe((user) => (this.user = user));
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    this.selectedImage = file;
    console.log(this.selectedImage?.type.split('/')[0]);
    this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
    console.log(this.selectedImageUrl);
    this.fileUpload.clear();
  }

  async addPost() {
    if (!this.text && !this.selectedImage) return;
    if (this.selectedImage) {
      this.addPostWithImage();
    } else {
      try {
        const clc = collection(this.fireStore, 'Posts');
        const post: IPost = {
          text: this.text,
          media: '',
          user_id: this.user?.user_id!,
          user_name: this.user?.name!,
          user_image: this.user?.image,
          date_added: Date.now(),
          likes: [],
          comments: [],
        };
        await addDoc(clc, post);
        this.postService.refresh$.next();
        this.text = '';
        this.selectedImage = null;
      } catch (err) {}
    }
  }

  addPostWithImage() {
    try {
      const path = `gallery/${Date.now()}_${this.selectedImage?.name}`;

      const ref = this.storage.ref(path);
      this.task = this.storage.upload(path, this.selectedImage);

      this.task
        .snapshotChanges()
        .pipe(
          tap((_) => this.loaderService.showLoader()),
          finalize(async () => {
            const imageUrl = await firstValueFrom(ref.getDownloadURL());
            const clc = collection(this.fireStore, 'Posts');
            const post: IPost = {
              text: this.text,
              media: imageUrl,
              user_id: this.user?.user_id!,
              user_name: this.user?.name!,
              user_image: this.user?.image,
              date_added: Date.now(),
              likes: [],
              comments: [],
              isImage: this.isMediaImage(),
            };
            await addDoc(clc, post);
            this.loaderService.hideLoader();
            this.toastService.add({
              severity: 'success',
              summary: 'Successfully added post.',
            });
            this.text = '';
            this.selectedImage = null;
            this.selectedImageUrl=''
            this.postService.refresh$.next();
          }),
          catchError((err) => {
            this.loaderService.hideLoader();
            this.toastService.add({
              severity: 'danger',
              summary: 'Failed to add post.',
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

  isMediaImage() {
    if (this.selectedImage && this.selectedImage.type != 'video/mp4') {
      return true;
    } else {
      return false;
    }
  }
}
