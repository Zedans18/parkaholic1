import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  email: string;
  constructor(
    private router: Router,
    public firebaseService: FirebaseService,
    public alertController: AlertController,
    private authService: AngularFireAuth,
    public toaster: ToastController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}
  async resetPassword(form) {
    //A function that sends an email with a link to the user that wants to reset his password.
    //It shows a message if the email is not in the database or if it is an invalid email.
    if (this.email) {
      const loading = await this.loadingController.create({
        message: 'Sending reset password link...',
        spinner: 'crescent',
        showBackdrop: true,
      });
      loading.present();

      this.authService
        .sendPasswordResetEmail(this.email)
        .then(() => {
          loading.dismiss();
          this.toast(
            'Email Sent Succesfully! Please Check Your Email',
            'success'
          );
          this.router.navigateByUrl('login');
        })
        .catch(() => {
          this.toast('Invalid Email', 'danger');
          loading.dismiss();
        });
    } else {
      this.toast('Please enter your Email Addrress', 'danger');
      this.loadingController.dismiss();
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
  signIn() {
    //Routing to the login page.
    this.router.navigateByUrl('login');
  }
}
