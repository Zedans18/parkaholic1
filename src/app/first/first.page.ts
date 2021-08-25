import { Component, Injectable, Input, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  ELocalNotificationTriggerUnit,
  LocalNotifications,
} from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {
  public LeftData: Observable<any>;
  public RightData: Observable<any>;
  enableBackdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;
  //Parks color variables
  parkA = {
    a1Color: 'success',
  };

  constructor(
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseDatabase: AngularFireDatabase,
    private router: Router,
    public toaster: ToastController,
    public localNotification: LocalNotifications,
    public platform: Platform,
    public fcm: FCM
  ) {
    this.platform.ready().then(() => {
      this.localNotification.on('click').subscribe((res) => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg);
      });

      this.localNotification.on('trigger').subscribe((res) => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg);
      });
    });
  }

  ngOnInit() {
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
  }
  scheduleNotification() {
    this.localNotification.schedule({
      id: 1,
      title: 'Attention',
      text: 'sup bro',
      data: { page: 'my hidden message this is' },
      trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
    });
    this.fcm.getToken().then((token) => {
      console.log(token);
    });
  }
  async presentAlertConfirmDisability(park) {
    //Reserve a spot on CONFIRMATION
    if (park.Status === 'Pending' || park.Status === 'Taken') {
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
            return;
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
              this.fireservices
                .collection('users')
                .doc(currentUserEmail)
                .get()
                .subscribe(async (data) => {
                  let currentDoc: any;
                  currentDoc = data.data();
                  if (
                    currentDoc.isParked === true ||
                    currentDoc.DisabilityCard === ''
                  ) {
                    const alertPending = await this.alertController.create({
                      cssClass: 'my-custom-class',
                      header: 'Sorry',
                      message: 'You can not reserve this park',
                      buttons: [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                        },
                      ],
                    });
                    await alertPending.present();
                    return;
                  } else {
                    if (park.ID == 21) {
                      this.fireservices
                        .collection('OferPark')
                        .doc('Left')
                        .collection('LeftPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                        });
                    } else if (park.ID == 22) {
                      this.fireservices
                        .collection('OferPark')
                        .doc('Right')
                        .collection('RightPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                        });
                      return;
                    } else if (park.Email != '') {
                      return;
                    }
                    return;
                  }
                });
            });
            return;
          },
        },
      ],
    });
    await alert2.present();
  }

  async presentAlertConfirm(park) {
    //Reserve a spot on CONFIRMATION
    if (park.Status === 'Pending' || park.Status === 'Taken') {
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
            return;
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
              this.fireservices
                .collection('users')
                .doc(currentUserEmail)
                .get()
                .subscribe(async (data) => {
                  let currentDoc: any;
                  currentDoc = data.data();
                  if (currentDoc.isParked === true) {
                    const alertPending = await this.alertController.create({
                      cssClass: 'my-custom-class',
                      header: 'Sorry',
                      message: 'You can not reserve another park',
                      buttons: [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                        },
                      ],
                    });
                    await alertPending.present();
                    return;
                  } else {
                    if (park.ID <= 9 || park.Email === '') {
                      console.log('hi');
                      this.fireservices
                        .collection('OferPark')
                        .doc('Left')
                        .collection('LeftPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                          ParkName: park.ParkName,
                          Side: 'Left',
                        });
                    } else if (park.ID >= 10 || park.Email === '') {
                      this.fireservices
                        .collection('OferPark')
                        .doc('Right')
                        .collection('RightPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                          ParkName: park.ParkName,
                          Side: 'Right',
                        });
                      return;
                    } else if (park.Email != '') {
                      return;
                    }
                    return;
                  }
                });
            });
            return;
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
  showAlert(header, sub, msg) {
    this.alertController
      .create({
        header: header,
        subHeader: sub,
        message: msg,
        buttons: ['OK'],
      })
      .then((alert) => alert.present());
  }
}
