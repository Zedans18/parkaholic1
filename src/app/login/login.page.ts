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
    public menuController: MenuController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    private toaster: ToastController
  ) {}

  ngOnInit() {}
  
  register() {
    this.router.navigateByUrl('register');
  } //end of register
  forgot() {
    this.router.navigateByUrl('reset');
  } //end of forgot
  async login() {
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
  } //end of login
  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000,
    });
    toast.present();
  } //end of toast
}
