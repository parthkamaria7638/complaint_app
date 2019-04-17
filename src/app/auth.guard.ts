import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthServiceService, 
        private router: Router,
        private fmService: FlashMessagesService
    ) {}

    async canActivate() {
        let bool = false;
        await this.auth.appUser$.subscribe(appUser => {
            if (appUser) {
                bool = true;
              return true;
            } else {
                this.router.navigate(['/login']);
                bool = false;
                return false;
            }
          });

          return bool;
    }

    // canActivate() {
    //     return this.auth.appUser$.map(user => {
    //       if (user) {
    //         return true;
    //       }
    //       this.router.navigate(['/login']);
    //       return false;
    //     });
    //   }
    
}
