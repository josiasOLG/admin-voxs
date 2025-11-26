import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { noAuthGuard } from './guards';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard],
    title: 'Login - Admin Barbearia',
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard],
    title: 'Criar Conta - Admin Barbearia',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [noAuthGuard],
    title: 'Esqueci a Senha - Admin Barbearia',
  },
  {
    path: 'verify-code',
    component: VerifyCodeComponent,
    canActivate: [noAuthGuard],
    title: 'Verificar Código - Admin Barbearia',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [noAuthGuard],
    title: 'Redefinir Senha - Admin Barbearia',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
