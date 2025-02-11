import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-form-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.css']
})
export class FormTaskComponent {

  private fb = inject(FormBuilder);
  storedData: any[] = [];

  // property to track edit state
  isEditing: boolean = false;
  editingIndex: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(){
    this.loadStoredData();
    this.route.paramMap.subscribe(params => {
      const indexParam = params.get('index');
      if (indexParam !== null) {
        const index = +indexParam; // convert string to number
        this.editRecord(index);
      }
    });
  }
  userform = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(3)]],
    address: this.fb.group({
      country: ['', [Validators.required, Validators.minLength(3)]],
      street: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      zip: ['', [Validators.required, Validators.minLength(3)]]
    }),
    units: this.fb.array([this.createUnit()]),
  });

    // Add method to load data from localStorage
    loadStoredData() {
      const savedData = localStorage.getItem('storedData');
      if (savedData) {
        this.storedData = JSON.parse(savedData);
      }
    }

  get units() {
    return this.userform.get('units') as FormArray;
  }

  createUnit(): FormGroup {
    return this.fb.group({
      unitName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(1)]],
      totalSum: [0],
    });
  }

  //add units
  addUnits() {
    this.units.push(this.createUnit());
  }
  //delete units
  deleteUnit(index: number) {
    this.units.removeAt(index);
  }
    
  // total sum
  updateTotalSum(index: number) {
    const unit = this.units.at(index);
    const quantity = unit.get('quantity')?.value || 0;
    const unitPrice = unit.get('unitPrice')?.value || 0;
    const totalSum = quantity * unitPrice;
    unit.get('totalSum')?.setValue(totalSum);
  }

  //submit data 
  onSubmit() {
    if (this.userform.valid && !this.isEditing) {
      alert("data saved");
      this.storedData.push(this.userform.value);
      //store data in local storage
      localStorage.setItem('storedData', JSON.stringify(this.storedData));
      this.userform.reset();
      this.units.clear();
      this.addUnits()
    }
  }

  //delete data
  deleteRecord(index: number) {
    this.storedData.splice(index, 1);
    localStorage.setItem('storedData', JSON.stringify(this.storedData));
  }

  editRecord(index: number) {
    this.isEditing = true;
    this.editingIndex = index;
    // patch value to main content
    this.userform.patchValue(this.storedData[index]);
    //also patch value for the units
    this.units.clear();
    this.storedData[index].units.forEach((unit: any) => {
      this.units.push(this.createUnit());
      this.units.at(this.units.length - 1).patchValue(unit);
    });
  }

  // method for updating
  updateRecord() {
    if (this.userform.valid && this.editingIndex !== null) {
      // Update the record at the editing index
      this.storedData[this.editingIndex] = this.userform.value;
      // Update localStorage
      localStorage.setItem('storedData', JSON.stringify(this.storedData));
      // Reset form and editing state
      this.userform.reset();
      this.units.clear();
      this.addUnits();
      this.isEditing = false;
      this.editingIndex = null;
    }
  }

}
