import { Component, OnInit } from '@angular/core';
import { AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  constructor(
    private router: Router,
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public FirebaseService: FirebaseService
  ) {}
  first() {
    this.router.navigate(['/first']);
  }
  ngOnInit() {}
  logout() {
    this.FirebaseService.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
