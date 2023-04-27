import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { TitleStrategy } from '@angular/router';
import { PostService, UserService } from '@core/services';

import { IPost } from 'src/app/core/models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  @Input() post!: any;

  postAlreadyLiked: boolean = false;
  user_id!: string;
  showComments: boolean = false;

  constructor(
    private fireStore: Firestore,
    private userService: UserService,
    private postService: PostService
  ) {
    this.userService.userSub$.subscribe(
      (user) => (this.user_id = user?.user_id!)
    );
  }

  ngOnInit() {
    if (this.post.likes.includes(this.user_id)) {
      this.postAlreadyLiked = true;
    } else {
      this.postAlreadyLiked = false;
    }
  }

  async likePost(post_id: string) {
    try {
      const postRef = doc(this.fireStore, 'Posts', post_id);
      let likes = [...this.post.likes];
      const likedByUser = likes.find((id) => this.user_id == id);
      if (likedByUser) {
        const index = likes.indexOf(likedByUser);
        likes.splice(index, 1);
      } else {
        likes.push(this.user_id);
      }
      await updateDoc(postRef, {
        likes: likes,
      });
      this.postService.refresh$.next();
    } catch (err) {
      console.log(err);
    }
  }

  toggleShowComment() {
    this.showComments = !this.showComments;
  }
}
