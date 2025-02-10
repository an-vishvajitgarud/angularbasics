import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
    if (this.userform.valid) {
      this.storedData.push(this.userform.value);
      this.userform.reset();
      this.units.clear();
      this.addUnits()
    }
  }

  //delete data
  deleteRecord(index: number) {
    this.storedData.splice(index, 1);
    sessionStorage.setItem('formData', JSON.stringify(this.storedData));
  }

  patchValue(index:number){
    const values = this.storedData.at(index);
    this.userform.patchValue({
      companyName: values.companyName,
      address:{
        country: values.address.country,
        street: values.address.street,
        city: values.address.city,
        zip: values.address.zip,
      }
    });
    this.units.clear();
    if (values.units && values.units.length > 0) {
      values.units.forEach((unit: { unitName: string; quantity: number; unitPrice: number; totalSum: number; }) => {
        const unitGroup = this.createUnit();
        unitGroup.patchValue({
          unitName: unit.unitName,
          quantity: unit.quantity,
          unitPrice: unit.unitPrice,
          totalSum: unit.totalSum,
        });
        this.units.push(unitGroup);
      });
    } else {
      // If no units, add a default unit
      this.addUnits();
    }
  }

  

}
