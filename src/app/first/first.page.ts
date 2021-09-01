import { Component, Injectable, Input, OnInit, Inject } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { interval } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public LeftData: Observable<any>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public RightData: Observable<any>;
  public ok: any;
  public LeftTime: any;
  enableBackdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;
  obvs = interval(1000);
  checkTime = interval(1000);
  parkTime = interval(1000);
  public TimeNow = new Date();
  constructor(
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseDatabase: AngularFireDatabase,
    private router: Router,
    public toaster: ToastController,
    public platform: Platform,
    @Inject(DOCUMENT) public _document: Document
  ) {}

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
    this.ok = this.fireservices
      .collection('OferPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges()
      .subscribe((data) => {
        data.forEach((value) => {
          console.log(value.Status);
        });
      });
    this.TimeNow.getMinutes();
    console.log(this.TimeNow.getMinutes());
    let currentUserEmail;
    this.firebaseAuth.user.subscribe((user) => {
      currentUserEmail = user.email;
      console.log(currentUserEmail);
      this.fireservices
        .collection('OferPark')
        .doc('Left')
        .collection('LeftPark')
        .valueChanges()
        .subscribe((data) => {
          data.forEach((value) => {
            if (
              value.Status === 'Pending' &&
              value.Time == this.TimeNow.getMinutes() - 1
            ) {
              this.fireservices
                .collection('OferPark')
                .doc('Left')
                .collection('LeftPark')
                .doc(value.ParkName)
                .update({
                  Status: 'Available',
                  Color: 'success',
                  Email: '',
                  Time: '',
                });
              this.fireservices
                .collection('users')
                .doc(currentUserEmail)
                .update({
                  isParked: false,
                  ParkName: '',
                  Side: '',
                });
            }
          });
        });
    });
    this.firebaseAuth.user.subscribe((user) => {
      currentUserEmail = user.email;
      console.log(currentUserEmail);
      this.fireservices
        .collection('OferPark')
        .doc('Left')
        .collection('LeftPark')
        .valueChanges()
        .subscribe((data) => {
          data.forEach(async (value) => {
            if (value.Status === 'Reserved') {
              let spot: any;
              let newPark: any;
              this.fireservices
                .collection('users')
                .doc(currentUserEmail)
                .update({
                  isParked: false,
                  ParkName: '',
                  Side: '',
                });
              this.fireservices
                .collection('OferPark')
                .doc('Left')
                .collection('LeftPark')
                .valueChanges()
                .subscribe((data) => {
                  data
                    .slice()
                    .reverse()
                    .forEach((value) => {
                      console.log(value);
                      if (value.Status === 'Available') {
                        spot = value.ID;
                        newPark = value.ParkName;
                      }
                      return;
                    });
                });

              this.checkTime.subscribe(async (time) => {
                if (time === 5) {
                  this.fireservices
                    .collection('OferPark')
                    .doc('Left')
                    .collection('LeftPark')
                    .doc(value.ParkName)
                    .update({
                      Status: 'Taken',
                    });
                  this.fireservices
                    .collection('OferPark')
                    .doc('Left')
                    .collection('LeftPark')
                    .doc(newPark)
                    .update({
                      Status: 'Pending',
                      Color: 'warning',
                      Email: currentUserEmail,
                      Time: new Date().getMinutes(),
                    });
                  this.fireservices
                    .collection('users')
                    .doc(currentUserEmail)
                    .update({
                      isParked: true,
                      ParkName: newPark,
                      Side: 'Left',
                    });
                }
              });
            }
          });
        });
    });
  }

  async presentAlertConfirmDisability(park) {
    //Reserve a spot on CONFIRMATION ONLY for users with Disability Card
    if (park.Status === 'Pending' || park.Status === 'Reserved') {
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
                  // eslint-disable-next-line prefer-const
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
                    if (park.ID === 21) {
                      this.fireservices
                        .collection('OferPark')
                        .doc('Left')
                        .collection('LeftPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                          Time: new Date().toTimeString().slice(0, 8),
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                        });
                    } else if (park.ID === 22) {
                      this.fireservices
                        .collection('OferPark')
                        .doc('Right')
                        .collection('RightPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                          Time: new Date().toTimeString().slice(0, 8),
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                        });
                      return;
                    } else if (park.Email !== '') {
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
    if (
      park.Status === 'Pending' ||
      park.Status === 'Reserved' ||
      park.Status === 'Taken'
    ) {
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
                          cssClass: 'primary',
                        },
                      ],
                    });
                    await alertPending.present();
                    return;
                  } else {
                    if (park.ID <= 9 && park.Email === '') {
                      this.fireservices
                        .collection('OferPark')
                        .doc('Left')
                        .collection('LeftPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                          Time: new Date().getMinutes(),
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                          ParkName: park.ParkName,
                          Side: 'Left',
                        });
                      this.parkTime.subscribe((time) => {
                        if (time == 1) {
                          this._document.defaultView.location.reload();
                        }
                      });
                      /* this.obvs.subscribe(async (time) => {
                        if (time === 10) {
                          const timeAlert = await this.alertController.create({
                            cssClass: 'my-custom-class',
                            header: 'Sorry!',
                            message: 'You lost your spot due to overtime',
                            buttons: [
                              {
                                text: 'OK',
                                role: 'cancel',
                                cssClass: 'secondary',
                              },
                              {
                                text: 'Yes',
                                role: 'confirm',
                                cssClass: 'primary',
                                handler: () => {
                                  this.toast(
                                    'We will till you shortly where to park. Please Be patient',
                                    'success'
                                  );
                                  let spot: any;
                                  let newPark: any;
                                  this.fireservices
                                    .collection('OferPark')
                                    .doc('Left')
                                    .collection('LeftPark')
                                    .valueChanges()
                                    .subscribe((data) => {
                                      data.forEach((value) => {
                                        console.log(value);
                                        if (value.Status === 'Available') {
                                          spot = value.ID;
                                          console.log(spot);
                                          newPark = value.ParkName;
                                          console.log(newPark);
                                          return;
                                        }
                                      });
                                    });

                                  this.checkTime.subscribe(async (time) => {
                                    if (time === 5) {
                                      const offer =
                                        await this.alertController.create({
                                          cssClass: 'my-custom-class',
                                          header: 'Park in spot number:',
                                          message: spot,
                                          buttons: [
                                            {
                                              text: 'OK',
                                              role: 'cancel',
                                              cssClass: 'primary',
                                            },
                                          ],
                                        });
                                      await offer.present();
                                    }
                                  });
           
                                },
                              },
                            ],
                          });
                          await timeAlert.present();
                          this.fireservices
                            .collection('OferPark')
                            .doc('Left')
                            .collection('LeftPark')
                            .doc(park.ParkName)
                            .update({
                              Status: 'Available',
                              Color: 'success',
                              Email: '',
                              Time: '',
                            });

                          this.fireservices
                            .collection('users')
                            .doc(currentUserEmail)
                            .update({
                              isParked: false,
                              ParkName: '',
                              Side: '',
                            });
                        }
                      });*/
                    } else if (park.ID >= 10 && park.Email === '') {
                      this.fireservices
                        .collection('OferPark')
                        .doc('Right')
                        .collection('RightPark')
                        .doc(park.ParkName)
                        .update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                          Time: new Date().toTimeString().slice(0, 8),
                        });
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                          ParkName: park.ParkName,
                          Side: 'Right',
                        });
                      this.obvs.subscribe(async (time) => {
                        if (time === 5) {
                          const timeAlert = await this.alertController.create({
                            cssClass: 'my-custom-class',
                            header: 'You Lost Your Spot!',
                            message: 'Do you want another park?',
                            buttons: [
                              {
                                text: 'No',
                                role: 'cancel',
                                cssClass: 'secondary',
                              },
                              {
                                text: 'Yes',
                                role: 'confirm',
                                cssClass: 'primary',
                                handler: () => {
                                  this.toast('Please Be patient...', 'success');
                                  park.ID = park.ID + 1;
                                  this.checkTime.subscribe(async (time) => {
                                    if (time === 5) {
                                      const offer =
                                        await this.alertController.create({
                                          cssClass: 'my-custom-class',
                                          header: 'Park in spot number:',
                                          message: park.ID,
                                          buttons: [
                                            {
                                              text: 'OK',
                                              role: 'cancel',
                                              cssClass: 'primary',
                                            },
                                          ],
                                        });
                                      await offer.present();
                                    }
                                  });

                                  this.fireservices
                                    .collection('OferPark')
                                    .doc('Right')
                                    .collection('RightPark')
                                    .doc(park.ParkName)
                                    .update({
                                      Status: 'Available',
                                      Color: 'success',
                                      Email: '',
                                      Time: '',
                                    });

                                  this.fireservices
                                    .collection('users')
                                    .doc(currentUserEmail)
                                    .update({
                                      isParked: false,
                                      ParkName: '',
                                      Side: '',
                                    });
                                },
                              },
                            ],
                          });
                          await timeAlert.present();
                        }
                      });
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
