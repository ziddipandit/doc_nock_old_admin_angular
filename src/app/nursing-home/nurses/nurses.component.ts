import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiResponse, ResultType } from 'src/app/interfaces/auth-interfaces';

@Component({
  selector: 'app-nurses',
  templateUrl: './nurses.component.html',
  styleUrls: ['./nurses.component.scss']
})
export class NursesComponent implements OnInit {

  nursingHomeId: string;
  mode: string;
  userId: string;
  nurseForm: any;
  userImage: any;
  ImageToUpload: any;
  displayedColumns: string[] = ['name', 'email', 'contact', 'shift', 'actions'];
  dataSource = new MatTableDataSource<any[]>();
  length: any = 10;
  baseUrl: string;
  weekDay: any = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  errorMessage: string;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private commonServ: CommonService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) { }

  @ViewChild('nursesDialog', { static: true }) nursesDialog: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog: TemplateRef<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.baseUrl = this.commonServ.baseURL;
    this.nursingHomeId = this.authService.getLoggedInUserId();
    this.getNurses();
  }

  getNurses(){
    try{
      let data1 = {
        nursing_home_id: this.nursingHomeId,
      };
      this.dataSource = new MatTableDataSource<any[]>();
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

  initializeNurseForm(): void {
    this.nurseForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      image: ['', []],
      role: ['nurse', [Validators.required]],
      shift: this.fb.array([
      ])
    });
  }

  shifts() {
    return this.nurseForm.get("shift") as FormArray;
  }

  getShiftTiming(index: number) {
    return this.shifts().at(index).get('shiftTime') as FormArray;
  }

  addWeekDayToShift(){
    this.weekDay.map((el: any) => {
      this.shifts().push(this.addNewDay(el));
    });
  }

  addNewDay(el: string): FormGroup {
    return this.fb.group({
      day: [el, []],
      selected: [false, []],
      shiftTime: this.fb.array([
        this.fb.group({
          startTime: ["",[]],
          endTime: ["",[]]
        })
      ])
    });
  }

  additionalTimeSlotFormGroup(): FormGroup{
    return this.fb.group({
      startTime: ["",[]],
      endTime: ["",[]]
    });
  }

  removeAdditionalSlot(index: number): void{
    let slots = this.getShiftTiming(index);
    if(slots.length > 1){
      slots.removeAt(1);
    }
  }

  addAdditionalTimeSlot(index: number){
    this.getShiftTiming(index).push(this.additionalTimeSlotFormGroup());
  }

  get formControls(): any {
    return this.nurseForm.controls;
  }

  addNurse(){
    this.mode = "Add";
    this.initializeNurseForm();
    this.addWeekDayToShift();
    this.removeProfilePic();
    this.dialog.open(this.nursesDialog);
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

  submitNurse(){
    if(this.nurseForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    const isShiftTimeFilled = this.validateShift();
    if(!isShiftTimeFilled){
      this.toastr.error(this.errorMessage);
      return ;
    }
    const formValues: any = new FormData();
    formValues.append('name', this.nurseForm.get("name").value);
    formValues.append('email', this.nurseForm.get("email").value);
    formValues.append('image', this.ImageToUpload);
    formValues.append('role', this.nurseForm.get("role").value);
    formValues.append('contact', this.nurseForm.get("contact").value);
    formValues.append('shift', JSON.stringify(this.nurseForm.get("shift").value));
    formValues.append("nursing_home_id",JSON.stringify({_id: this.nursingHomeId}));
    
    this.commonServ.addNurse(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getNurses();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  validateShift(): boolean{
    let day: string;
    let notFilled = [];
    const shift = this.nurseForm.get("shift").value;
    shift.forEach(element => {
      day = element.day;
      if(element.selected){
        element.shiftTime.forEach(shifts => {
          if(shifts.startTime == "" || shifts.endTime == ""){
            notFilled.push(day.charAt(0).toUpperCase() + day.slice(1));
          }
        });
      }
      if(!element.selected){
        element.shiftTime.forEach(shifts => {
          if(shifts.startTime != "" || shifts.endTime != ""){
            notFilled.push(day.charAt(0).toUpperCase() + day.slice(1));
          }
        });
      }
    });
    if(notFilled.length == 0){
      return true;
    }
    this.errorMessage = `Please fill timings for ${notFilled.join('. ')}`;
    return false;
  }

  updateNurseData(){
    const formData: any = this.nurseForm.value;
    if(this.nurseForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('email', formData.email);
    formValues.append('role', formData.role);
    formValues.append('contact', formData.contact);
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    }
    formValues.append('shift', JSON.stringify(this.nurseForm.get("shift").value));
    formValues.append("_id", this.userId);

    this.commonServ.updateNurse(formValues).subscribe((res: any) => {
      if(res.messageID == ResultType.SUCCESS){
        this.toastr.success(res.message);
        this.dialog.closeAll();
        this.getNurses();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  trackByFn(index: number, item: any) {
    return item.trackingId;
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
          contact: userData.contact,
          image: "",
          role: 'nurse',
        });
        (this.nurseForm.controls["shift"] as FormArray).clear();
        userData.shift.map((element, index) => {
          let control: any = <FormArray>this.nurseForm.controls.shift;
          control.push(
            this.fb.group({
              day: element.day,
              selected: element.selected,
              shiftTime: this.fb.array([])
            })
          );
          let timeSlot = this.getShiftTiming(index);
          element.shiftTime.map((times, i) => {
            timeSlot.push(
              this.fb.group({
                startTime: [times.startTime,[]],
                endTime: [times.endTime,[]]
              })
            );
          });
        });
        if(userData.image != undefined && userData.image != "null"){
          this.userImage = this.baseUrl + userData.image;
        }
        this.dialog.open(this.nursesDialog);
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
        this.getNurses();
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  getShiftTimings(shift: any){
    let selectedDays = [];
    shift.map((element) => {
      if(element.selected){
        let times = [];
        element.shiftTime.map((el) => {
          times.push(el.startTime+ ' - ' +el.endTime);
        });
        selectedDays.push(element.day.charAt(0).toUpperCase() + element.day.slice(1) + ' - ' + times.join(', '));
      }
    });
    return selectedDays.join(', ');
  }

  applyFilter(filterValue: any){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }
}
