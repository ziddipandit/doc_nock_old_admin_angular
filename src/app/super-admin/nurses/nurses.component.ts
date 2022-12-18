import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, ResultType } from 'src/app/interfaces/auth-interfaces';
import { NurseInterface } from 'src/app/interfaces/common-interface';
import { CommonService } from 'src/app/services/common.service';
import {environment} from "../../../environments/environment";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-nurses',
  templateUrl: './nurses.component.html',
  styleUrls: ['./nurses.component.scss']
})
export class NursesComponent implements OnInit {

  nursesList: any;
  mode: string = 'Add';
  nurseForm: any;
  userId: string;
  setImage: any;
  baseUrl: any = environment.apiUrl;
  imgUrl: any;
  userImage: any;
  ImageToUpload: any;
  assistedData: any;
  nursingDataList: any;
  queryParam: string = '';
  queryParam1: string = '';
  submitDisabled: boolean = true;
  isNursingHomeDisabled: any = null;
  isAssistedLivingDisabled: any = null;
  displayedColumns: string[] = ['name', 'email', 'contact', 'location', 'nursing_homes', 'assisted_livings', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any = 10;

  constructor(
    private commonServ: CommonService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  @ViewChild('nursesDialog', { static: true }) nursesDialog: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.getNursingHomeIdParam();
    this.getAllNurses();

    this.commonServ.getAssistLive().subscribe((res: any) => {
      this.assistedData = res.data;
    });

    this.commonServ.getursingHomelist().subscribe((res:any)=>{
      this.nursingDataList = res.data;
    });
  }

  getNursingHomeIdParam(){
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.queryParam = params.get('nursing_home_id');
      this.queryParam1 = params.get('assissted_living_id');
    });
  }

  initializeNurseForm(): void {
    this.nurseForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      image: ['', []],
      role: ['nurse', [Validators.required]],
      assissted_living_id: ['', []],
      nursing_home_id: ['', []],
    });
    this.isAssistedLivingDisabled = this.isNursingHomeDisabled = null;
  }

  get formControls(): any {
    return this.nurseForm.controls;
  }

  addNurse(){
    this.mode = "Add";
    this.initializeNurseForm();
    this.removeProfilePic();
    this.dialog.open(this.nursesDialog);
  }

  getAllNurses() {
    try{
      this.nursesList = [];
      let data1 = {
        nursing_home_id: this.queryParam,
        assissted_living_id: this.queryParam1
      };
      this.commonServ.getAllNurses(data1).subscribe((res: any) => {
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

  closeDialog(){
    this.dialog.closeAll();
  }

  submitNurse(){
    // const formData: NurseInterface = this.nurseForm.value;
    if(this.nurseForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    const formValues: any = new FormData();

    formValues.append('name', this.nurseForm.get("name").value);
    formValues.append('email', this.nurseForm.get("email").value);
    formValues.append('image', this.ImageToUpload);
    formValues.append('role', this.nurseForm.get("role").value);
    formValues.append('location', this.nurseForm.get("location").value);
    formValues.append('contact', this.nurseForm.get("contact").value);
     formValues.append("assissted_living_id",JSON.stringify({_id:this.nurseForm.get("assissted_living_id").value}));
     formValues.append("nursing_home_id",JSON.stringify({_id:this.nurseForm.get("nursing_home_id").value}));
    
    this.commonServ.addNurse(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllNurses();
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
        this.getAllNurses();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  openEditDialog(id: string){
    this.mode = "Edit";
    this.userId = id;
    this.initializeNurseForm();
    this.removeProfilePic();
    this.commonServ.getPhysician(id).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS) {
        const userData = res.data;
        this.nurseForm.patchValue({
          name: userData.name,
          email: userData.email,
          location: userData.location,
          contact: userData.contact,
          image: "",
          assissted_living_id: (userData.assissted_living_id.length > 0)?userData.assissted_living_id[0]._id: '',
          nursing_home_id: (userData.nursing_home_id.length > 0)?userData.nursing_home_id[0]._id: '',
          role: 'nurse'
        });
        if(userData.image != undefined && userData.image != "null"){
          this.userImage = this.baseUrl + userData.image;
        }
        this.validateForm();
        this.dialog.open(this.nursesDialog);
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  updateNurseData(){
    const formData: NurseInterface = this.nurseForm.value;
    if(this.nurseForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('role', formData.role);
    formValues.append('location', formData.location);
    formValues.append('contact', formData.contact);
    formValues.append("assissted_living_id",JSON.stringify({_id:this.nurseForm.get("assissted_living_id").value}));
     formValues.append("nursing_home_id",JSON.stringify({_id:this.nurseForm.get("nursing_home_id").value}));
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    } else {
      formValues.append('image', null);
    }
    formValues.append("_id", this.userId);

    this.commonServ.updateNurse(formValues).subscribe((res: any) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllNurses();
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

  validateForm(){
    this.submitDisabled = true;
    const isFormValid = this.nurseForm.valid;
    const formValues = this.nurseForm.value;
    if(!isFormValid && (formValues.assissted_living_id == '' && formValues.nursing_home_id == '')){
      this.submitDisabled = true;
    }
    if(formValues.assissted_living_id == '' && formValues.nursing_home_id == ''){
      this.submitDisabled = true;
      this.isAssistedLivingDisabled = this.isNursingHomeDisabled = null;
    }
    if(isFormValid && formValues.assissted_living_id != ''){
      this.isNursingHomeDisabled = true;
      this.submitDisabled = false;
    }
    if(isFormValid && formValues.nursing_home_id != ''){
      this.isAssistedLivingDisabled = true;
      this.submitDisabled = false;
    }
    if(!isFormValid && formValues.assissted_living_id != ''){
      this.submitDisabled = this.isNursingHomeDisabled = true;
    }
    if(!isFormValid && formValues.nursing_home_id != ''){
      this.submitDisabled = this.isAssistedLivingDisabled = true;
    }
  }

  applyFilter(filterValue: any){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

  mapNames(data: any){
    return (data.length > 0)? data[0].name : 'NA';
  }
}