import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-display',
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {
  storedData?:any;

  ngOnInit(){
    this.loadStoredData();
  }

  constructor(private router: Router,private companyService: ServiceService) {}

  loadStoredData() {
    this.companyService.getData().subscribe(response => {
      this.storedData = response;
      console.log("received Data =>>>", this.storedData);
    });
  }

  //delete data
  deleteRecord(id: number) {
    // console.log("id",id)
    this.companyService.deleteData(id).subscribe(response => {
      // alert("Record deleted successfully!");
      console.log("deleted response",response)
      this.loadStoredData();
    });
  }


  //edit data
  editRecord(id: number) {
    this.router.navigate(['/form-task', id]);
  }

}
