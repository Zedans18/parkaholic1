import { Component, Input, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {
  enableBackdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;

  constructor(
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public FirebaseService: FirebaseService,
    private router: Router
  ) {}
  id: number;

  ngOnInit() {}

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
  async presentAlertConfirm() {
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
  }
  logout() {
    this.FirebaseService.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
