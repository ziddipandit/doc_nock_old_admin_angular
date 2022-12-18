import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  baseUrl: any = environment.apiUrl;
  displayedNursesColumns: string[] = ['name', 'email', 'contact'];
  nursesDataSource = new MatTableDataSource<any[]>();
  displayedNursingHomeColumns: string[] = ['name', 'location'];
  nursingHomesDataSource = new MatTableDataSource<any[]>();

  constructor(
    private commonServ: CommonService
  ) { }

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit(): void {
    this.getDashboardData();
  }

  getDashboardData(){
    this.commonServ.associatedNursingHomes().subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        res.data.map((el) => {
          if (el.image && el.image != "null") {
            el.image = this.baseUrl + el.image;
          }
        });
        this.nursingHomesDataSource = new MatTableDataSource(res.data);
        this.nursingHomesDataSource.sort = this.sort;
      }
    });
    this.commonServ.associatedNures().subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        res.data.map((el) => {
          if (el.image && el.image != "null") {
            el.image = this.baseUrl + el.image;
          }
        });
        this.nursesDataSource = new MatTableDataSource(res.data);
        this.nursesDataSource.sort = this.sort;
      }
    });
  }

}
