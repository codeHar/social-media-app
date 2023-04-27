import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  user,
  UserCredential,
} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  Firestore,
  doc,
} from '@angular/fire/firestore';
import { IRegisterUser, IUser } from '@core/models';
import { UserService } from '@core/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private fireStore: Firestore,
    private userService: UserService
  ) {}

  register(email: string, password: string) {
    return new Promise<UserCredential>(async (resolve, reject) => {
      try {
        const res = await createUserWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  login(email: string, password: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const res = await signInWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        console.log(res)

        this.setUserData(res.user.uid);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  setUserData(user_id: string) {
    const clc = collection(this.fireStore, 'Users');
    const userData = collectionData(clc);
    userData.subscribe((users) => {
      const user = users.find((user) => user['user_id'] == user_id);
      if (user) {
        console.log(user);
        const userRef: IUser = {
          user_id: user['user_id'],
          image: user['image'],
          name: user['name'],
        };
        this.userService.setUser(userRef);
      }
    });
  }
}
