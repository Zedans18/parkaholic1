import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  constructor(
    private router: Router,
    public firebaseService: FirebaseService,
    public alertController: AlertController,
    private loadingController: LoadingController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    private toaster: ToastController
  ) {}

  ngOnInit() {}

  register() {
    //Routing to Register page
    this.router.navigateByUrl('register');
  }
  forgot() {
    //Routing to Reset Password page
    this.router.navigateByUrl('reset');
  }
  async login() {
    //A function that checks if the email and password matches in the database. If so, it takes us to the Home page
    if (this.email && this.password) {
      const loading = await this.loadingController.create({
        message: 'Logging in...',
        spinner: 'crescent',
        showBackdrop: true,
      });
      loading.present();
      this.firebaseService
        .login(this.email, this.password)
        .then(() => {
          loading.dismiss();
        })
        .catch((error) => {
          loading.dismiss();
          this.toast(error.message, 'danger');
        });
    }
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
