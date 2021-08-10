import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Spinner } from '@ionic/cli-framework';
import 'firebase/auth';
import { User } from 'ionic';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
//test
@Injectable()
export class FirebaseService {
  user$: Observable<User>;
  user: User;

  isLoggedIn = false;
  constructor(
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toaster: ToastController,
    public router: Router
  ) {
    this.user$ = this.firebaseAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.fireservices.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  } //end of constructor
  async login(email, password) {
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
      .catch((error) => {
        console.log(error);
        this.toast('Invalid Email or Password', 'danger');
        this.logout();
      });
  }
  logout() {
    this.firebaseAuth.signOut().then(() => {
      this.router.navigateByUrl('login');
    });
  }
  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000,
    });
    toast.present();
  }
}
