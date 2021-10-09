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
  selector: 'app-second',
  templateUrl: './second.page.html',
  styleUrls: ['./second.page.scss'],
})
export class SecondPage implements OnInit {
  public LeftData: Observable<any>;
  public RightData: Observable<any>;
  public UserStatus: any;

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
      .collection('YesPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges(); //Left Park Data
    this.RightData = this.fireStore
      .collection('YesPark')
      .doc('Right')
      .collection('RightPark')
      .valueChanges(); //Right Park Data
    const Collection = this.fireStore.collection('YesPark');
    this.parkService.fullPark(Collection);
    let currentUser;
    this.firebaseAuth.user.subscribe((user) => {
      currentUser = user.email;
      console.log(currentUser);
      this.fireStore
        .collection('users')
        .doc(currentUser)
        .get()
        .subscribe((data) => {
          console.log(data.data());
          this.UserStatus = data.data();
          this.UserStatus = this.UserStatus.isParked;
        });
    });
  }
  async presentAlertConfirmDisabilityLeft(park) {
    this.parkService.DisabilityParkReservation(
      this.fireStore
        .collection('YesPark')
        .doc('Left')
        .collection('LeftPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmDisabilityRight(park) {
    this.parkService.DisabilityParkReservation(
      this.fireStore
        .collection('YesPark')
        .doc('Right')
        .collection('RightPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmLeft(park) {
    this.parkService.ParkReservation(
      this.fireStore
        .collection('YesPark')
        .doc('Left')
        .collection('LeftPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmRight(park) {
    this.parkService.ParkReservation(
      this.fireStore
        .collection('YesPark')
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
  parkB() {
    this.router.navigate(['/second-b']);
  }
  async refresh() {
    this.parkService.refresh();
  }
}
