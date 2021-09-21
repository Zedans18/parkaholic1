import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecondBPage } from './second-b.page';

const routes: Routes = [
  {
    path: '',
    component: SecondBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecondBPageRoutingModule {}
