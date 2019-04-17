import { CompIDValidator } from './compID.validators';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { EmailValidators } from '../signup/email.validators';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-track-form',
  templateUrl: './track-form.component.html',
  styleUrls: ['./track-form.component.css']
})
export class TrackFormComponent implements OnInit {

  constructor(private auth: AuthServiceService,
    private idValidator: CompIDValidator,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private db: AngularFireDatabase) { }

    form = new FormGroup({
      complaintID: new FormControl('', [
        Validators.required,
      ],
      this.idValidator.notARegID
      )
    });

  ngOnInit() {
  }

  get complaintID() {
    return this.form.get('complaintID');
  }

  trackComplaint() {
    this.router.navigate(['/track', this.complaintID.value]);
  }

}
