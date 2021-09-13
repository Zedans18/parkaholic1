import { Component, OnInit, Inject } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { interval } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ParkService } from '../services/park.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {
  public LeftData: Observable<any>;
  public RightData: Observable<any>;

  obvs = interval(1000);
  checkTime = interval(1000);
  parkTime = interval(1000);
  public TimeNow = new Date();
  constructor(
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireStore: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseDatabase: AngularFireDatabase,
    private router: Router,
    public toaster: ToastController,
    public platform: Platform,
    @Inject(DOCUMENT) public _document: Document,
    public parkService: ParkService
  ) {}

  ngOnInit() {
    this.LeftData = this.fireStore
      .collection('OferPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges(); //Left Park Data
    this.RightData = this.fireStore
      .collection('OferPark')
      .doc('Right')
      .collection('RightPark')
      .valueChanges(); //Right Park Data
    this.TimeNow.getMinutes();
    console.log(this.TimeNow.getMinutes());
    let currentUserEmail;
    this.firebaseAuth.user.subscribe((user) => {
      //A function that checks if there is a park that has been reserved for more than 10 minutes.
      //Then that parking spot is getting canceled automatically
      currentUserEmail = user.email;
      console.log(currentUserEmail);
      this.fireStore
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
              this.fireStore
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
              this.fireStore.collection('users').doc(currentUserEmail).update({
                isParked: false,
                ParkName: '',
                Side: '',
              });
            }
          });
        });
    });
    this.parkService.checkPark();
  }
  async presentAlertConfirmDisability(park) {
    this.parkService.presentAlertConfirmDisability(park);
  }
  async presentAlertConfirm(park) {
    this.parkService.presentAlertConfirm(park);
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
}
