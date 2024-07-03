import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss'],
})
export class DeleteCategoryComponent implements OnInit {
  @Input() category: any;

  @Output() CategorieD: EventEmitter<any> = new EventEmitter();

  isLoading: any;
  constructor(
    public categoryService: CategoriesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.categoryService.isLoading$;
  }

  delete() {
    this.categoryService
      .deleteCategory(this.category.id)
      .subscribe((reps: any) => {
        console.log(reps);
        this.CategorieD.emit({ message: 200 });
        this.modal.close();
      });
  }
}
