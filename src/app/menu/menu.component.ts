import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    public firebaseAuth: AngularFireAuth,
    public fireservices: AngularFirestore,
    public FirebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {}
  logout() {
    this.FirebaseService.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
