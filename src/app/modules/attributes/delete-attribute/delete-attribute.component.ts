import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-delete-attribute',
  templateUrl: './delete-attribute.component.html',
  styleUrls: ['./delete-attribute.component.scss']
})
export class DeleteAttributeComponent implements OnInit {
  @Input() attribute: any;

  @Output() AttributeD: EventEmitter<any> = new EventEmitter();

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
      .deleteAttribute(this.attribute.id)
      .subscribe((reps: any) => {
        console.log(reps);
        this.AttributeD.emit({ message: 200 });
        this.modal.close();
      });
  }
}
