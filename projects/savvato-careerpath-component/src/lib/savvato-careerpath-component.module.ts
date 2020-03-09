import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SavvatoCareerpathComponentComponent } from './savvato-careerpath-component.component';



@NgModule({
  declarations: [SavvatoCareerpathComponentComponent],
  imports: [
  	IonicModule.forRoot(),
  	CommonModule,
  	HttpClientModule,
  	FormsModule

  ],
  exports: [SavvatoCareerpathComponentComponent]
})
export class SavvatoCareerpathComponentModule { }
