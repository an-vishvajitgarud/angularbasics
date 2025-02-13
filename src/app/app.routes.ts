import { Routes } from '@angular/router';
import { FormTaskComponent } from './form-task/form-task.component';
import { DisplayComponent } from './display/display.component';
import { HttpClientComponent } from './http-client/http-client.component';

export const routes: Routes = [
    {
        path: '',
       redirectTo :'/form-task',
       pathMatch: 'full'
    },

    { 
        path: 'form-task/:index',
         component: FormTaskComponent 
    },

    {
        path: 'form-task',
        component: FormTaskComponent
    },
    
    {
        path: 'display',
        component: DisplayComponent,
    },
    {
        path: 'http_client',
        component: HttpClientComponent
    },
];
