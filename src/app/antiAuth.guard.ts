import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class AntiAuthGuard implements CanActivate {
    constructor(
        private auth: AuthServiceService, 
        private router: Router,
        private fmService: FlashMessagesService
    ) {}

    async canActivate() {
        let bool = false;
        await this.auth.appUser$.subscribe(appUser => {
            if (appUser) {
                bool = false;
                this.router.navigate(['/']);
                return false;
            } else {
                bool = true;
                return true;
            }
          });

          return bool;

    }
}
