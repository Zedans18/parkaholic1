import { Injectable } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { interval } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ParkService {
  constructor(
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireStore: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseDatabase: AngularFireDatabase,
    public toaster: ToastController,
    public platform: Platform,
    @Inject(DOCUMENT) public _document: Document
  ) {}
  checkTime = interval(1000);
  parkTime = interval(1000);

  checkPark() {
    let currentUserEmail;
    this.firebaseAuth.user.subscribe((user) => {
      //This function checks if the user's park has been taken by someone else.
      //Then it changes the park's info.
      currentUserEmail = user.email;
      console.log(currentUserEmail);
      this.fireStore
        .collection('OferPark')
        .doc('Left')
        .collection('LeftPark')
        .valueChanges()
        .subscribe((data) => {
          data.forEach(async (value) => {
            if (value.Status === 'Reserved') {
              let spot: any;
              let newPark: any;
              this.fireStore.collection('users').doc(currentUserEmail).update({
                isParked: false,
                ParkName: '',
                Side: '',
              });
              this.fireStore
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
                //If someone who doesn't own the app parked in the user's spot.
                //The app automatically reserve for the user the first empty spot.
                if (time === 5) {
                  this.fireStore
                    .collection('OferPark')
                    .doc('Left')
                    .collection('LeftPark')
                    .doc(value.ParkName)
                    .update({
                      Status: 'Taken',
                    });
                  this.fireStore
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
                  this.fireStore
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
  async DisabilityParkReservation(park) {
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
              this.fireStore
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
                    if (park.ID === 21) {
                      park.update({
                        Status: 'Pending',
                        Color: 'warning',
                        Email: currentUserEmail,
                        Time: new Date().toTimeString().slice(0, 8),
                      });
                      this.fireStore
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: true,
                        });
                    } else if (park.ID === 22) {
                      park.update({
                        Status: 'Pending',
                        Color: 'warning',
                        Email: currentUserEmail,
                        Time: new Date().toTimeString().slice(0, 8),
                      });
                      this.fireStore
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

  async ParkReservation(park) {
    //Reserve a spot on CONFIRMATION. User can reserve the spot only if it is an available park.
    park.get().subscribe(async (data) => {
      if (
        data.data().Status === 'Pending' ||
        data.data().Status === 'Reserved' ||
        data.data().Status === 'Taken'
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
      } else {
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
                //Called if the user reserved the spot. It checks whether its available or not and gives a message.
                //Updates the data of the park and the user if he confirmed the parking spot.
                console.log('Reservation Confirmed');
                let currentUserEmail;
                this.firebaseAuth.user.subscribe((user) => {
                  currentUserEmail = user.email;
                  console.log(currentUserEmail);
                  this.fireStore
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
                        park.update({
                          Status: 'Pending',
                          Color: 'warning',
                          Email: currentUserEmail,
                          Time: new Date().getMinutes(),
                        });

                        park.get().subscribe((data) => {
                          if (data.data().ID <= 9) {
                            this.fireStore
                              .collection('users')
                              .doc(currentUserEmail)
                              .update({
                                isParked: true,
                                ParkName: data.data().ParkName,
                                Side: 'Left',
                              });
                          } else {
                            this.fireStore
                              .collection('users')
                              .doc(currentUserEmail)
                              .update({
                                isParked: true,
                                ParkName: data.data().ParkName,
                                Side: 'Right',
                              });
                          }
                        });

                        this.parkTime.subscribe((time) => {
                          if (time == 1) {
                            this._document.defaultView.location.reload();
                          }
                        });
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
    });
  }

  async fullPark(Collection) {
    let flag = 0;
    Collection.doc('Left')
      .collection('LeftPark')
      .get()
      .subscribe(async (stam) => {
        stam.docChanges().forEach((doc) => {
          console.log(doc.doc.data().Status);
          if (doc.doc.data().Status === 'Available') {
            flag = 1;
            return;
          }
        });
      });
    Collection.doc('Right')
      .collection('RightPark')
      .get()
      .subscribe(async (stam) => {
        stam.docChanges().forEach((doc) => {
          console.log(doc.doc.data());
          if (doc.doc.data().Status === 'Available') {
            flag = 1;
            return;
          }
        });
        if (flag === 0) {
          const alertPending = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Sorry',
            message: 'This park is FULL move to the next one!',
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
      });
  }
}
