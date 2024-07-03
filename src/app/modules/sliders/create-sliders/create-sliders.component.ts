import { Component, OnInit } from '@angular/core';
import { SlidersService } from '../service/sliders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-sliders',
  templateUrl: './create-sliders.component.html',
  styleUrls: ['./create-sliders.component.scss'],
})
export class CreateSlidersComponent implements OnInit {
  image_preview: any = 'assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  isLoading$: any;

  title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color:string = '';
  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.sliderService.isLoading$;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {
    if (!this.title || !this.subtitle || !this.file_image) {
      this.toastr.error('Required fields (*)', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('image', this.file_image);
    formData.append('subtitle', this.subtitle);
    if (this.link) {
      formData.append('link', this.link);
    }
    if (this.label) {
      formData.append('label', this.label);
    }
    if (this.color) {
      formData.append('color', this.color);
    }
    this.sliderService.createSlider(formData).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.message == 200) {
          this.title = '';
          this.subtitle = '';
          this.label = '';
          this.link = '';
          this.file_image = null;
          this.color = '';
          this.image_preview = 'assets/media/svg/illustrations/easy/2.svg';
          this.toastr.success('Registered Successfully.', 'success');
        } else {
          this.toastr.error(
            'An error occurred while registering..',
            'Error Ups..'
          );
        }
      },
    });
  }
}
