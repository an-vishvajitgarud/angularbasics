import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  loadStoredData() {
    const savedData = localStorage.getItem('storedData');
    if (savedData) {
      this.storedData = JSON.parse(savedData);
      console.log(this.storedData)
    }
  }

  //delete data
  deleteRecord(index: number) {
    this.storedData.splice(index, 1);
    localStorage.setItem('storedData', JSON.stringify(this.storedData));
  }
  //edit data
  editRecord(index:number){
    this.router.navigate(['/form-task', index]);
  }

}
