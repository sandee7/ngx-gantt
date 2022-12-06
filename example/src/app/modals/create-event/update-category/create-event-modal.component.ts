/*
 * <<licensetext>>
 */

import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormService } from 'example/src/app/services/form.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-create-event',
    templateUrl: './create-event-modal.component.html',
    styleUrls: ['./create-event-modal.component.less']
})
export class CreateEventComponent implements OnInit {
    @Input() start: Date;
    @Input() end: Date;

    eventForm: UntypedFormGroup;

    // Making types available for the template
    FormControl = UntypedFormControl;

    /**
     * Initialize services
     * @param formService Get the properties and their validations
     * @param modal Get the modal's functions, actions
     * @param message Set the messages after a successful or failed HTTP call
     */
    constructor(private formService: FormService, private modal: NzModalRef, private message: NzMessageService) {}

    /**
     * Component initialization
     */
    ngOnInit(): void {
        this.eventForm = this.formService.eventFormGroup();
    }

    /**
     * If the form is valid, call the server to save it.
     * If it is not, set the form to be touched and send message as an error.
     */
    save(): Promise<any> {
        if (this.eventForm.valid) {
            // let actPromise: Promise<RelatedToCategory>;
            // actPromise = this.categoryService
            //   .createOrModifyCategory(this.eventForm.value)
            //   .toPromise();
            // actPromise
            //   .then((relatedToCategory) => {
            //     this.modal.result = relatedToCategory ? relatedToCategory : null;
            //     this.modal.triggerOk();
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //     return Promise.reject();
            //   });
            // return actPromise;
            this.modal.result = {
                title: this.eventForm.get('title')?.value,
                start: this.eventForm.get('start')?.value,
                end: this.eventForm.get('end')?.value
            };
            this.message.success('Yaay, new event created!');
            return Promise.resolve().then(() => this.modal.triggerOk());
        } else {
            if (this.eventForm) {
                this.formService.markAllAsTouched(this.eventForm);
            }
            this.message.error('Sorry, we can not save your modification!');
            return Promise.reject();
        }
    }

    /**
     * Close the modal.
     */
    close(): void {
        this.modal.triggerCancel();
    }
}
