import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  isLoggedIn = false;
  constructor(
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore
  ) {}
  async signin(email: string, password: string) {
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      })
      .catch(() => {
        this.isLoggedIn = false;
      });
  }
  async signup(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      })
      .catch(() => {
        this.isLoggedIn = false;
      });
  }
  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
  create_user(Record: any[]) {
    return this.fireservices.collection('Users').add(Record);
  }
}
