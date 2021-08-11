import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebase.service';
import {
  AlertController,
  LoadingController,
  MenuController,
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
    public menuController: MenuController,
    private authService: AngularFireAuth,
    public toaster: ToastController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}
  async resetPassword() {
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
  } //end of reset password
  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000,
    });
    toast.present();
  }
  signIn() {
    this.router.navigateByUrl('login');
  }
}
