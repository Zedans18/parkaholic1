import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecondBPageRoutingModule } from './second-b-routing.module';

import { SecondBPage } from './second-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecondBPageRoutingModule
  ],
  declarations: [SecondBPage]
})
export class SecondBPageModule {}
