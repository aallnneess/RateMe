import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../Services/auth.service";
import {InputComponent} from "../Controls/input/input.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  @ViewChild('mailInput') mailInput!: InputComponent;
  @ViewChild('passwordInput') passwordInput!: InputComponent;

  loginForm!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);

  error = '';

  authService = inject(AuthService);

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9@.]+$')]],
      'password' : ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  getFormControl(name: string) {
    return this.loginForm.get(name) as FormControl;
  }


  login() {
    console.log(this.loginForm.status);
    if (this.loginForm.invalid) {
      this.mailInput.checkErrors();
      this.passwordInput.checkErrors();
      return;
    }

    this.authService.login(
      this.loginForm.get('email')?.value,
      this.loginForm.get('password')?.value
    ).subscribe({
      complete: () => {
        this.cleanForm();
        this.router.navigateByUrl('members', {
          skipLocationChange: true
        });
      },
      error: err => {
        this.createErrorMessages(err);
      }
    });
  }

  cleanForm() {
    this.loginForm.reset();
    this.error = '';
  }

  createErrorMessages(err: string) {

    // TODO: Einlog Limit Fehlermeldung

    console.log(err);

    if (err === 'Invalid credentials. Please check the email and password.') {
      this.error = 'E-Mail oder Passwort falsch.'
    }

    if (err === 'Invalid `email` param: Value must be a valid email address') {
      this.error = 'E-Mail ist ungültig.'
    }



  }

}
