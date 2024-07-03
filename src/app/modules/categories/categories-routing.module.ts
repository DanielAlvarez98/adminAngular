import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children:[
      {
        path: 'register',
        component: CreateCategoryComponent,
      },{
        path: 'list/edit/:id',
        component: EditCategoryComponent,
      },
      {
        path: 'list',
        component: ListCategoryComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
