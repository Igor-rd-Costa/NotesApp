import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {

    constructor(private http : HttpClient) {}

    Login(username : string, password : string) : Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.http.post("https://localhost:7216/auth/login/", { Username: username, Password: password}, { withCredentials: true}).subscribe({
                next: () => { resolve(true); },
                error: () => { resolve(false); }
            })
        });
    }

    Logout() : Observable<boolean> {
        return this.http.post<boolean>("https://localhost:7216/auth/logout/", {}, {withCredentials: true});
    }

    Register(username : string, email : string, password : string) {
            return this.http.post<boolean>("https://localhost:7216/auth/register/", {username, email, password}, { withCredentials: true});
    }

    IsLogged() : Observable<boolean> {
        return this.http.get<boolean>("https://localhost:7216/auth/islogged/", {withCredentials: true});
    }

    GetUsername() : Observable<string> {
        return this.http.get("https://localhost:7216/auth/username/", {withCredentials: true, responseType: 'text'});
    }
}