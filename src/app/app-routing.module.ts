import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordComponent } from './password/password.component';
import { SelectFileComponent } from './select-file/select-file.component';

const routes: Routes = [
  { path: '', component: PasswordComponent },
  { path: 'select', component: SelectFileComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
