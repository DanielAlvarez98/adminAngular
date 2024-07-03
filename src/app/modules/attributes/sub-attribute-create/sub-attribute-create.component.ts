import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';
import { SubAttributeDeleteComponent } from '../sub-attribute-delete/sub-attribute-delete.component';

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss'],
})
export class SubAttributeCreateComponent implements OnInit {
  // @Output() AttributeC: EventEmitter<any> = new EventEmitter();
  properties: any = [];
  @Input() attribute: any;
  isLoading$: any;

  type_action: number = 1;
  color: any;
  name: string = '';

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.properties = this.attribute.properties;
  }

  store() {
    if (!this.name) {
      this.toastr.error('Required fields (*)', 'Error!');
      return;
    }
    if (this.type_action == 2 && !this.color) {
      this.toastr.error('Required fields (*)', 'Error!');
      return;
    }
    let data = {
      attribute_id: this.attribute.id,
      name: this.name,
      code: this.color,
    };
    this.attributeService.createProperty(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Name field already exists.', 'Error');
      } else {
        this.properties.unshift(resp.property);
        // this.AttributeC.emit(resp.attribute);
        this.toastr.success('Register Success.', 'Success');
      }
    });
  }
  deleteProperty(property: any) {
    const modalRef = this.modalService.open(SubAttributeDeleteComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.property = property;

    modalRef.componentInstance.PropertyD.subscribe((resp: any) => {
      let INDEX = this.properties.findIndex(
        (item: any) => item.id == property.id
      );
      if (INDEX != -1) {
        this.properties.splice(INDEX, 1);
      }
    });
  }
}
