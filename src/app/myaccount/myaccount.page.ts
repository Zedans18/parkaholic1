import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {
  constructor(
    public alertController: AlertController,
    public toaster: ToastController,
    public firebaseAuth: AngularFireAuth,
    public router: Router,
    public FirebaseService: FirebaseService
  ) {}

  ngOnInit() {}
  username = JSON.parse(localStorage.getItem('currentUser'));

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
