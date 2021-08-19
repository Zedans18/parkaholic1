import { Component, Injectable, Input, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { unzip } from 'zlib';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phoneNumber: string;
  carNumber: string;
  disabilityCard = '';
  public LeftData: Observable<any>;
  public RightData: Observable<any>;
  public UsersData: Observable<any>;
  enableBackdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;
  //Parks color variables
  parkA = {
    a1Color: 'success',
    a2Color: 'success',
    a3Color: 'success',
    a4Color: 'success',
    a5Color: 'success',
    a6Color: 'success',
    a7Color: 'success',
    a8Color: 'success',
    a9Color: 'success',
    a10Color: 'success',
    a11Color: 'success',
    a12Color: 'success',
    a13Color: 'success',
    a14Color: 'success',
  };

  parkAMap = new Map(Object.entries(this.parkA));
  constructor(
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseDatabase: AngularFireDatabase,
    private router: Router,
    public toaster: ToastController
  ) {}

  ngOnInit() {
    console.log(Object.entries(this.parkA));
    this.fireservices
      .collection('OferPark')
      .get()
      .subscribe((observer) => {
        Object.values(observer.docChanges()).forEach((val) => {
          let currentDoc: any;
          // eslint-disable-next-line prefer-const
          currentDoc = val.doc.data();
          if (currentDoc.Status === 'Available') {
            Object.values(this.parkA).forEach(function (part, index) {
              this[index] = 'danger';
            }, Object.values(this.parkA));
          }
        });
      });
    this.LeftData = this.fireservices
      .collection('OferPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges(); //Left Park Data
    this.RightData = this.fireservices
      .collection('OferPark')
      .doc('Right')
      .collection('RightPark')
      .valueChanges(); //Right Park Data
    let currentUserEmail;
    this.firebaseAuth.user.subscribe((user) => {
      currentUserEmail = user.email;
      console.log(currentUserEmail);
    });
    this.UsersData = this.fireservices
      .collection('users')
      .doc(currentUserEmail)
      .valueChanges();
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Sorry!',
      subHeader: 'This park has been taken!',
      buttons: ['OK'],
    });
    console.log('Sorry!');
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
  async presentAlertConfirm(park) {
    if (park.Status === 'Pending') {
      const alertPending = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Sorry',
        message: 'This park has been taken',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
      });
      await alertPending.present();
      return;
    }
    const alert2 = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Park Reservation',
      message: 'Confirm Your Reservation',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Reservation Canceled');
          },
        },
        {
          text: 'Confirm',
          role: 'confirm',
          cssClass: 'primary',
          handler: () => {
            console.log('Reservation Confirmed');
            let currentUserEmail;
            this.firebaseAuth.user.subscribe((user) => {
              currentUserEmail = user.email;
              console.log(currentUserEmail);
            });
            this.fireservices
              .collection('users')
              .doc(currentUserEmail)
              .valueChanges()
              .subscribe(() => {
                this.fireservices
                  .collection('users')
                  .doc(currentUserEmail)
                  .valueChanges()
                  .subscribe((data) => {
                    let currentDoc: any;
                    currentDoc = data;
                    console.log(data);
                    if (currentDoc.isParked === true) {
                      this.toast(
                        'Sorry! You already reserved another park',
                        'danger'
                      );
                      return;
                    } else {
                      if (park.ID <= 9) {
                        this.fireservices
                          .collection('OferPark')
                          .doc('Left')
                          .collection('LeftPark')
                          .doc(park.ParkName)
                          .set({
                            ID: park.ID,
                            ParkName: park.ParkName,
                            Status: 'Pending',
                            Color: 'warning',
                            Email: currentUserEmail,
                          });
                        this.fireservices
                          .collection('users')
                          .doc(currentUserEmail)
                          .set({
                            Name: this.name,
                            Email: this.email,
                            Password: this.password,
                            'Date Of Birth': this.dateOfBirth,
                            'Phone Number': this.phoneNumber,
                            'Car Number': this.carNumber,
                            'Disability Card': this.disabilityCard,
                            isParked: true,
                            createdAt: Date.now(),
                          });
                        console.log('lol');
                        localStorage.setItem(
                          'currentUser',
                          JSON.stringify({ Name: this.name })
                        );
                      } else {
                        this.fireservices
                          .collection('OferPark')
                          .doc('Right')
                          .collection('RightPark')
                          .doc(park.ParkName)
                          .set({
                            ID: park.ID,
                            ParkName: park.ParkName,
                            Status: 'Pending',
                            Color: 'warning',
                            Email: currentUserEmail,
                          });
                        this.fireservices
                          .collection('users')
                          .doc(currentUserEmail)
                          .set({
                            Name: this.name,
                            Email: this.email,
                            Password: this.password,
                            'Date Of Birth': this.dateOfBirth,
                            'Phone Number': this.phoneNumber,
                            'Car Number': this.carNumber,
                            'Disability Card': this.disabilityCard,
                            isParked: true,
                            createdAt: Date.now(),
                          });
                        localStorage.setItem(
                          'currentUser',
                          JSON.stringify({ Name: this.name })
                        );
                      }
                    }
                  });
              });
          },
        },
      ],
    });
    await alert2.present();
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'Log Out',
      subHeader: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Reservation Canceled');
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          cssClass: 'danger',

          handler: () => {
            this.toast('Logged Out!', 'danger');
            this.firebaseAuth.signOut();
            this.router.navigateByUrl('login');
          },
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
  async toast(msg, status) {
    const toast = await this.toaster.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000,
    });
    toast.present();
  } //end of toast
}
export class spot {
  ID: number;
  disablity: boolean = false;
}
