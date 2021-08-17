import { Component, Input, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { unzip } from 'zlib';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {
  enableBackdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;
  id: number;
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
    private router: Router
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
  async presentAlertConfirm(parkId) {
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
          },
        },
      ],
    });
    await alert2.present();
    let currentUserEmail;
    let userID;
    this.firebaseAuth.user.subscribe((user) => {
      currentUserEmail = user.email;
      userID = user.uid;
      console.log(currentUserEmail + ' ' + userID);
      this.firebaseService.fireservices
        .collection('users')
        .get()
        .subscribe((data) => {
          data.forEach((doc) => {
            let currentDoc: any;
            // eslint-disable-next-line prefer-const
            currentDoc = doc.data();
            if (currentUserEmail === currentDoc.Email) {
              this.fireservices
                .collection('OferPark')
                .doc(currentUserEmail)
                .set({
                  parkID: parkId,
                  userEmail: currentUserEmail,
                  isReserved: 'reserved',
                });
            }
          });
        });
    });
  }
  logout() {
    this.firebaseService.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
