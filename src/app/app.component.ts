import { AngularFireDatabase } from 'angularfire2/database';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthServiceService } from './auth-service.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { SocketService } from './../socket.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ComplaintsService } from './complaints.service';
import { async } from 'q';
import { AppUser } from './Models/app-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  
  JSONdata;
  user: AppUser;
  isActive = true;
  isAdmin: boolean = false;
  showSpinner: boolean = true;
  Employees;

  constructor(
    private auth: AuthServiceService,
    socketService: SocketService,
    complaintsService: ComplaintsService,
    private flashMessagesService: FlashMessagesService,
    private db: AngularFireDatabase,
    private router: Router
    ) {
      if (this.user) {
        if (this.user.role == "Admin")
        this.isAdmin = true;
      }
      
    socketService.reveivedData()
        .subscribe(data => {
          this.JSONdata = JSON.parse(JSON.stringify(data));
          console.log(this.JSONdata);
          if (this.user) {
            if (this.user.role == "Admin") {
              complaintsService.manageComplaints(this.JSONdata);
            }
          }
      });
  }

  logout() {
    this.showSpinner = true;
    this.auth.logout()
      .then(res => {
        this.showSpinner = false;
        this.router.navigate(['/login']);
        this.flashMessagesService.show('Logged out succcessfully', { cssClass: 'flashMessage flash-success', timeout: 2000 });
      })
      .catch(err => {
        this.showSpinner = false;
        this.flashMessagesService.show('Something went wrong', { cssClass: 'flashMessage flash-danger', timeout: 2000 });
      });
  }

  async ngOnInit() {
    this.auth.appUser$.subscribe(appUser => {
      if (appUser) {
        this.showSpinner = false;
        this.user = appUser;
        console.log(this.user);
      } else {
        this.showSpinner = false;
        this.user = null;
      }
    });
  }

  ngAfterViewInit() {
    document.addEventListener('DOMContentLoaded', () => {

      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    
      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
    
        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {
    
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);
    
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
    
          });
        });
      }
    
    });
  }
}
 
  