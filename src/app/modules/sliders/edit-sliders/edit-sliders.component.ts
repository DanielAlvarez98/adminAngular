import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../service/sliders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-sliders',
  templateUrl: './edit-sliders.component.html',
  styleUrls: ['./edit-sliders.component.scss'],
})
export class EditSlidersComponent {
  image_preview: any = 'assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  isLoading$: any;

  slider_id: string = '';
  title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color: string = '';
  status: number = 1;
  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService,
    public activeRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.sliderService.isLoading$;
    this.activeRouter.params.subscribe((reps: any) => {
      this.slider_id = reps.id;
    });

    this.sliderService.showSlider(this.slider_id).subscribe((resp: any) => {
      this.image_preview=resp.slider.imagen;
      this.title=resp.slider.title;
      this.label=resp.slider.label;
      this.subtitle=resp.slider.subtitle;
      this.link=resp.slider.link;
       this.color=resp.slider.color;
      this.status=resp.slider.status;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  update() {
    if (!this.title || !this.subtitle) {
      this.toastr.error('Required fields (*)', 'Error');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('subtitle', this.subtitle);
    formData.append('status', this.status+'');

    if (this.link) {
      formData.append('image', this.file_image);
    }
    if (this.link) {
      formData.append('link', this.link);
    }
    if (this.label) {
      formData.append('label', this.label);
    }
    if (this.color) {
      formData.append('color', this.color);
    }
    
    this.sliderService.updateSlider(this.slider_id, formData).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.message == 200) {

          this.toastr.success('Updated Successfully.', 'success');
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
