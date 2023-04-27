import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { PostsComponent } from './components/posts/posts.component';
import { AvatarModule } from 'primeng/avatar';
import { PostComponent } from './components/post/post.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FirstLetterModule } from '@shared/pipes';
import { HeaderComponent } from './components/header/header.component';
import { AddCommentsComponent } from './components/add-comments/add-comments.component';
import { MenuModule } from 'primeng/menu';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { SidebarModule } from 'primeng/sidebar';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { InputTextModule } from 'primeng/inputtext';


const primengModules = [
  AvatarModule,
  InputTextareaModule,
  ButtonModule,
  FileUploadModule,
  MenuModule,
  SidebarModule,
  InputTextModule
];

@NgModule({
  declarations: [
    MainPageComponent,
    PostsComponent,
    PostComponent,
    AddPostComponent,
    HeaderComponent,
    AddCommentsComponent,
    ViewProfileComponent,
    EditProfileComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    primengModules,
    FormsModule,
    FirstLetterModule,
    ReactiveFormsModule,
  ],
})
export class MainModule {}
