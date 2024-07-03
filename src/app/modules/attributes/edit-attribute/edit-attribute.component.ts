import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss'],
})
export class EditAttributeComponent implements OnInit {
  @Output() AttributeE: EventEmitter<any> = new EventEmitter();

  //mismo nombre que se envia desde lis-attributeComponent editModalAddAttribute(){}
  @Input() attribute: any;

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
    this.name = this.attribute.name;
    this.type_attribute = this.attribute.type_attribute;
  }

  update() {
    if (!this.name || !this.type_attribute) {
      this.toastr.error('Required fields (*)', 'Error!');
      return;
    }
    let data = {
      name: this.name,
      type_attribute: this.type_attribute,
      status: '1',
    };
    this.attributeService
      .updateAttribute(this.attribute.id, data)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
          this.toastr.error('Name field already exists.', 'Error');
        } else {
          this.AttributeE.emit(resp.attribute);
          this.toastr.success('Updated Success.', 'Success');
          this.modal.close();
        }
      });
  }
}
