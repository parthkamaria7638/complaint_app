import { AngularFireDatabase } from 'angularfire2/database';
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Injectable } from '@angular/core';

@Injectable()
export class CompIDValidator {
    
    constructor(private db: AngularFireDatabase) {
    }


    public notARegID = (control: AbstractControl): Promise<ValidationErrors | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let count = 0;
                this.db.list('/twittercomplaints')
                    .subscribe(users => {
                        for(let i = 0; i < users.length; i++) {
                            if((control.value as string) == users[i].$key) {
                                count++;
                            }
                        }
                        if (count == 0) {
                            resolve({ notARegID: true });
                        }
                        if (count != 0)
                            resolve(null);
                    });
            }, 1000);
        });
    }
}