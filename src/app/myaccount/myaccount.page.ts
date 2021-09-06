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
    public fireservices: AngularFirestore,
    @Inject(DOCUMENT) public _document: Document
  ) {}
  public LeftData: Observable<any>;
  public RightData: Observable<any>;
  public cancelLeft: any;
  public cancelRight: any;

  ngOnInit() {
    //A function that works once whenever the user opens the page
    this.LeftData = this.fireservices
      .collection('OferPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges(); //All Left Park Data
    this.RightData = this.fireservices
      .collection('OferPark')
      .doc('Right')
      .collection('RightPark')
      .valueChanges(); //Right Park Data
  }
  async cancelReservation() {
    //A function is called when the user wants to cancel his reservation. It updates all the info about the specific park that he canceled.
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Park Cancelation',
      message: 'Cancel Your Reservation',
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
            let currentUserEmail;
            this.firebaseAuth.user.subscribe((user) => {
              currentUserEmail = user.email;
              console.log(currentUserEmail);
              this.cancelLeft = this.fireservices
                .collection('OferPark')
                .doc('Left')
                .collection('LeftPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach((value) => {
                    console.log(value.Status);
                    if (value.Email === currentUserEmail) {
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
                  return;
                });
              this.cancelRight = this.fireservices
                .collection('OferPark')
                .doc('Right')
                .collection('RightPark')
                .valueChanges()
                .subscribe((data) => {
                  data.forEach((value) => {
                    console.log(value.Status);
                    if (value.Email === currentUserEmail) {
                      this.fireservices
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
