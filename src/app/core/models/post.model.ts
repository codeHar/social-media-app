import { IUser } from './user.model';

// export interface IPost {
//   user_name: string;
//   user_image?: string;
//   user_id: string;
//   text?: string;
//   media?: string;
//   likes?: string[];
//   comments?: { user: IUser; comment: string }[];
//   date_added?: Date;
//   id?: string;
// }

export interface IPost {
  user_id: string;
  user_image?: string;
  comments: any[];
  likes: any[];
  media?: string;
  text?: string;
  user_name: string;
  date_added:  | number;
  id?: string;
  isImage?:boolean
}

export interface IComment {
  user_name: string;
  user_image: string;
  comment: string;
}
