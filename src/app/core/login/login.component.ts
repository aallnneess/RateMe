import {Component, effect, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../Services/auth.service";
import {InputComponent} from "../Controls/input/input.component";
import {Router} from "@angular/router";
import {FullScreenLoaderService} from "../../shared/services/full-screen-loader.service";
import {PopupService} from "../Services/popup.service";

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
  fullScreenLoadingService = inject(FullScreenLoaderService);
  popupService = inject(PopupService);

  error = '';

  authService = inject(AuthService);


  constructor() {
    effect(() => {
      if (this.authService.loggedIn()) {
        this.router.navigate(['/members']);
      }
    });
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9@.]+$')]],
      'password' : ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  getFormControl(name: string) {
    return this.loginForm.get(name) as FormControl;
  }


  async login() {
    console.log('Login: ' + this.loginForm.status);
    if (this.loginForm.invalid) {
      this.mailInput.checkErrors();
      this.passwordInput.checkErrors();
      return;
    }
    this.fullScreenLoadingService.setLoadingOn();

    try {
      const session = await this.authService.login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      );
      this.cleanForm();
      this.router.navigateByUrl('members');
    } catch (err) {
      this.createErrorMessages(err as string);
      this.fullScreenLoadingService.setLoadingOff();
    }

  }

  cleanForm() {
    this.loginForm.reset();
    this.error = '';
  }

  createErrorMessages(err: string) {

    // TODO: Einlog Limit Fehlermeldung

    console.log(err);

    switch (err) {

      case 'Invalid credentials. Please check the email and password.': {
        this.error = 'E-Mail oder Passwort falsch.'
        break;
      }

      case 'Invalid `email` param: Value must be a valid email address': {
        this.error = 'E-Mail ist ungültig.'
        break;
      }

      case 'Rate limit for the current endpoint has been exceeded. Please try again after some time.': {
        this.error = 'Zu viele Login Versuche. Bitte eine Weile warten.'
        break;
      }

      case 'Network request failed': {
        this.error = 'Verbindung fehlgeschlagen.'
        break;
      }



      default: {
        this.error = err.toString();
      }

    }

    // if (err === 'Invalid credentials. Please check the email and password.') {
    //   this.error = 'E-Mail oder Passwort falsch.'
    // }
    //
    // if (err === 'Invalid `email` param: Value must be a valid email address') {
    //   this.error = 'E-Mail ist ungültig.'
    // }

  }

}
