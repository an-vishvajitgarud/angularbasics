import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:8000/api.php";
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Get Method
  getData(){
    return this.http.get(this.apiUrl, { headers: this.headers });
  }

  // Post Method 
  postData(data:any){
    return this.http.post(this.apiUrl, JSON.stringify(data), { headers: this.headers });
  }

  // Put Method
  // putData(id: any, data: any){
  //   return this.http.put(`${this.apiUrl}/${id}`, data);
  //   }
  putData(data: any){
    return this.http.put(`${this.apiUrl}`, JSON.stringify(data), { headers: this.headers });
    }
    
  // Delete Data
  deleteData(id:number){
    return this.http.delete(`${this.apiUrl}?id=${id}`, { headers: this.headers });   
  }
 

}
