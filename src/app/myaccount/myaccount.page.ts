import { Component, OnInit, Inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { loggedIn } from '@angular/fire/auth-guard';
import { isAPIResponseSuccess } from 'ionic';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {
  public Mine: Observable<any>;
  parkTime = interval(1000);

  constructor(
    public alertController: AlertController,
    public toaster: ToastController,
    public firebaseAuth: AngularFireAuth,
    public router: Router,
    public FirebaseService: FirebaseService,
    public fireStore: AngularFirestore,
    @Inject(DOCUMENT) public _document: Document
  ) {}
  public LeftData: Observable<any>;
  public RightData: Observable<any>;
  public cancelLeftOfer: any;
  public cancelRightOfer: any;
  public cancelLeftYes: any;
  public cancelRightYes: any;

  //Variables for personal card
  public UserName: any;
  public Email: any;
  public DateOfBirth: any;
  public PhoneNumber: any;
  public CarNumber: any;
  public DisabilityCard: any;
  public toggleCancel: any;

  ngOnInit() {
    //A function that works once whenever the user opens the page
    this.LeftData = this.fireStore
      .collection('OferPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges(); //All Left Park Data
    this.RightData = this.fireStore
      .collection('OferPark')
      .doc('Right')
      .collection('RightPark')
      .valueChanges(); //Right Park Data
    let currentUserEmail;
    this.firebaseAuth.user.subscribe((user) => {
      currentUserEmail = user.email;
      console.log(currentUserEmail);
      this.fireStore
        .collection('users')
        .doc(currentUserEmail)
        .get()
        .subscribe((data) => {
          console.log(data.data());
          this.UserName = data.data();
          this.UserName = this.UserName.Name;
          this.Email = currentUserEmail;
          this.DateOfBirth = data.data();
          this.DateOfBirth = this.DateOfBirth.DateOfBirth;
          this.PhoneNumber = data.data();
          this.PhoneNumber = this.PhoneNumber.PhoneNumber;
          this.CarNumber = data.data();
          this.CarNumber = this.CarNumber.CarNumber;
          this.DisabilityCard = data.data();
          this.DisabilityCard = this.DisabilityCard.DisabilityCard;
          this.toggleCancel = data.data();
          this.toggleCancel = this.toggleCancel.isParked;
        });
    });
  }
  async cancelReservation() {
    //A function is called when the user wants to cancel his reservation. It updates all the info about the specific park that he canceled.
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Park Cancelation',
      message: 'Are you sure you want to cancel your reservation ?',
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
          text: 'Yes',
          role: 'confirm',
          cssClass: 'primary',
          handler: () => {
            let currentUserEmail;
            this.firebaseAuth.user.subscribe((user) => {
              currentUserEmail = user.email;
              console.log(currentUserEmail);
              this.cancelLeftOfer = this.fireStore
                .collection('OferPark')
                .doc('Left')
                .collection('LeftPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach((value) => {
                    console.log(value.Status);
                    if (value.Email === currentUserEmail) {
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
                  });
                  return;
                });
              this.cancelRightOfer = this.fireStore
                .collection('OferPark')
                .doc('Right')
                .collection('RightPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach((value) => {
                    console.log(value.Status);
                    if (value.Email === currentUserEmail) {
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
                  });
                  return;
                });
              this.cancelLeftYes = this.fireStore
                .collection('YesParkB')
                .doc('Left')
                .collection('LeftPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach((value) => {
                    console.log(value.Status);
                    if (value.Email === currentUserEmail) {
                      this.fireStore
                        .collection('YesParkB')
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
                  });
                  return;
                });
              this.cancelRightYes = this.fireStore
                .collection('YesParkB')
                .doc('Right')
                .collection('RightPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach((value) => {
                    console.log(value.Status);
                    if (value.Email === currentUserEmail) {
                      this.fireStore
                        .collection('YesParkB')
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
                  });
                  return;
                });
              this.parkTime.subscribe((time) => {
                if (time == 1) {
                  this._document.defaultView.location.reload();
                }
              });
            });
          },
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async logout() {
    //A function that been called when the user wants to logout from the application
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
    //Calling this function when we need to show a user a message.
    const toast = await this.toaster.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000,
    });
    toast.present();
  }
}
