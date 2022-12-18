import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {

  nursingHomeId: string;
  mode: string;
  userId: string;
  otherForm: any;
  userImage: any;
  ImageToUpload: any;
  displayedColumns: string[] = ['name', 'email', 'contact', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any = 10;
  baseUrl: string;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private commonServ: CommonService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) { }

  @ViewChild('otherDialog', { static: true }) otherDialog: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.baseUrl = this.commonServ.baseURL;
    this.nursingHomeId = this.authService.getLoggedInUserId();
    this.getOthers();
  }

  getOthers(){
    try{
      let data1 = {
        nursing_home_id: this.nursingHomeId
      };
      this.dataSource = new MatTableDataSource<any[]>();
      this.commonServ.getAllOthers(data1).subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.docs.map((el)=>{
            if (el.image && el.image != "null") {
              el.image =this.baseUrl +  el.image;
            }
          });
          this.dataSource = new MatTableDataSource(res.data.docs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } catch (ex) {
      console.log('Still loading');
    }
  }

  initializePhysicianForm(): void {
    this.otherForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      image: ['', []],
      role: ['others', [Validators.required]]
    });
  }

  get formControls(): any {
    return this.otherForm.controls;
  }

  addOther(){
    this.mode = "Add";
    this.initializePhysicianForm();
    this.removeProfilePic();
    this.dialog.open(this.otherDialog);
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

  closeDialog(){
    this.dialog.closeAll();
  }

  submitOther(){
    const formData: any = this.otherForm.value;
    if(this.otherForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('image', this.ImageToUpload);
    formValues.append('role', formData.role);
    formValues.append('contact', formData.contact);
    formValues.append("nursing_home_id", JSON.stringify({_id:this.nursingHomeId}));

    this.commonServ.addPhysician(formValues).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getOthers();
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
    this.commonServ.deletePhysician(data).subscribe((res: any) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getOthers();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  openEditDialog(id: string) {
    this.mode = "Edit";
    this.removeProfilePic();
    this.userId = id;
    this.initializePhysicianForm();
    this.commonServ.getPhysician(id).subscribe((res: any) => {
      if(res.messageID == ResultType.SUCCESS) {
        const userData = res.data;
        this.otherForm.patchValue({
          name: userData.name,
          email: userData.email,
          contact: userData.contact,
          image: "",
          role: 'others'
        });
        if(userData.image != undefined && userData.image != "null"){
          this.userImage = this.baseUrl + userData.image;
        }
        this.dialog.open(this.otherDialog);
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  updateOther() {
    const formData: any = this.otherForm.value;
    if(this.otherForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('role', formData.role);
    formValues.append('contact', formData.contact);
    formValues.append("nursing_home_id", JSON.stringify({_id:this.nursingHomeId}));
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    }
    formValues.append("_id", this.userId);
    
    this.commonServ.updatePhysician(formValues).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success('User updated successfully.');
        this.dialog.closeAll();
        this.getOthers();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  applyFilter(filterValue: any){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

}
