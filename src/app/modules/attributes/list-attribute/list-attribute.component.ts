import { Component, OnInit } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAttributeComponent } from '../delete-attribute/delete-attribute.component';
import { CreateAttributeComponent } from '../create-attribute/create-attribute.component';
import { EditAttributeComponent } from '../edit-attribute/edit-attribute.component';
import { SubAttributeCreateComponent } from '../sub-attribute-create/sub-attribute-create.component';

@Component({
  selector: 'app-list-attribute',
  templateUrl: './list-attribute.component.html',
  styleUrls: ['./list-attribute.component.scss'],
})
export class ListAttributeComponent implements OnInit {
  attributes: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;
  constructor(
    public attributesService: AttributesService,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.listAttributes();
    this.isLoading$ = this.attributesService.isLoading$;
  }
  listAttributes(page = 1) {
    this.attributesService.listAttributes(page, this.search).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.attributes = resp.attributes;
        this.totalPages = resp.total;
        this.currentPage = page;
      },
    });
  }

  getNameAttribute(type_attribute: any) {
    var name_attribute = '';
    type_attribute = parseInt(type_attribute);
    switch (type_attribute) {
      case 1:
        name_attribute = 'Text';
        break;
      case 2:
        name_attribute = 'Number';

        break;
      case 3:
        name_attribute = 'Selectable';

        break;
      case 4:
        name_attribute = 'Multiple selectable';

        break;

      default:
        break;
    }
    return name_attribute;
  }

  searchTo() {
    this.listAttributes();
  }
  loadPage($event: any) {
    this.listAttributes($event);
  }

  openModalAddAttribute() {
    const modalRef = this.modalService.open(CreateAttributeComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.AttributeC.subscribe((attrib: any) => {
      this.attributes.unshift(attrib);
    });
  }

  openModalEditAttribute(attribute: any) {
    const modalRef = this.modalService.open(EditAttributeComponent, {
      centered: true,
      size: 'md',
    }); //nombre igual que el @Input de EditAttributeComponent
                                //este
    modalRef.componentInstance.attribute = attribute;

    modalRef.componentInstance.AttributeE.subscribe((attrib: any) => {
      // this.attributes.unshift(attrib);
      let INDEX = this.attributes.findIndex(
        (item: any) => item.id === attrib.id
      );
      if (INDEX !== -1) {
        this.attributes[INDEX] = attrib;
      }
    });
  }

  deleteAttribute(attribute: any) {
    const modalRef = this.modalService.open(DeleteAttributeComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.attribute = attribute;

    modalRef.componentInstance.AttributeD.subscribe((resp: any) => {
      let INDEX = this.attributes.findIndex(
        (item: any) => item.id == attribute.id
      );
      if (INDEX != -1) {
        this.attributes.splice(INDEX, 1);
      }
    });
  }

  openModalRegisterProperties(attribute: any) {
    const modalRef = this.modalService.open(SubAttributeCreateComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.attribute = attribute;
  }
}
