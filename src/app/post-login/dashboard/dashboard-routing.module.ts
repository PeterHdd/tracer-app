import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'addperson',
        loadChildren: () => import('../add-person/add-person.module').then(m => m.AddPersonPageModule)
      },
      {
        path: 'userlist',
        loadChildren: () => import('../userlist/userlist.module').then(m => m.UserlistPageModule)
      },
      {
        path: '',
        redirectTo: '/dashboard/addperson',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard/addperson',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
