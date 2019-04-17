import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-track-complaint',
  templateUrl: './track-complaint.component.html',
  styleUrls: ['./track-complaint.component.css']
})
export class TrackComplaintComponent implements OnInit {


  id;
  showSpinner = true;
  employee;
  complaint;
  constructor(
    private Route: ActivatedRoute,
    private db: AngularFireDatabase
  ) { 
    this.id = this.Route.snapshot.paramMap.get('id');
    this.db.object('/twittercomplaints/' + this.id)
      .subscribe(data => {
        this.complaint = data;
        let empID = this.complaint.assignedTo;
        this.db.object('/Users/' + empID)
          .subscribe(data => {
            this.employee = data;
            this.showSpinner = false;
          });
      });
  }

  ngOnInit() {
  }

}
