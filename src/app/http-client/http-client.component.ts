import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-http-client',
  imports: [],
  templateUrl: './http-client.component.html',
  styleUrl: './http-client.component.css'
})
export class HttpClientComponent implements OnInit{

  users:any[] =[];
  receivedData?:any;
  updatedData?:any;

  data = {
    "name": "Apple MacBook Pro 16",
    "data": {
       "year": 2019,
       "price": 2049.99,
       "CPU model": "Intel Core i9",
       "Hard disk size": "1 TB",
       "color": "silver"
    }
 }
 

  constructor(private userService: ServiceService) { }

  ngOnInit() {
    this.getUsers();
    this.sendData();
    this.updateData();
    // this.deleteData();
  }

  //Get Method 
  getUsers(){
    this.userService.getData().subscribe((data:any) => {
      this.users = data;
      console.log("getData",data);
    });
  }

  // Post Method
  sendData(){
    try {
      this.userService.postData(this.data).subscribe((data:any) => {
        this.receivedData = data;
        console.log("receivedData" , this.receivedData )
      })
      
    } catch (error) {
      console.log(error);
    }

  }

  // Put Method 
  updateData(){
    this.userService.putData(this.data).subscribe((data:any) => {
      this.updatedData = data;
      console.log("updatedData" , this.updatedData );
    })
  }

  //Delete Data 
  deleteData(){
    this.userService.deleteData(this.updatedData.id).subscribe((data:any) =>{
      console.log("deletedData" , data);
    })
  }

}
