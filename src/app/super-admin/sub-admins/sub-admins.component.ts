import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-sub-admins',
  templateUrl: './sub-admins.component.html',
  styleUrls: ['./sub-admins.component.scss'],
})
export class SubAdminsComponent implements OnInit {

  subadminForm: any;
  mode: string;
  userImage: any;
  ImageToUpload: any;
  imageUrl: any;
  baseUrl: any = environment.apiUrl;
  newImage: any;
  userId: string;
  imgUrl: any;
  setImage: any;
  displayedColumns: string[] = ['name', 'email', 'contact', 'location', 'status', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any;

  constructor(
    private dialog: MatDialog,
    private commonServ: CommonService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  @ViewChild('subadminDialog', { static: true }) subadminDialog: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.getAllSubadmins();
  }

  getAllSubadmins() {
    try {
      this.commonServ.getAllSubadmin().subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.docs.map((el) => {
            if (el.image && el.image != 'null') {
              el.image = this.baseUrl + el.image;
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




  initializeSubadminForm(): void {
    this.subadminForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required]],
      contact: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      image: ['', []],
      role: ['subadmin', [Validators.required]],
      // assissted_living_id: ['', [Validators.required]],
      // nursing_home_id: ['', [Validators.required]],
    });
  }

  get formControls(): any {
    return this.subadminForm.controls;
  }
  

  submitSubadmin() {
    if (this.subadminForm.invalid) {
      this.toastr.error('Form is invalid');
      return;
    }

    const formValues: any = new FormData();

    formValues.append('name', this.subadminForm.get('name').value);
    formValues.append('email', this.subadminForm.get('email').value);
    formValues.append('image', this.ImageToUpload);
    formValues.append('role', this.subadminForm.get('role').value);
    formValues.append('location', this.subadminForm.get('location').value);
    formValues.append('contact', this.subadminForm.get('contact').value);

    this.commonServ.addSubadmin(formValues).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllSubadmins();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  addSubadmin() {
    this.mode = 'Add';
    this.initializeSubadminForm();
    // this.removeProfilePic();
    this.dialog.open(this.subadminDialog);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  openFileSelector() {
    let element: HTMLElement = document.getElementsByClassName(
      'file-upload'
    )[0] as HTMLElement;
    element.click();
  }

  fileChange(event: any) {
    const file = event.target.files[0];
    this.ImageToUpload = file;
    if (event.target.files && file) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.userImage = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePic() {
    this.userImage = this.ImageToUpload = null;
  }
  
  applyFilter(filterValue: any){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

  openEditDialog(id: string) {
    this.mode = 'Edit';
    this.removeProfilePic();
    this.userId = id;
    this.initializeSubadminForm();
    this.commonServ.getPhysician(id).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        const userData = res.data;
        this.subadminForm.patchValue({
          name: userData.name,
          email: userData.email,
          location: userData.location,
          contact: userData.contact,
          image: '',

          role: 'subadmin',
        });
        if (userData.image != undefined && userData.image != 'null') {
          this.userImage = this.baseUrl + userData.image;
        }
        this.dialog.open(this.subadminDialog);
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
    this.commonServ.deleteSubadmin(data).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllSubadmins();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  updateSubadmin() {
   
    if(this.subadminForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    const formValues: any = new FormData();

    formValues.append('name', this.subadminForm.get('name').value);
    formValues.append('email', this.subadminForm.get('email').value);
    formValues.append('role', this.subadminForm.get('role').value);
    formValues.append('location', this.subadminForm.get('location').value);
    formValues.append('contact', this.subadminForm.get('contact').value);
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    } else {
      formValues.append('image', null);
    }
    formValues.append("_id", this.userId);
    
    this.commonServ.updateSubadmin(formValues).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getAllSubadmins();
      } else {
        this.toastr.error(res.message);
      }
    });
  }
}
