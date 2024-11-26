// src/app/shared/angular.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const angularModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
];

@NgModule({
  imports: angularModules,
  exports: angularModules
})
export class AngularModule { }

