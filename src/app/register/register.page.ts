/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Local } from 'protractor/built/driverProviders';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';

import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

export interface PickerColumn {
  name: string;
  align?: string;
  selectedIndex?: number;
  prevSelected?: number;
  prefix?: string;
  suffix?: string;
  options: PickerColumnOption[];
  cssClass?: string | string[];
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
  refresh?: () => void;
}
export interface PickerColumnOption {
  text?: string;
  value?: any;
  disabled?: boolean;
  duration?: number;
  transform?: string;
  selected?: boolean;
}

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
  startNumber: string[] = ['050', '052', '053', '054', '055', '057', '058'];
  btnVal = '05';

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    public firestore: AngularFireDatabase,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public toaster: ToastController,
    public pickerController: PickerController
  ) {}

  ngOnInit() {}
  async showPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value: any) => {
            console.log(value);
          },
        },
      ],
      columns: [
        {
          name: 'Phone Number Start',
          options: this.getColumnOptions(),
        },
      ],
    };

    let picker = await this.pickerController.create(options);

    picker.present();
  }

  getColumnOptions() {
    let options = [];
    this.startNumber.forEach((x) => {
      options.push({ text: x, value: x });
      this.btnVal = x;
    });
    return options;
  }

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
          data.user.sendEmailVerification();
        })

        .then(() => {
          loading.dismiss();
          this.toast(
            'Verfication Email Sent! Please Check Your Email.',
            'success'
          );
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
    if (this.password === this.confirmPassword) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }
  async toast(msg, status) {
    const toast = await this.toaster.create({
      message: msg,
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
