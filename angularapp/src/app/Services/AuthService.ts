import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {

    constructor(private http : HttpClient) {}

    Login(username : string, password : string) {
        return this.http.post("https://localhost:7216/auth/login/", { Username: username, Password: password}, { withCredentials: true});
    }

    Logout() : Observable<boolean> {
        return this.http.post<boolean>("https://localhost:7216/auth/logout/", {}, {withCredentials: true});
    }

    Register(username : string, email : string, password : string) {
            return this.http.post<boolean>("https://localhost:7216/auth/register/", {username, email, password}, { withCredentials: true});
    }

    IsLogged() : Observable<boolean> {
        return this.http.get<boolean>("https://localhost:7216/auth/is-logged/", {withCredentials: true});
    }

    
    GetUsername() : Observable<string> {
        return this.http.get("https://localhost:7216/auth/get-username/", {withCredentials: true, responseType: 'text'});
    }

    GetEmail() {
        return this.http.get("https://localhost:7216/auth/get-email/", {withCredentials: true, responseType: 'text'});
    }


    CheckUsername(username : string) {
        return this.http.get("https://localhost:7216/auth/check-username/" + username, {withCredentials: true});
    }

    CheckEmail(email : string) {
        return this.http.get("https://localhost:7216/auth/check-email/" + email, {withCredentials: true});
    }

    CheckPassword(password : string) {
        return this.http.post("https://localhost:7216/auth/check-password/", {password}, {withCredentials: true});
    }


    ChangeUsername(newUsername : string) {
        return this.http.patch("https://localhost:7216/auth/change-username/", {Username: newUsername}, {withCredentials: true});
    }

    ChangeEmail(newEmail : string) {
        return this.http.patch("https://localhost:7216/auth/change-email/", {Email: newEmail}, {withCredentials: true});
    }

    ChangePassword(oldPassword : string, newPassword : string) {
        return this.http.patch("https://localhost:7216/auth/change-password/", {oldPassword, newPassword}, {withCredentials: true});
    }


    DeleteAccount() {
        return this.http.delete("https://localhost:7216/auth/delete-account/", {withCredentials: true});
    }
}