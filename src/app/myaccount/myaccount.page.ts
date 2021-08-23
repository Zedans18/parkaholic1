import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { loggedIn } from '@angular/fire/auth-guard';
import { isAPIResponseSuccess } from 'ionic';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {
  public Mine: Observable<any>;
  constructor(
    public alertController: AlertController,
    public toaster: ToastController,
    public firebaseAuth: AngularFireAuth,
    public router: Router,
    public FirebaseService: FirebaseService,
    public fireStore: AngularFirestore,
    public fireservices: AngularFirestore
  ) {}
  public LeftData: Observable<any>;
  public RightData: Observable<any>;

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
  }
  async cancelReservation() {
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
              this.fireservices
                .collection('users')
                .doc(currentUserEmail)
                .get()
                .subscribe(async (data) => {
                  let currentDoc: any;
                  currentDoc = data.data();
                  console.log(currentDoc);
                  if (currentDoc.Pos === 'Left') {
                    this.fireservices
                      .collection('OferPark')
                      .doc('Left')
                      .collection('LeftPark')
                      .doc(currentDoc.ParkName)
                      .update({
                        Status: 'Available',
                        Color: 'success',
                        Email: '',
                      });
                    if (currentDoc.isParked === true) {
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: false,
                          ParkName: '',
                          Side: '',
                        });
                    }
                  } else {
                    this.fireservices
                      .collection('OferPark')
                      .doc('Right')
                      .collection('RightPark')
                      .doc(currentDoc.ParkName)
                      .update({
                        Status: 'Available',
                        Color: 'success',
                        Email: '',
                      });
                    if (currentDoc.isParked === true) {
                      this.fireservices
                        .collection('users')
                        .doc(currentUserEmail)
                        .update({
                          isParked: false,
                          ParkName: '',
                          Side: '',
                        });
                    }
                  }
                });
            });
            return;
          },
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
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
}
