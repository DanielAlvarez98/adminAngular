import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  image_preview: any = 'assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  isLoading$: any;

  title: string = '';
  sku: string = '';
  price_pen: number = 0;
  price_usd: number = 0;
  description: any = '<p>Hello,world!</p>';
  marca_id: string = '';
  marcas: any = [];
  word: string = '';
  summary: string = '';

  category_first_id: string = '';
  category_second_id: string = '';
  category_third_id: string = '';

  categories_first: any = [];
  categories_second: any = [];
  categories_second_backups: any = [];
  categories_thirds: any = [];
  categories_thirds_backups: any = [];

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};

  isShowMultiSelect: Boolean = false;

  constructor(
    public productService: ProductService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' },
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_second = resp.categories_second;
      this.categories_thirds = resp.categories_third;
    });
  }

  addItems() {
    this.isShowMultiSelect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItems.push({ item_id: time_date, item_text: this.word });
    setTimeout(() => {
      this.isShowMultiSelect = false;
      this.isLoadingView();
      this.word = '';
    }, 100);
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
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }
  changeDepartament() {
    this.categories_second_backups = this.categories_second.filter(
      (item: any) => item.category_second_id == this.category_first_id
    );
  }

  changeCategory() {
    this.categories_thirds_backups = this.categories_thirds.filter(
      (item: any) => item.category_second_id == this.category_second_id
    );
  }
  public onChange(event: any) {
    this.description = event.editor.getData();
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  save() {
    if (
      !this.title ||
      !this.sku ||
      !this.price_pen ||
      !this.price_usd ||
      !this.marca_id ||
      !this.file_image ||
      !this.category_first_id ||
      !this.description ||
      !this.summary ||
      this.selectedItems == 0
    ) {
      this.toastr.error('Required fields (*)', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('sku', this.sku);
    formData.append('price_pen', this.price_pen + '');
    formData.append('price_usd', this.price_usd + '');
    formData.append('brand_id', this.marca_id);
    formData.append('category_first_id', this.category_first_id);
    if (this.category_second_id) {
      formData.append('category_second_id', this.category_second_id);
    }
    if (this.category_third_id) {
      formData.append('category_third_id', this.category_third_id);
    }
    formData.append('portada', this.file_image);
    formData.append('description', this.description);
    formData.append('summary', this.summary);
    formData.append('multiselect', JSON.stringify(this.selectedItems)); //es los tags en el back

    this.productService.createProduct(formData).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.message == 200) {
          this.file_image = null;
          this.title = '';
          this.sku = '';
          this.price_pen = 0;
          this.price_usd = 0;
          this.marca_id = '';
          this.category_first_id = '';
          this.category_second_id = '';
          this.category_third_id = '';
          this.description = '';
          this.summary = '';
          this.selectedItems = [];
          this.dropdownList=[];
          this.image_preview = 'assets/media/svg/illustrations/easy/2.svg';
          this.toastr.success('Registered Successfully.', 'success');
        } else if (resp.message == 403) {
          this.toastr.error(resp.message_text, 'Error');
        }
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error(
          'An error occurred while registering..'+err.error.message,
          'Error Ups..'
        );
      },
    });
  }
}
