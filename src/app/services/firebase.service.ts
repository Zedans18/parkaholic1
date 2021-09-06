import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from 'ionic';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class FirebaseService {
  user$: Observable<User>;
  user: User;

  constructor(
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,

    private toaster: ToastController,
    public router: Router
  ) {
    this.user$ = this.firebaseAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.fireservices.doc(`users/${user.email}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  async login(email, password) {
    //A function that checks if the email and password are found in Firebase.
    //and also checks if the email has been verified by the user. The user must verify his email before logging to the app.
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        if (data.user.emailVerified) {
          this.toast('Succesfully Logged In', 'success');
          this.router.navigateByUrl('home');
        } else {
          this.toast('Verify Your Email', 'danger');
        }
      })
      .catch(() => {
        this.toast('Invalid Email or Password', 'danger');
        this.logout();
      });
  }
  logout() {
    //A function that logs out the user from Firebase Authentication
    this.firebaseAuth.signOut().then(() => {
      this.router.navigateByUrl('login');
    });
  }
  async toast(msg, status) {
    //Calling this function when we need to show a user a message.
    const toast = await this.toaster.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000,
    });
    toast.present();
  }
}
