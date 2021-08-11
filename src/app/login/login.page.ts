import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebase.service';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isSignedIn = false;
  constructor(
    private router: Router,
    public firebaseService: FirebaseService,
    public alertController: AlertController,
    public menuController: MenuController
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false;
    }
  }
  async onSignin(email: string, password: string) {
    await this.firebaseService.signin(email, password);
    if (this.firebaseService.isLoggedIn) {
      this.showAlert2();
      return;
    }
    this.showAlert();
  }
  //if missing information
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Invalid Email or Password',
      buttons: ['OK'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }
  //if logged in
  async showAlert2() {
    const alert = await this.alertController.create({
      header: 'Welcome',
      subHeader: 'bitch',
      buttons: ['OK'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    this.router.navigateByUrl('home');
    this.isSignedIn = true;
    console.log(result);
    return;
  }

  register() {
    this.router.navigateByUrl('register');
  }
}
