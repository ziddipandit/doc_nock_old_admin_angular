import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, LoginInterface, ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: any;
  password: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initializeLoginForm();
    this.password = "password";
  }

  togglePassword(){
    if (this.password === 'password'){
      this.password = 'text';
    } else {
      this.password = 'password';
    }
  }

  get formControls(): any {
    return this.loginForm.controls;
  }

  submitLoginForm() {
    const formValues: LoginInterface = this.loginForm.value;
    if(this.loginForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    this.authService.login(formValues).subscribe((res: ApiResponse) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.authService.setTokenAndUserInfo(res.data);

        this.toastr.success(res.message, '', {
          timeOut: 1000,
        });
        if (this.authService.isUserLoggedIn()) {
          this.authService.userInfo.next(this.authService.getUserDetails());
          const redirectUrl = this.authService.redirectTo();
          this.router.navigateByUrl(redirectUrl);
        }
      } else {
        this.toastr.error(res.message);
      }
    });
  }

}
