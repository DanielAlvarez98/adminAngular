import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';

@NgModule({
  declarations: [
    CategoriesComponent,
    CreateCategoryComponent,
    EditCategoryComponent,
    DeleteCategoryComponent,
    ListCategoryComponent,
    
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule
  ],
})
export class CategoriesModule{}
