import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import all the components for which navigation service has to be activated
import { SignInComponent } from '../auth/components/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/components/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
