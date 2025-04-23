import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterprisePage } from './enterprise.page';
import { EnterpriseFormComponent } from './enterprise-form/enterprise-form.component';

const routes: Routes = [
  {
    path: '',
    component: EnterprisePage
  },{
    path: 'new',
    component: EnterpriseFormComponent
  },
  {
    path: 'edit/:id',
    component: EnterpriseFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterprisePageRoutingModule {}
