// src/app/shared/index.module.ts
import { NgModule } from '@angular/core';
import { AngularModule } from './angular.module';
import { SpartanModule } from './spartan.module';

@NgModule({
  imports: [
    AngularModule,
    SpartanModule
  ],
  exports: [
    AngularModule,
    SpartanModule
  ]
})
export class SharedModule { }
