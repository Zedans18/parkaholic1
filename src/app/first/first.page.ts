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
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';

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
  public UserStatus: any;
  public StatusLeft: any;
  public StatusRight: any;

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
    const Collection = this.fireStore.collection('OferPark');
    this.parkService.fullPark(Collection);
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
    let currentUserEmail;
    this.firebaseAuth.user.subscribe((user) => {
      //A function that checks if there is a park that has been reserved for more than 10 minutes.
      //Then that parking spot is getting canceled automatically
      currentUserEmail = user.email;
      this.fireStore
        .collection('OferPark')
        .doc('Left')
        .collection('LeftPark')
        .valueChanges()
        .subscribe((data) => {
          data.forEach((value) => {
            if (
              value.Status === 'Pending' &&
              value.Time < this.TimeNow.getMinutes() - 5
            ) {
              let answer = this.TimeNow.getMinutes() - value.Time;
              if (answer < 0) {
                answer += 60;
                if (answer > 5) {
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
                  this.fireStore
                    .collection('users')
                    .doc(currentUserEmail)
                    .update({
                      isParked: false,
                      ParkName: '',
                      Side: '',
                    });
                }
              }
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
      this.fireStore
        .collection('OferPark')
        .doc('Right')
        .collection('RightPark')
        .valueChanges()
        .subscribe((data) => {
          data.forEach((value) => {
            if (
              value.Status === 'Pending' &&
              value.Time == this.TimeNow.getMinutes() - 5
            ) {
              let answer = this.TimeNow.getMinutes() - value.Time;
              if (answer < 0) {
                answer += 60;
                if (answer > 5) {
                  this.fireStore
                    .collection('OferPark')
                    .doc('Right')
                    .collection('RightPark')
                    .doc(value.ParkName)
                    .update({
                      Status: 'Available',
                      Color: 'success',
                      Email: '',
                      Time: '',
                    });
                  this.fireStore
                    .collection('users')
                    .doc(currentUserEmail)
                    .update({
                      isParked: false,
                      ParkName: '',
                      Side: '',
                    });
                }
              }
              this.fireStore
                .collection('OferPark')
                .doc('Right')
                .collection('RightPark')
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

    let currentUser;
    this.firebaseAuth.user.subscribe((user) => {
      currentUser = user.email;
      this.fireStore
        .collection('users')
        .doc(currentUser)
        .get()
        .subscribe((data) => {
          this.UserStatus = data.data();
          this.UserStatus = this.UserStatus.isParked;
        });
    });
  }

  async presentAlertConfirmDisabilityLeft(park) {
    this.parkService.DisabilityParkReservation(
      this.fireStore
        .collection('OferPark')
        .doc('Left')
        .collection('LeftPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmDisabilityRight(park) {
    this.parkService.DisabilityParkReservation(
      this.fireStore
        .collection('OferPark')
        .doc('Right')
        .collection('RightPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmLeft(park) {
    this.parkService.ParkReservation(
      this.fireStore
        .collection('OferPark')
        .doc('Left')
        .collection('LeftPark')
        .doc(park.ParkName)
    );
  }
  async presentAlertConfirmRight(park) {
    this.parkService.ParkReservation(
      this.fireStore
        .collection('OferPark')
        .doc('Right')
        .collection('RightPark')
        .doc(park.ParkName)
    );
  }
  async refresh() {
    this.parkService.refresh();
  }
  async onMyWay() {
    const alertPending = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Reserve Pending..',
      message: 'Have you arrived ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Reservation Canceled');
            return;
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          cssClass: 'primary',
          handler: () => {
            let currentUser;
            this.StatusLeft = this.firebaseAuth.user.subscribe((user) => {
              currentUser = user.email;
              this.fireStore
                .collection('OferPark')
                .doc('Left')
                .collection('LeftPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach(async (value) => {
                    if (value.Status === 'Pending') {
                      this.fireStore
                        .collection('OferPark')
                        .doc('Left')
                        .collection('LeftPark')
                        .doc(value.ParkName)
                        .update({
                          Status: 'Reserved',
                          Color: 'danger',
                        });
                    }
                  });
                });
            });
            this.StatusRight = this.firebaseAuth.user.subscribe((user) => {
              currentUser = user.email;
              this.fireStore
                .collection('OferPark')
                .doc('Right')
                .collection('RightPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach(async (value) => {
                    if (value.Status === 'Pending') {
                      this.fireStore
                        .collection('OferPark')
                        .doc('Right')
                        .collection('RightPark')
                        .doc(value.ParkName)
                        .update({
                          Status: 'Reserved',
                          Color: 'danger',
                        });
                    }
                  });
                });
            });
          },
        },
      ],
    });
    await alertPending.present();
    return;
  }
  parkB() {
    this.router.navigate(['/first-b']);
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
