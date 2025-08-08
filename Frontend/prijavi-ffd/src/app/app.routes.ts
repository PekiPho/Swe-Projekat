import { Routes } from '@angular/router';
import { GetStarted } from '../start/get-started/get-started';
import { Login } from '../start/login/login';
import { Register } from '../start/register/register';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { FollowingPageComponent } from './pages/following-page/following-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';

export const routes: Routes = [
    {
        path:"",
        pathMatch:"full",
        redirectTo:'/get-started'
    },
    {
        path:'get-started',
        component:GetStarted
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'register',
        component:Register
    },
    {
        path:'main-page',
        component:MainPageComponent
    },
    {
        path:'search-page',
        component:SearchPageComponent
    },
    {
        path:'profile-page',
        component:ProfilePageComponent
    },
    {
        path:'map-page',
        component:MapPageComponent
    },
    {
        path:'following-page',
        component: FollowingPageComponent
    },
]
