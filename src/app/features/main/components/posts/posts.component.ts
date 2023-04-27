import { Component } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDocs,
} from '@angular/fire/firestore';
import { LoaderService } from '@core/services';
import { Observable, startWith } from 'rxjs';
import { IPost } from 'src/app/core/models/post.model';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  // posts: IPost[] = [
  //   {
  //     user_name: 'ram',
  //     text: 'this is not the end this is not the begginig jsut a voice like a roit rocking like a revision',
  //   },
  //   {
  //     user_name: 'hari',
  //     text: 'this is not the end ce like a roit rocking like a revision',
  //     image:
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhcdXRn6T8-dTI_686Xms6QbWwvduxvWEGbA&usqp=CAU',
  //   },
  //   {
  //     user_name: 'ram',
  //     text: 'this is not the end this is not the begginig jsut a voice like a roit rocking like a revision. but in the end it doesnt even matter. one thinmg i dont know why , its doesnt evebn matter how hard i try',
  //     image:
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYGyVGAHvdxJphL1KP5pNcfuJ_G8ggJsZYbA&usqp=CAU',
  //   },
  // ];

  posts!: any;

  constructor(
    private fireStore: Firestore,
    private postService: PostService,
    private loaderService: LoaderService
  ) {
    this.postService.refresh$
      .pipe(startWith(''))
      .subscribe((_) => this.getData());
  }

  async getData() {
    try {
      this.loaderService.showLoader();
      const clc = collection(this.fireStore, 'Posts');
      const postRef = await getDocs(clc);
      this.posts = postRef.docs.map((item) => {
        console.log(typeof item.data()['likes']);
        return { ...item.data(), id: item.id };
      });
      console.log(this.posts);
    } catch (err) {
      console.log(err);
    } finally {
      this.loaderService.hideLoader();
    }
  }
}
