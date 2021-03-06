import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'locations',
    loadChildren: () =>
      import('./locations/locations.module').then((m) => m.LocationsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'first',
    loadChildren: () =>
      import('./first/first.module').then((m) => m.FirstPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reset',
    loadChildren: () =>
      import('./reset/reset.module').then((m) => m.ResetPageModule),
  },
  {
    path: 'myaccount',
    loadChildren: () =>
      import('./myaccount/myaccount.module').then((m) => m.MyaccountPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'second',
    loadChildren: () =>
      import('./second/second.module').then((m) => m.SecondPageModule),
  },
  {
    path: 'second-b',
    loadChildren: () =>
      import('./second-b/second-b.module').then((m) => m.SecondBPageModule),
  },
  {
    path: 'first-b',
    loadChildren: () =>
      import('./first-b/first-b.module').then((m) => m.FirstBPageModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
  },
  {
    path: 'contactus',
    loadChildren: () =>
      import('./contactus/contactus.module').then((m) => m.ContactusPageModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
