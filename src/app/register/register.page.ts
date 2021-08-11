/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Local } from 'protractor/built/driverProviders';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isSignedIn = false;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    public firestore: AngularFireDatabase,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false;
    }
  }

  async onSignup(
    name: string,
    email: string,
    password: string,
    dob: string,
    num: string,
    carnum: string
  ) {
    await this.firebaseService.signup(email, password);
    await this.firestore.database.app.firestore().collection('Users').add({
      Name: name,
      Email: email,
      Password: password,
      DateOfBirth: dob,
      PhoneNumber: num,
      CarNumber: carnum,
    });
    if (this.firebaseService.isLoggedIn) {
      this.isSignedIn = true;
      this.router.navigateByUrl('login');
      return;
    }
    this.showAlert();
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Missing Information',
      buttons: ['OK'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
  register() {
    this.router.navigateByUrl('login');
  }

  handleLogout() {
    this.isSignedIn = false;
  }
}
