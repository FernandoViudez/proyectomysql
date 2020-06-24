import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlComponent } from './control.component';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: "",
    component: ControlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [FormsModule,RouterModule,]
})
export class ControlptRoutingModule { }
