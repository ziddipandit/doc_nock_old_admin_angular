import { DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ResultType, ApiResponse } from 'src/app/interfaces/auth-interfaces';
import { NursingHome } from 'src/app/interfaces/common-interface';
import { CommonService } from 'src/app/services/common.service';
import { NursingHomeService } from 'src/app/services/super-admin/nursing-home.service';
import {environment} from "../../../environments/environment"
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';




@Component({
  selector: 'app-nursing-homes',
  templateUrl: './nursing-homes.component.html',
  styleUrls: ['./nursing-homes.component.scss']
})
export class NursingHomesComponent implements OnInit {

  mode: string ="Add";
  nursingHomeList: any;
  assistedLivingData1: any = [];
  nursingHomeForm: any;
  userId: string;
  baseUrl : any = environment.apiUrl
  setImage: any;
  userImage: any;
  ImageToUpload: any;
  assistLive: any;
  displayedColumns: string[] = ['name', 'email', 'contact', 'location', 'status', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any;
  userStatus: any = [
    {value: 1, name: 'Active'},
    {value: 0, name: 'Inactive'}
  ];
  defaultStatus: any = '';


  constructor(
    private commonServ:CommonService, 
    private toastr:ToastrService, 
    private dialog: MatDialog,
    private fb: FormBuilder,
    private nursingHomeService: NursingHomeService
  ) { }

  @ViewChild('nursingHomeFormDialog', { static: true }) nursingHomeFormDialog: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.getNursingHome();
  }

  initializeNursingHomeForm(): void {
    this.nursingHomeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      image: ['', []],
      role: ['nursing_home', [Validators.required]]
    });
  }

  get formControls(): any {
    return this.nursingHomeForm.controls;
  }

  getNursingHome() {
    try{
      const data: any = {status: this.defaultStatus};
      this.commonServ.getAllNursingHomes(data).subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.docs.map((el)=>{
            if (el.image && el.image != "null") {
              el.image = this.baseUrl+ el.image;
            }
          });
          this.dataSource = new MatTableDataSource(res.data.docs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } catch (ex){
      console.log('Still loading');
    }
  }

  filterByStatus(event: any){
    this.defaultStatus = event.target.value;
    this.getNursingHome();
  }

  addNursingHome(){
    this.mode = "Add";
    this.initializeNursingHomeForm();
    this.removeProfilePic();
    this.dialog.open(this.nursingHomeFormDialog);
  }

  closeDialog(){
    this.dialog.closeAll();
  }

  submitNursingHome(){
    const formData: NursingHome = this.nursingHomeForm.value;
    if(this.nursingHomeForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    
    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('image', this.ImageToUpload);
    formValues.append('role', formData.role);
    formValues.append('location', formData.location);
    formValues.append('contact', formData.contact);

    this.nursingHomeService.add(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getNursingHome();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  openEditDialog(id: string){
    this.mode = "Edit";
    this.removeProfilePic();
    this.userId = id;
    this.initializeNursingHomeForm();
    this.nursingHomeService.get(id).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS) {
        const userData = res.data;
        this.nursingHomeForm.patchValue({
          name: userData.name,
          email: userData.email,
          location: userData.location,
          contact: userData.contact,
          image: "",
          role: 'nursing_home'
        });
        if(userData.image != undefined && userData.image != "null"){
          this.userImage = this.baseUrl + userData.image;
        }
        this.dialog.open(this.nursingHomeFormDialog);
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  openDeleteDialog(id: string){
    this.userId = id;
    this.dialog.open(this.deleteDialog);
  }

  confirmDelete(){
    const data = {
      _id: this.userId
    };
    this.nursingHomeService.delete(data).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getNursingHome();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  updateNursingHome(){
    const formData: NursingHome = this.nursingHomeForm.value;
    if(this.nursingHomeForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    
    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('role', formData.role);
    formValues.append('location', formData.location);
    formValues.append('contact', formData.contact);
    formValues.append('_id', this.userId);
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    } else {
      formValues.append('image', null);
    }
    this.nursingHomeService.update(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getNursingHome();
      } else {
        this.toastr.error(res.message);
      }
    });
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
  
  removeProfilePic(){
    this.userImage = this.ImageToUpload = null;
  }

  applyFilter(filterValue: any){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

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
        this.getNursingHome()
      } else {
      }
    });
  }
}