import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class EmployeeService {

  Employees;
  postToDB: boolean = false;
  Arr;

  constructor(
    private db: AngularFireDatabase,
    private fmService: FlashMessagesService
    ) { 
    this.db.list('/Users')
      .subscribe(emp => {
        this.Employees = emp;
      });
  }

  assignToEmployee(dept: string, compID: string, complaint) {
    console.log("1");
    console.log(dept);
    console.log(compID);
    var filteredEmployees = this.filterEmployees(dept);
    console.log(filteredEmployees);
    var minWorkEmpID = this.findMinWorkEmpID(filteredEmployees);
    console.log("Min Work EmpID");
    console.log(minWorkEmpID);
    this.db.object('/Users/' + minWorkEmpID)
      .subscribe(data => {
      if (!this.postToDB) {
        console.log("##########");
        console.log("Data")
        console.log(data);
        let tempWorks = [];
        if (data.hasOwnProperty('assignedWorks')) {
          tempWorks = data.assignedWorks;
        }
        this.Arr = tempWorks;
        this.Arr.push({
          complaint: complaint,
          complaintKey: complaint.$key,
          status: "assigned",
          timestamp: new Date().getTime()
        });
        this.postToDB = true;
      }
      
    });
    while (!this.postToDB) {}
    this.db.list('/Users').
    update(minWorkEmpID, { assignedWorks: this.Arr })
    .then(data => {
      console.log("Emp doc updated");
      this.db.list('/twittercomplaints')
        .update(compID, { assignedTo: minWorkEmpID, status: "assigned" })
          .then(data => {
            console.log("Complaint doc updated");
            this.postToDB = false;
            this.fmService.show(
              "The work for this complaint has been assigned to an employee",
              { cssClass: 'flashMessage flash-success', timeout: 5000 });
          })
          .catch(err => {
            console.log("Err updating complaint doc");
          });
    })
    .catch(err => {
      console.log("Err updating emp doc");
    });
  }

  filterEmployees(dept: string) {
    console.log("2");
    var result = [];
    console.log("Total Employees");
    console.log(this.Employees);
    for(let i = 0; i < this.Employees.length; i++) {
      if (this.Employees[i].worksIn.toLowerCase() == dept.replace(/\s/g, "").replace('Dept', "").toLowerCase() && this.Employees[i].role == 'employee') {
        result.push(this.Employees[i]);
        console.log("An emp detected: " + this.Employees[i].$key);
      }
    }
    return result;
  }

  findMinWorkEmpID(emps: any[]) {
    console.log("3");
    console.log(emps);
    let id = '';
    let minWork = 10000000000000000;
    for(let i = 0; i < emps.length; i++) {
      let tempWork = 0;
      if (emps[i].hasOwnProperty('assignedWorks')) {
        tempWork = emps[i].assignedWorks.length;
      }
      if (tempWork <= minWork) {
        id = emps[i].$key;
        console.log("Detected a min: " + id);
        minWork = tempWork;
      }
    }
    console.log("4");
    return id;
  }

}
