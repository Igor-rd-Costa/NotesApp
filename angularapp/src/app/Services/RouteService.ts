import { Injectable } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";


@Injectable()
export class RouteService {
    static currentRoute : string = "";
    static lastRoute : string = "";

    constructor(private router : Router) {

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                RouteService.lastRoute = RouteService.currentRoute;
                RouteService.currentRoute = event.url;
            }
        })
    }

    static GetRoute() : string {
        return RouteService.currentRoute;
    }

    static GetLastRoute() : string {
        return RouteService.lastRoute;
    }
}