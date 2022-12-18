import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, ResultType } from 'src/app/interfaces/auth-interfaces';
import { AssistedLiving } from 'src/app/interfaces/common-interface';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-assisted-livings',
  templateUrl: './assisted-livings.component.html',
  styleUrls: ['./assisted-livings.component.scss'],
})
export class AssistedLivingsComponent implements OnInit {
  assistedLiving: any;
  // p: any = 1;
  // count: any;
  mode: string = 'Add';
  assistedLivingForm: any;
  userId: string;
  ImageToUpload: any;
  baseUrl: any = environment.apiUrl;
  userImage: any;
  // starting: number = 1;
  // last: number = 1;
  // filter: string = '';
  userStatus: any = [
    {value: 1, name: 'Active'},
    {value: 0, name: 'Inactive'}
  ];
  defaultStatus: any = '';

  displayedColumns: string[] = ['name', 'email', 'contact', 'location', 'status', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any;

  constructor(
    private commonServ: CommonService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  @ViewChild('assistedLivingDialog', { static: true }) assistedLivingDialog: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.getAssistedLivings();
  }

  initializeAssistedLivingForm(): void {
    this.assistedLivingForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      image: ['', []],
      geo_location: [false, []],
      role: ['assisted_living'],
    });
  }

  get formControls(): any {
    return this.assistedLivingForm.controls;
  }

  getAssistedLivings() {
    try{
      // this.assistedLiving = [];
      // // let data1 = {
      // //   p: this.p,
      // //   filter: this.filter,
      // // };
      // this.starting = this.last = this.count = 0;
      const data: any = {status: this.defaultStatus};
      this.commonServ.getAssistedLiving(data).subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.docs.map((el) => {
            if (el.image && el.image != "null") {
              el.image = this.baseUrl + el.image;
            }
          });
          // this.assistedLiving = new MatTableDataSource(res.data.docs);
          // this.count = res.data.totalDocs;
          // this.updateShowingResults();
          
          this.dataSource = new MatTableDataSource(res.data.docs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } catch(ex){
      console.log('Still loading');
    }
  }

  filterByStatus(event: any){
    this.defaultStatus = event.target.value;
    this.getAssistedLivings();
  }

  // pageChange(data: any) {
  //   this.p = data;
  //   this.getAssistedLivings();
  // }

  addAssistedLiving() {
    this.mode = 'Add';
    this.initializeAssistedLivingForm();
    this.removeProfilePic();
    this.dialog.open(this.assistedLivingDialog);
  }

  submitAssistedLiving() {
    const formData: AssistedLiving = this.assistedLivingForm.value;
    if(this.assistedLivingForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('geo_location', formData.geo_location);
    formValues.append('image', this.ImageToUpload);
    formValues.append('role', formData.role);
    formValues.append('location', formData.location);
    formValues.append('contact', formData.contact);

    this.commonServ.addAssistedLiving(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAssistedLivings();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  openDeleteDialog(id: string) {
    this.userId = id;
    this.dialog.open(this.deleteDialog);
  }

  confirmDelete() {
    const data = {
      _id: this.userId,
    };
    this.commonServ.delete(data).subscribe((res: ApiResponse) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        // if(this.p != 1 && (((this.count) - 1) % 10) == 0){
        //   this.p = this.p - 1;
        // }
        this.getAssistedLivings();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  openEditDialog(id: string) {
    this.mode = 'Edit';
    this.removeProfilePic();
    this.userId = id;
    this.initializeAssistedLivingForm();
    this.commonServ.get(id).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS) {
        const userData = res.data;
        this.assistedLivingForm.patchValue({
          name: userData.name,
          email: userData.email,
          location: userData.location,
          contact: userData.contact,
          geo_location: userData.geo_location,
          image: '',
          role: 'nursing_home',
        });
        if(userData.image != undefined && userData.image != "null"){
          this.userImage = this.baseUrl + userData.image;
        }
        this.dialog.open(this.assistedLivingDialog);
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  updateAssistedLiving() {
    const formData: AssistedLiving = this.assistedLivingForm.value;
    if(this.assistedLivingForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('geo_location', formData.geo_location);
    formValues.append('role', formData.role);
    formValues.append('location', formData.location);
    formValues.append('contact', formData.contact);
    formValues.append('_id', this.userId);
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    } else {
      formValues.append('image', null);
    }

    this.commonServ.updateAssistedLivings(formValues).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAssistedLivings();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  geoLocation(event) {
    let dataToPass = {
      geo_location: event.checked,
    };
  }

  openFileSelector(){
    let element: HTMLElement = document.getElementsByClassName('file-upload')[0] as HTMLElement;
    element.click();
  }

  fileChange(event: any){
    const file = event.target.files[0];
    this.ImageToUpload = file;
    if (event.target.files && file) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this.userImage = event.target.result;
      }
      reader.readAsDataURL(file);
    }
  }

  updateGeoLocation(id: string, geo_location: boolean) {
    let geoLocation: Boolean = true;
    if (geo_location) {
      geoLocation = false;
    }
    const data = {
      _id: id,
      geo_location: geoLocation,
    };
    this.commonServ.updateGeoLocation(data).subscribe((res: ApiResponse) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.getAssistedLivings();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  applyFilter(filterValue: any){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

  removeProfilePic(){
    this.userImage = this.ImageToUpload = null;
  }

  // updateShowingResults(){
  //   this.starting = (this.p == 1)? 1 : (((this.p - 1) * 10) + 1);
  //   this.last = (this.p == 1 && (this.count < this.p * 10))? this.count : ((this.count == (this.p * 10)))? this.count: ((this.p * 10) > this.count)? this.count: (this.p * 10);
  // }

  activeDeactive(event, userObj) {
    console.log(event, "ee")
    let obj = {
     _id: userObj._id,
      status: event.checked,
    };
    console.log("checkobj", obj);
    this.commonServ.updateStatus(obj).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message, "", {
          timeOut: 1000,
        });
        this.getAssistedLivings();
      } else {
      }
    });
  }
}