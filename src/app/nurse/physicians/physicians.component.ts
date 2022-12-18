import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.scss']
})
export class PhysiciansComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contact', 'location', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any;
  baseUrl: any = environment.apiUrl;

  constructor(
    private commonServ: CommonService
  ) { }

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.getPhysicians();
  }

  getPhysicians(){
    try{
      this.dataSource = new MatTableDataSource<any[]>();
      let nursingID = JSON.parse(localStorage.getItem('nursingID'));

      
      let data1 = {
        nursing_home_id: nursingID[0]._id,
      };
      this.commonServ.getAllPhysicians(data1).subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.docs.map((el) => {
            if (el.image && el.image != "null") {
              el.image = this.baseUrl + el.image;
            }
          });
          this.dataSource = new MatTableDataSource(res.data.docs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } catch(ex) {
      console.log('Still loading');
    }
  }

  applyFilter(filterValue: any){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

}
