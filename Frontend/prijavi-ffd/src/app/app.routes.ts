import { Routes } from '@angular/router';
import { GetStarted } from '../start/get-started/get-started';
import { Login } from '../start/login/login';
import { Register } from '../start/register/register';

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
    }
]
