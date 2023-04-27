import { Component, Input } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { IComment, IPost } from '@core/models';
import { PostService, UserService } from '@core/services';

@Component({
  selector: 'app-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.scss'],
})
export class AddCommentsComponent {
  @Input() post!: any;
  comment: string = '';

  constructor(
    private fireStore: Firestore,
    private userService: UserService,
    private postService: PostService
  ) {}

  async addComment() {
    try {
      if (!this.comment) return;

      const postRef = doc(this.fireStore, 'Posts', this.post.id);

      let comments = [...this.post.comments];
      const commentRef: IComment = {
        comment: this.comment,
        user_image: this.userService.user.value?.image!,
        user_name: this.userService.user.value?.name!,
      };
      comments.push(commentRef);

      await updateDoc(postRef, {
        comments: comments,
      });
      this.comment = '';
      this.postService.refresh$.next();
    } catch (err) {}
  }
}
