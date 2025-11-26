import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';

// Components
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';

// Services
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    // Standalone components are imported automatically by router
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyCodeComponent,
    ResetPasswordComponent,
  ],
  providers: [AuthService],
})
export class AuthModule {}
