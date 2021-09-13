import { Injectable } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './services/firebase.service';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { interval } from 'rxjs';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class ParkService {
  constructor(
    public alertController: AlertController,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseDatabase: AngularFireDatabase,
    private router: Router,
    public toaster: ToastController,
    public platform: Platform,
    @Inject(DOCUMENT) public _document: Document
  ) {}
  checkPark() {
    let currentUserEmail;
    this.firebaseAuth.user.subscribe((user) => {
      //This function checks if the user's park has been taken by someone else.
      //Then it changes the park's info.
      currentUserEmail = user.email;
      console.log(currentUserEmail);
      this.fireservices
        .collection('OferPark')
        .doc('Left')
        .collection('LeftPark')
        .valueChanges()
        .subscribe((data) => {
          data.forEach(async (value) => {
            if (value.Status === 'Reserved') {
              let spot: any;
              let newPark: any;
              this.fireservices
                .collection('users')
                .doc(currentUserEmail)
                .update({
                  isParked: false,
                  ParkName: '',
                  Side: '',
                });
              this.fireservices
                .collection('OferPark')
                .doc('Left')
                .collection('LeftPark')
                .valueChanges()
                .subscribe((data) => {
                  data
                    .slice()
                    .reverse()
                    .forEach((value) => {
                      console.log(value);
                      if (value.Status === 'Available') {
                        spot = value.ID;
                        newPark = value.ParkName;
                      }
                      return;
                    });
                });
              this.checkTime.subscribe(async (time) => {
                //If someone who doesn't own the app parked in the user's spot.
                //The app automatically reserve for the user the first empty spot.
                if (time === 5) {
                  this.fireservices
                    .collection('OferPark')
                    .doc('Left')
                    .collection('LeftPark')
                    .doc(value.ParkName)
                    .update({
                      Status: 'Taken',
                    });
                  this.fireservices
                    .collection('OferPark')
                    .doc('Left')
                    .collection('LeftPark')
                    .doc(newPark)
                    .update({
                      Status: 'Pending',
                      Color: 'warning',
                      Email: currentUserEmail,
                      Time: new Date().getMinutes(),
                    });
                  this.fireservices
                    .collection('users')
                    .doc(currentUserEmail)
                    .update({
                      isParked: true,
                      ParkName: newPark,
                      Side: 'Left',
                    });
                }
              });
            }
          });
        });
    });
  }
}
