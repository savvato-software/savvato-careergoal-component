import { Injectable } from '@angular/core';
import { ApiService } from 'savvato-javascript-services'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  environment = undefined;

  constructor(private _apiService: ApiService) {

  }

  _init(env) {
  	this.environment = env;
  }

  createNewUser(name, phone, email, password) {
  	let url = this.environment.apiUrl + "/api/user/new";
  	let data = "name=" + name;

  	if (phone) {
  		data += "&phone=" + phone;
  	}

  	if (email) {
  		data += "&email=" + email;
  	}

  	if (password) {
  		data += "&password=" + password;
  	}

	let rtn = new Promise(
		(resolve, reject) => {
			this._apiService.postUnsecuredAPI(url, data).subscribe(
				(data) => { 
					console.log("New Account Saved!");
					console.log(data);

					resolve(data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;
  }

  markUserAsAttending(userId) {
  	let url = this.environment.apiUrl + "/api/user/" + userId + "/markInAttendance";

  	let data = "userId=" + userId;

	let rtn = new Promise(
		(resolve, reject) => {
			this._apiService.postUnsecuredAPI(url, data).subscribe(
				(data) => { 
					console.log("User " + userId + " marked in attendance!");
					console.log(data);

					resolve(data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;
  }

  getUserByEmailOrPhone(query) {
  	let url = this.environment.apiUrl + "/api/user?q=" + query;

	let rtn = new Promise(
		(resolve, reject) => {
			this._apiService.getUnsecuredAPI(url).subscribe(
				(data) => { 
					console.log("User query call returned");
					console.log(data);

					resolve(data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;
  }

  getUserById(id) {
  	let url = this.environment.apiUrl + "/api/user/" + id;

	let rtn = new Promise(
		(resolve, reject) => {
			this._apiService.getUnsecuredAPI(url).subscribe(
				(data) => { 
					console.log("User by id call returned");
					console.log(data);

					resolve(data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;

  }

}
