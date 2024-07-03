import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  type_category: number = 1;

  name: string = '';
  icon: string = '';
  position: number = 1;
  category_second_id: string = '';
  category_third_id: string = '';

  image_preview: any = 'assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;

  isLoading$: any;

  categories_first: any = [];
  categories_second: any = [];
  categories_second_backups: any = [];

  constructor(
    public categoriesService: CategoriesService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.categoriesService.isLoading$;
    this.config();
  }

  config() {
    this.categoriesService.configCategories().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.categories_first = resp.categories_first;
        this.categories_second = resp.categories_second;
      },
    });
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error('The file is not an image', 'Error');
      return;
    }
    this.file_image = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_image);
    reader.onloadend = () => (this.image_preview = reader.result);
    this.isLoadingView();
  }

  isLoadingView() {
    this.categoriesService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categoriesService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategory(val: number) {
    this.type_category = val;
    this.category_third_id = '';
    this.category_second_id = '';
  }

  changeDepartament() {
    this.categories_second_backups = this.categories_second.filter(
      (item: any) => item.category_second_id == this.category_third_id
    );
  }

  save() {
    if (!this.name || !this.position) {
      this.toastr.error('Required fields (*)', 'Error');
      return;
    }
    if (this.type_category == 1 && !this.icon) {
      this.toastr.error('Required fields type icon (*)', 'Error');
      return;
    }
    if (this.type_category == 1 && !this.file_image) {
      this.toastr.error('Required fields type image (*)', 'Error');
      return;
    }
    if (this.type_category == 2 && !this.category_second_id) {
      this.toastr.error('Required fields Department (*)', 'Error');
      return;
    }
    if (
      this.type_category == 3 &&
      (!this.category_second_id || !this.category_third_id)
    ) {
      this.toastr.error('Required fields Department and Category (*)', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('name', this.name);
    formData.append('icon', this.icon);
    formData.append('position', this.position + '');
    formData.append('type_category', this.type_category + '');

    if (this.file_image) {
      formData.append('image', this.file_image);
    }
    if (this.category_second_id) {
      formData.append('category_second_id', this.category_second_id);
    }
    if (this.category_third_id) {
      formData.append('category_third_id', this.category_third_id);
    }
    this.categoriesService.createCategory(formData).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
          this.toastr.error('Name field already exists.', 'Error');
        }
        if (resp.message == 200) {
          this.toastr.success('Registered Successfully.', 'success');
          this.name = '';
          this.icon = '';
          this.position = 1;
          this.type_category = 1;
          this.file_image = null;
          this.image_preview = 'assets/media/svg/illustrations/easy/2.svg';
          this.category_second_id = '';
          this.category_third_id = '';
          this.config();
        }
      },
    });
  }
}
