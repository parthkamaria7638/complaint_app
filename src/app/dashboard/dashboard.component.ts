import { AuthServiceService } from './../auth-service.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit  } from '@angular/core';
import { style, animate, trigger, transition } from '@angular/animations';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000)
      ])
    ]),
    trigger('fadeOut', [
      transition('* => void', [
        style({ opacity: 1 }),
        animate(1000, style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class DashboardComponent implements OnInit {

  user = null;
  showSpinner = true;
  countRTO = 0;
  countSanitation = 0;
  countWater = 0;
  countRoad = 0;
  doughnutChartData = [0, 0, 0, 0];
  doughnutChartDataPlatform = [0, 0, 0, 0 ];
  lineAreaChartData = [0, 0, 0, 0];
  cntTwitter = 0;
  cntFacebook = 0;
  cntReddit = 0;
  cntGuest = 0;
  complaints;
  users;
  rtoEmps = 0;
  sanEmps = 0;
  watEmps = 0;
  rodEmps = 0;
  userComplaints;
  currTime: number = new Date().getTime();
  flag = 0;
  select;
  compType;
  assignedComp = 0;
  ongoingComp = 0;
  completedComp = 0;
  totalComplaints = 0;

  
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthServiceService
    ) {
      this.authService.appUser$
      .subscribe(user => {
          this.user = user;
          this.flag = 1;
          this.showSpinner = false;
          this.userComplaints = this.user.assignedWorks;
          // this.showSpinner = false;
        });  

        this.db.list('/Users')
          .subscribe(data => {
            this.rtoEmps = 0;
            this.sanEmps = 0;
            this.watEmps = 0;
            this.rodEmps = 0;
            for(let i = 0; i < data.length; i++) {
              if (data[i].role != "employee") {
                continue;
              }

              if(data[i].worksIn.toLowerCase().search('rto')>-1) 
                {
                  this.rtoEmps++;
                  // console.log('here')
                }
              else if(data[i].worksIn.toLowerCase().search('sanitation') > -1 ) 
              this.sanEmps++;
              else if(data[i].worksIn.toLowerCase().search('water') > -1) 
              this.watEmps++;
              else if(data[i].worksIn.toLowerCase().search('road') > -1) 
              this.rodEmps++;
              this.lineAreaChartData = [this.sanEmps, this.rtoEmps, this.watEmps, this.rodEmps];
              // this.showSpinner = false;
            }
          });

        this.db.list('/twittercomplaints')
        .subscribe(data => {
        this.totalComplaints = data.length;
         this.complaints = data;
         this.countRTO = 0;
         this.countSanitation = 0;
         this.countWater = 0;
         this.countRoad = 0;
         this.ongoingComp = 0;
         this.completedComp = 0;
         this.assignedComp = 0;
        
        for(let i = 0; i < this.complaints.length;i++) {
          if(this.complaints[i].approved=='false')
          {  
             continue;
          }
          console.log(this.complaints[i]);
          if(this.complaints[i].Type.toLowerCase().search('rto')>-1) 
            {this.countRTO++;
            }
          else if(this.complaints[i].Type.toLowerCase().search('sanitation') > -1 ) 
          this.countSanitation++;
          else if(this.complaints[i].Type.toLowerCase().search('water') > -1) 
          this.countWater++;
          else if(this.complaints[i].Type.toLowerCase().search('road') > -1) 
          this.countRoad++;

          if (this.complaints[i].platform == "Twitter")
            this.cntTwitter++;
          else if(this.complaints[i].platform == 'Facebook')
            this.cntFacebook++;
          else if(this.complaints[i].platform == 'Reddit')
            this.cntReddit++;
          else if(this.complaints[i].platform == 'Guest')
            this.cntGuest++;

            if (!this.complaints[i].hasOwnProperty('status')) {
              continue;
            }
            else if (this.complaints[i].status == "inProgress") {
              this.ongoingComp++;
            }
            else if (this.complaints[i].status == 'completed') {
              this.completedComp++;
            }

            else if (this.complaints[i].status == 'assigned') {
              this.assignedComp++;
            }
            
        }

        
        // console.log(this.countRTO);
        // console.log(this.countSanitation);
        // console.log(this.countRoad);
        // console.log(this.countWater);
        this.doughnutChartData = [this.countRTO,this.countSanitation,this.countWater,this.countRoad];
        this.doughnutChartDataPlatform = [this.cntTwitter,this.cntReddit,this.cntFacebook,this.cntGuest];
        // this.showSpinner = false;
        // console.log(data);
      });
   }

  public doughnutChartLabels = ['RTO','Sanitation','Water','Road'];
  public doughnutChartType = 'doughnut';
  public doughnutChartColors = [{backgroundColor: ["#ffa600", "#58508d", "#bc5090", "#ff6361"]}]
  public doughnutChartOptions = {
    title: {
      text: "Distribution of number of complaints based on different types",
      display: true
    }
  }

  public lineAreaChartLabels = ['Sanitation Employees','RTO Employees','Water Employees','Road Employees']
  public lineAreaChartType = 'bar';
  public lineAreaChartColors = [{backgroundColor: ["#ffa600", "#58508d", "#bc5090", "#ff6361"]}]
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      text: "Distribution of number of employees working in different dept.",
      display: true
    },
    scales: {
      yAxes: [{ticks: {beginAtZero: true}}]
    }
  };

  public doughnutChartLabelsPlatform = ['Twitter','Reddit','Facebook','Guest'];
  public doughnutChartTypePlatform = 'doughnut';
  public doughnutChartColorsPlatform = [{backgroundColor: ["#38A1F3", "#FF4301", "#3C5A99", "grey"]}]
  public doughnutChartOptionsPlatform = {
    title: {
      text: "Distribution of number of complaints based on different platforms",
      display: true
    }
  };


  changeStatus(work, i) {
    console.log(work);
    console.log(i);
    console.log(this.select);
    let statusIsComplete = false;
    let compID = work.complaintKey;
    let status;
    if (this.select == 'In Progress') {
      status = 'inProgress';
    }
    else if (this.select == 'Completed') {
      status = 'completed';
      statusIsComplete = true;
    }
    if (statusIsComplete) {
      let compArr = [];
      let flag = 0;
      this.db.object('/Users/' + this.user.$key)
      .take(1)
      .subscribe(data => {
        compArr = data.assignedWorks;
        for(let i = 0; i < compArr.length; i++) {
          if (compArr[i].complaintKey == compID) {
            compArr.splice(i, 1);
          }
        }
        flag = 1;
      });
      while(!flag) {}
      this.db.object('/Users/' + this.user.$key)
        .update({ assignedWorks: compArr })
          .then(data => {
            console.log("Success");
            this.db.object('/twittercomplaints/' + compID)
              .update({ status: status })
                .then(data => {
                  console.log("Comp updated successfully");
                })
                .catch(err => {
                  console.log("err updating comp");
                });
          })
          .catch(err => {
            console.log(err);6
          }); 

    }
    else {
      this.db.object('/Users/' + this.user.$key + '/assignedWorks/' + i)
      .update({ status: status })
        .then(data => {
          console.log("success");
          this.db.object('/twittercomplaints/' + compID)
            .update({ status: status })
              .then(data => {
                console.log("Comp Updated");
              })
              .catch(err => {
                console.log("err updating comp");
              }); 
        })
        .catch(err => {
          console.log("err");
        });
    }
    
  }

  changeComplaintType(work, i) {
    let compID = work.complaintKey;
    let compArr = [];
    let flag = 0;
    this.db.object('/Users/' + this.user.$key)
      .take(1)
      .subscribe(data => {
        compArr = data.assignedWorks;
        for(let i = 0; i < compArr.length; i++) {
          if (compArr[i].complaintKey == compID) {
            compArr.splice(i, 1);
          }
        }
        flag = 1;
      });
      while(!flag) {}
      this.db.object('/Users/' + this.user.$key)
        .update({ assignedWorks: compArr })
          .then(data => {
            console.log("Success");
            this.db.object('/twittercomplaints/' + compID)
              .update({ approved: "false", Type: this.compType, Timestamp: new Date().getTime() })
                .then(data => {
                  console.log("Comp updated successfully");
                })
                .catch(err => {
                  console.log("err updating comp");
                });
          })
          .catch(err => {
            console.log(err);6
          }); 
  }



  ngOnInit() {

  }

}
