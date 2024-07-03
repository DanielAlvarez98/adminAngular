import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-attribute',
  templateUrl: './create-attribute.component.html',
  styleUrls: ['./create-attribute.component.scss'],
})
export class CreateAttributeComponent implements OnInit {
  @Output() AttributeC: EventEmitter<any> = new EventEmitter();

  name: string = '';
  type_attribute: number = 1;

  isLoading$: any;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
  }

  store() {
    if (!this.name || !this.type_attribute) {
      this.toastr.error('Required fields (*)', 'Error!');
      return;
    }
    let data = {
      name: this.name,
      type_attribute: this.type_attribute,
      status: "1",
    };
    this.attributeService.createAttribute(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Name field already exists.', 'Error');
      } else {
        this.AttributeC.emit(resp.attribute);
        this.toastr.success('Register Success.', 'Success');
        this.modal.close();
      }
    });
  }
}
