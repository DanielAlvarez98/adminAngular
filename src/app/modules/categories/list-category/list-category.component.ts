import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCategoryComponent } from '../delete-category/delete-category.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss'],
})
export class ListCategoryComponent implements OnInit {
  categories: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;
  constructor(
    public categoriesService: CategoriesService,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.listCategories();
    this.isLoading$ = this.categoriesService.isLoading$;
  }
  listCategories(page = 1) {
    this.categoriesService.listCategories(page, this.search).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.categories = resp.categories.data;
        this.totalPages = resp.total;
        this.currentPage = page;
      },
    });
  }

  searchTo() {
    this.listCategories();
  }
  loadPage($event: any) {
    this.listCategories($event);
  }

  getDomParser(category: any) {
    var miDiv: any = document.getElementById('svg-category-' + category.id);
    miDiv.innerHTML = category.icon;
    return '';
  }

  deleteCategory(category: any) {
    const modalRef = this.modalService.open(DeleteCategoryComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.category = category;

    modalRef.componentInstance.CategorieD.subscribe((resp: any) => {
      let INDEX = this.categories.findIndex(
        (item: any) => item.id == category.id
      );
      if (INDEX != -1) {
        this.categories.splice(INDEX, 1);
      }
    });
  }
}
