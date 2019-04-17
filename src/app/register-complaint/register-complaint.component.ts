import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { EmailValidators } from '../signup/email.validators';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-complaint',
  templateUrl: './register-complaint.component.html',
  styleUrls: ['./register-complaint.component.css']
})
export class RegisterComplaintComponent implements OnInit {


  showSpinner: boolean = false;
  body = '';

  constructor(private auth: AuthServiceService,
    private emailValidator: EmailValidators,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private db: AngularFireDatabase
    ) { }

    form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email, 
      ]),
      textarea: new FormControl('', [
        Validators.required,
        Validators.minLength(20)
      ]),
      type: new FormControl('Sanitation', [
        Validators.required
      ]),
      location: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      displayName: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });

  ngOnInit() {
  }

  postComplaint() {
    this.showSpinner = true;
    let complaint = {
      Body: this.textarea.value,
      Timestamp: new Date().getTime(),
      Type: this.type.value,
      approved: "false",
      cssClass: "is-grey",
      logoURL: "https://cdn1.iconfinder.com/data/icons/navigation-elements/512/user-login-man-human-body-mobile-person-512.png",
      platform: "Guest",
      Location: this.location.value,
      email: this.email.value,
      IssuerName: this.displayName.value
    };
    this.db.list('/twittercomplaints')
      .push(complaint)
        .then(data => {
          this.showSpinner = false;
          this.flashMessagesService.show(
            'Your complaint has been registered successfully. Keep checking your email regularly for further updates.', 
            { cssClass: 'flashMessage flash-success', timeout: 5000 });

        this.router.navigateByUrl('/');
          
        })
        .catch(err => {
          this.showSpinner = false;
          this.flashMessagesService.show(
            'Something went wrong. Try again later.', 
            { cssClass: 'flashMessage flash-danger', timeout: 5000 });
        });
  }

  get email() {
    return this.form.get('email');
  }

  get textarea() {
    return this.form.get('textarea');
  }

  get type() {
    return this.form.get('type');
  }

  get location() {
    return this.form.get('location');
  }

  get displayName() {
    return this.form.get('displayName');
  }

}
