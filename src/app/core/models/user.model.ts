export interface IUser {
  user_id: string;
  name: string;
  image: string;
  description?:string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  image: string;
  user_id: string;
}
