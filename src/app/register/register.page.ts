import { Component, OnInit } from '@angular/core';
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
  disabilityCard = '';
  passwordMatch: boolean;
  public toggleDisability = false;

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
    //Checking the inputs of the user, if there is any error a toast will pop up. Otherwise you will successfully been registered
    if (this.name && this.email && this.password) {
      const loading = await this.loadingController.create({
        message: 'Loading..',
        spinner: 'crescent',
        showBackdrop: true,
        duration: 2000,
      });
      loading.present();
      this.firebaseAuth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          this.fireservices.collection('users').doc(data.user.email).set({
            userId: data.user.uid,
            Name: this.name,
            Email: this.email,
            Password: this.password,
            'Date Of Birth': this.dateOfBirth,
            'Phone Number': this.phoneNumber,
            'Car Number': this.carNumber,
            DisabilityCard: this.disabilityCard,
            isParked: false,
            createdAt: Date.now(),
          });
          localStorage.setItem(
            'currentUser',
            JSON.stringify({ name: this.name })
          );
          data.user.sendEmailVerification(); //Firebase function that sends the user a verfication email.
        })

        .then(() => {
          //A function that tells you if you entered all the inputs
          loading.dismiss();
          this.toast(
            'Verfication Email Sent! Please Check Your Email.',
            'success'
          );
          this.router.navigateByUrl('login');
        })
        .catch(() => {
          //A function that throws an error if there is a wrong or missing input
          loading.dismiss();
          this.toast('Missing or Invalid Data Entered', 'danger');
        });
    } else {
      this.fillTheForm();
    }
  }

  checkPassword() {
    //Checking if the Confirm password matches the password you entered first
    if (this.password === this.confirmPassword) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
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
  async fillTheForm() {
    //A function that will alert the user if he didn't fill the register form.
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
    //Routing to the login page.
    this.router.navigateByUrl('login');
  }
}
