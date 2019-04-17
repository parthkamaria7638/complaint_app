import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private auth: AuthServiceService, 
        private router: Router,
        private fmService: FlashMessagesService
    ) {}

    async canActivate() {
        let bool = false;
        await this.auth.appUser$.subscribe(appUser => {
            if (appUser) {
                console.log("1");
                console.log(appUser);
                if (appUser.role == "Admin") {
                    console.log("Is an admin");
                    bool = true;
                    return true;
                }

                else {
                    bool = false;
                    return false;
                }
            } else {
                bool = false;
                return false;
            }
          });
          console.log("2");
          return bool;
    }
}
