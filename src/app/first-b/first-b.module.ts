import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstBPageRoutingModule } from './first-b-routing.module';

import { FirstBPage } from './first-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirstBPageRoutingModule
  ],
  declarations: [FirstBPage]
})
export class FirstBPageModule {}
