import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ServiceService } from '../service.service';

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
  isEditing: boolean = false;
  editingIndex: number | null = null;
  companyId: number | null = null; // Track editing ID

  constructor(
    private route: ActivatedRoute,
    private companyService: ServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const indexParam = params.get('index');
      if (indexParam !== null) {
        const index = +indexParam;
        this.companyId = index;
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
    units: this.fb.array([this.createUnit()])
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

  addUnits() {
    this.units.push(this.createUnit());
  }

  deleteUnit(index: number) {
    this.units.removeAt(index);
  }

  updateTotalSum(index: number) {
    const unit = this.units.at(index);
    const quantity = unit.get('quantity')?.value || 0;
    const unitPrice = unit.get('unitPrice')?.value || 0;
    const totalSum = quantity * unitPrice;
    unit.get('totalSum')?.setValue(totalSum);
  }

  onSubmit() {
    if (this.userform.valid && !this.isEditing) {
      this.companyService.postData(this.userform.value).subscribe(response => {
        alert("Data saved successfully!");
        this.userform.reset();
        this.units.clear();
        this.addUnits();
        this.router.navigate(['/display']);
      });
    }
  }
  
  editRecord(id: number) {
    console.log("id is ------", id);
    this.isEditing = true;

    this.companyService.getData().subscribe({
        next: (response: any) => {
            console.log("data for edit", response);

            // Check if the response is an array
            if (Array.isArray(response)) {
                // Find the company by ID
                const company = response.find((item: any) => item.id === String(id));
                console.log("company data check", company);

                // If the company is found, patch the form
                if (company) {
                    this.patchCompanyData(company);
                } else {
                    console.log(`Company with id ${id} not found.`);
                }
            } else {
                console.log("Unexpected response format", response);
            }
        },
        error: (err) => {
            console.error("Error fetching data", err);
        }
    });
}

// Helper method to patch company data into the form
private patchCompanyData(company: any) {
    this.userform.patchValue({
      companyName: company.company_name,
        address:{country: company.country,
        street: company.street,
        city: company.city,
        zip: company.zip}
    });

    // Clear existing units and add new ones
    this.units.clear();
    company.units.forEach((unit: any) => {
        const unitFormGroup = this.createUnit();
        // unitFormGroup.patchValue(unit);
        unitFormGroup.patchValue({
          unitName: unit.unit_name,
          quantity: unit.quantity,
          unitPrice: unit.unit_price,
          totalSum: unit.total_sum,
        })
        this.units.push(unitFormGroup);
    });
}


  updateRecord() {
    if (this.userform.valid && this.companyId !== null) {
      console.log("checkId***",this.companyId)
      const updatedData = { id: this.companyId, ...this.userform.value };
      this.companyService.putData(updatedData).subscribe(response => {
        alert("Data updated successfully!");
        this.userform.reset();
        this.units.clear();
        this.addUnits();
        this.isEditing = false;
        this.companyId = null;
        this.router.navigate(['/display']);
      });
    }
  }

}
