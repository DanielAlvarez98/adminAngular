import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent  implements OnInit {
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
  product_id: string = '';

  product_select:any;

  constructor(
    public productService: ProductService,
    public toastr: ToastrService,
    public activedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.activedRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.product_id = resp.id;
    });

    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_second = resp.categories_second;
      this.categories_thirds = resp.categories_third;
      this.showProduct();

    });
  }
  showProduct(){
    this.productService.showProduct(this.product_id).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.product_select=resp.product;
        this.image_preview=resp.product.imagen;
        this.title=resp.product.title;
        this.sku=resp.product.sku;
        this.price_pen=resp.product.price_pen;
        this.price_usd=resp.product.price_usd;
        this.description=resp.product.description;
        this.marca_id=resp.product.brand_id;
        this.summary=resp.product.summary;
        this.category_first_id=resp.product.category_first_id;
        this.category_second_id=resp.product.category_second_id;
        this.category_third_id=resp.product.category_third_id;
        this.selectedItems=resp.product.selectedItems;
        this.changeDepartament();
        this.changeCategory();
        this.dropdownList=resp.product.tags;
        this.selectedItems=resp.product.tags;
      },
    });
  }

  addItems() {
    this.isShowMultiSelect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItems.push({ item_id: time_date, item_text: this.word });
    setTimeout(() => {
      console.log(this.selectedItems)
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

  update() {
    if (
      !this.title ||
      !this.sku ||
      !this.price_pen ||
      !this.price_usd ||
      !this.marca_id ||
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
    if (this.file_image) {
      formData.append('portada', this.file_image);
    }
    formData.append('description', this.description);
    formData.append('summary', this.summary);
    formData.append('multiselect', JSON.stringify(this.selectedItems)); //es los tags en el back

    this.productService.updateProduct(this.product_id, formData).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.message == 200) {
          this.file_image=null;
          this.toastr.success('Updated Successfully.', 'success');
        } else if (resp.message == 403) {
          this.toastr.error('Name field already exists.', 'Error');
        }
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error(
          'An error occurred while updating..' + err.error.message,
          'Error Ups..'
        );
      },
    });
  }
}
