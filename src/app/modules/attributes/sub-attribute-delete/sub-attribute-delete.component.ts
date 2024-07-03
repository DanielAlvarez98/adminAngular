import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-sub-attribute-delete',
  templateUrl: './sub-attribute-delete.component.html',
  styleUrls: ['./sub-attribute-delete.component.scss']
})
export class SubAttributeDeleteComponent implements OnInit {
  @Input() property: any;

  @Output() PropertyD: EventEmitter<any> = new EventEmitter();

  isLoading: any;
  constructor(
    public attributeService: AttributesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.attributeService.isLoading$;
  }

  delete() {
    this.attributeService
      .deleteProperty(this.property.id)
      .subscribe((reps: any) => {
        console.log(reps);
        this.PropertyD.emit({ message: 200 });
        this.modal.close();
      });
  }
}
