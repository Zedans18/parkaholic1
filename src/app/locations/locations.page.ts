import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  public LeftData: Observable<any>;
  public RightData: Observable<any>;
  countOfer = 0;
  countYes = 0;
  countYesB = 0;
  constructor(
    private router: Router,
    public firebaseAuth: AngularFireAuth,
    public fireStore: AngularFirestore,
    public firebaseService: FirebaseService,
    public toaster: ToastController,
    public alertController: AlertController
  ) {}
  first() {
    //Routing to a parking lot
    this.router.navigate(['/first']);
  }
  second() {
    //Routing to a parking lot
    this.router.navigate(['/second']);
  }
  secondB() {
    //Routing to a parking lot
    this.router.navigate(['/second-b']);
  }
  ngOnInit() {
    this.fireStore
      .collection('OferPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges()
      .subscribe((data) => {
        this.countOfer = 0;
        data.forEach((value) => {
          if (value.Status === 'Available') {
            this.countOfer++;
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
          if (value.Status === 'Available') {
            this.countOfer++;
          }
        });
      });
    this.fireStore
      .collection('YesPark')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges()
      .subscribe((data) => {
        this.countYes = 0;
        data.forEach((value) => {
          if (value.Status === 'Available') {
            this.countYes++;
          }
        });
      });
    this.fireStore
      .collection('YesPark')
      .doc('Right')
      .collection('RightPark')
      .valueChanges()
      .subscribe((data) => {
        data.forEach((value) => {
          if (value.Status === 'Available') {
            this.countYes++;
          }
        });
      });
    this.fireStore
      .collection('YesParkB')
      .doc('Left')
      .collection('LeftPark')
      .valueChanges()
      .subscribe((data) => {
        data.forEach((value) => {
          if (value.Status === 'Available') {
            this.countYesB++;
          }
        });
      });
    this.fireStore
      .collection('YesParkB')
      .doc('Right')
      .collection('RightPark')
      .valueChanges()
      .subscribe((data) => {
        data.forEach((value) => {
          if (value.Status === 'Available') {
            this.countYesB++;
          }
        });
      });
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
