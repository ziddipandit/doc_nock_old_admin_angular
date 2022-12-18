import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nurses',
  templateUrl: './nurses.component.html',
  styleUrls: ['./nurses.component.scss']
})
export class NursesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'location', 'contact'];
  dataSource = new MatTableDataSource<any[]>();
  length: any;
  baseUrl: any = environment.apiUrl;

  constructor(
    private commonServ: CommonService
  ) { }

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.getNurses();
  }

  

  getNurses(){
    try{
      this.dataSource = new MatTableDataSource<any[]>();
      this.commonServ.associatedNures().subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.map((el) => {
            if (el.image && el.image != "null") {
              el.image = this.baseUrl + el.image;
            }
          });
          this.dataSource = new MatTableDataSource(res.data);
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
