import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { Physician } from 'src/app/interfaces/common-interface';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.scss'],
})
export class PhysiciansComponent implements OnInit {
  
  imageUrl: any;
  baseUrl: any = environment.apiUrl;
  newImage: any;
  mode: string;
  physicianForm: any;
  userId: string;
  imgUrl: any;
  setImage: any;
  assistedData: any;
  nursingDataList: any;
  userImage: any;
  ImageToUpload: any;
  queryParam: string = '';
  queryParam1: string = '';
  displayedColumns: string[] = ['name', 'email', 'contact', 'location', 'nursing_homes', 'assisted_livings', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any;

  constructor(
    private commonServ: CommonService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  @ViewChild('physicianDialog', { static: true }) physicianDialog: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  dropdownList = [];
  dropdownList1 = [];

  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};

  ngOnInit(): void {
    //Get Query Params
    this.getNursingHomeIdParam();
    this.commonServ.getAssistLive().subscribe((res: any) => {
      this.assistedData = res.data;
      this.dropdownList = this.assistedData;
      this.dropdownSettings = {
        idField: '_id',
        textField: 'name',
      };
    });
    this.commonServ.getursingHomelist().subscribe((res:any)=>{
      this.nursingDataList = res.data;
      this.dropdownList1 = this.nursingDataList;
      this.dropdownSettings1 = {
        idField: '_id',
        textField: 'name'  ,
      };
    });
    this.getAllPhysician();
  }

  getNursingHomeIdParam(){
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.queryParam = params.get('nursing_home_id');
      this.queryParam1 = params.get('assissted_living_id');
    });
  }

  getAllPhysician() {
    try{
      let data1 = {
        nursing_home_id: this.queryParam,
        assissted_living_id: this.queryParam1

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

  initializePhysicianForm(): void {
    this.physicianForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      image: ['', []],
      role: ['physician', [Validators.required]],
      assissted_living_id: ['', [Validators.required]],
      nursing_home_id: ['', [Validators.required]],
    });
  }

  get formControls(): any {
    return this.physicianForm.controls;
  }

  addPhysician() {
    this.mode = "Add";
    this.initializePhysicianForm();
    this.removeProfilePic();
    this.dialog.open(this.physicianDialog);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  submitPhysician() {
    const formData: Physician = this.physicianForm.value;
    if(this.physicianForm.invalid){
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
    formValues.append("assissted_living_id", JSON.stringify(formData.assissted_living_id));
    formValues.append("nursing_home_id", JSON.stringify(formData.nursing_home_id));

    this.commonServ.addPhysician(formValues).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllPhysician();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  openDeleteDialog(id: string) {
    this.userId = id;
    this.dialog.open(this.deleteDialog);
  }

  confirmDelete() {
    const data = {
      _id: this.userId,
    };
    this.commonServ.deletePhysician(data).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllPhysician();
      } else {
        this.toastr.error(res.message);
      }
    });
  }


  updatePhysician() {
    const formData: Physician = this.physicianForm.value;
    if(this.physicianForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('role', formData.role);
    formValues.append('location', formData.location);
    formValues.append('contact', formData.contact);
    formValues.append("assissted_living_id", JSON.stringify(formData.assissted_living_id));
    formValues.append("nursing_home_id", JSON.stringify(formData.nursing_home_id));
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    } else {
      formValues.append('image', null);
    }
    formValues.append("_id", this.userId);
    
    this.commonServ.updatePhysician(formValues).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllPhysician();
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
        this.physicianForm.patchValue({
          name: userData.name,
          email: userData.email,
          location: userData.location,
          contact: userData.contact,
          image: "",
          assissted_living_id: userData.assissted_living_id,
          nursing_home_id: userData.nursing_home_id,
          role: 'physician'
        });
        if(userData.image != undefined && userData.image != "null"){
          this.userImage = this.baseUrl + userData.image;
        }
        this.dialog.open(this.physicianDialog);
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

  mapNames(data: any){
    return this.commonServ.mapNames(data);
  }

  
}
