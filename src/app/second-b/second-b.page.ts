import { Component, OnInit, Inject } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { DOCUMENT } from '@angular/common';
import { ParkService } from '../services/park.service';

@Component({
  selector: 'app-second-b',
  templateUrl: './second-b.page.html',
  styleUrls: ['./second-b.page.scss'],
})
export class SecondBPage implements OnInit {
  public LeftData: Observable<any>;
  public RightData: Observable<any>;

  constructor(
    public router: Router,
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireStore: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseDatabase: AngularFireDatabase,
    public toaster: ToastController,
    public platform: Platform,
    @Inject(DOCUMENT) public _document: Document,
    public parkService: ParkService
  ) {}

  ngOnInit() {
    const Collection = this.fireStore.collection('YesParkB');
    this.parkService.fullPark(Collection);
    this.LeftData = this.fireStore
      .collection('YesParkB')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges(); //Left Park Data
    this.RightData = this.fireStore
      .collection('YesParkB')
      .doc('Right')
      .collection('RightPark')
      .valueChanges(); //Right Park Data
  }
  async presentAlertConfirmDisabilityLeft(park) {
    this.parkService.DisabilityParkReservation(
      this.fireStore
        .collection('YesParkB')
        .doc('Left')
        .collection('LeftPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmDisabilityRight(park) {
    this.parkService.DisabilityParkReservation(
      this.fireStore
        .collection('YesParkB')
        .doc('Right')
        .collection('RightPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmLeft(park) {
    this.parkService.ParkReservation(
      this.fireStore
        .collection('YesParkB')
        .doc('Left')
        .collection('LeftPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmRight(park) {
    this.parkService.ParkReservation(
      this.fireStore
        .collection('YesParkB')
        .doc('Right')
        .collection('RightPark')
        .doc(park.ParkName)
    );
  }
  async logout() {
    //A function that been called when the user wants to logout from the application
    const alert = await this.alertController.create({
      //when the function is called, an alert is created
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
            //Logged out of Firebase and routes to the Login page
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
    this.firebaseService.toast(msg, status);
  }
  parkA() {
    this.router.navigate(['/second']);
  }
}
