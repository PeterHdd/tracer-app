import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from 'src/app/model/country';


@Injectable({
  providedIn: 'root'
})
export class SampleDataService {

  constructor(private http: HttpClient) { }

  getCountryCode(): Observable<Country[]>{
    return this.http.get<Country[]>('assets/data/countrycode.json');
  }
}
