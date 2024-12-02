// signup.component.ts
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedModule } from '../../../shared/index.module';
import { provideIcons } from '@spartan-ng/ui-icon-helm';
import {
  lucideEye,
  lucideEyeOff,
  lucideLoader,
  lucideMail,
  lucideLock,
  lucideCheck
} from '@ng-icons/lucide';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule],
  providers: [
    provideIcons({
      lucideEye,
      lucideEyeOff,
      lucideLoader,
      lucideMail,
      lucideLock,
      lucideCheck
    })
  ],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  @ViewChild('signupForm') signupForm!: NgForm;
  isLoading = false;
  showPassword = false;
  agreeToTerms = false;
  disneyLogoPath = '/images/disney.png';

  private authStatusSub!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }


}
