import { Component, OnInit } from '@angular/core';
import { Local } from 'protractor/built/driverProviders';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  phoneNumber: string;
  carNumber: string;
  handiCap: string;
  passwordMatch: boolean;
  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    public firestore: AngularFireDatabase,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public toaster: ToastController
  ) {}

  ngOnInit() {}
  async register() {
    if (this.name && this.email && this.password) {
      const loading = await this.loadingController.create({
        message: 'Loading..',
        spinner: 'crescent',
        showBackdrop: true,
      });
      loading.present();
      this.firebaseAuth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          this.fireservices.collection('users').doc(data.user.uid).set({
            userId: data.user.uid,
            Name: this.name,
            Email: this.email,
            'Date Of Birth': this.dateOfBirth,
            'Phone Number': this.phoneNumber,
            'Car Number': this.carNumber,
            'Handicap Placard': this.handiCap,
            createdAt: Date.now(),
          });
          data.user.sendEmailVerification();
        })
        .then(() => {
          loading.dismiss();
          this.toast('Registeration Success!', 'success');
          this.router.navigateByUrl('login');
        })
        .catch((error) => {
          loading.dismiss();
          this.toast(error.message, 'danger');
        });
    } else {
      this.fillTheForm();
    }
  }

  checkPassword() {
    if (this.password == this.confirmPassword) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
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
  async fillTheForm() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Missing Information!',
      buttons: ['OK'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
  signIn() {
    this.router.navigateByUrl('login');
  }
}
