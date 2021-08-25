import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

//env
import environment from '../environments/environment';

//services
import { FirebaseService } from './services/firebase.service';

//guards
import { AuthGuard } from './guards/auth.guard';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';

//FCM
import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'Parkaholic'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthGuardModule,
  ],
  providers: [
    FCM,
    FirebaseService,
    AuthGuard,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
