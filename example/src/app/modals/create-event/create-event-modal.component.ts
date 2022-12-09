/*
 * <<licensetext>>
 */

import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { addDays } from 'date-fns';
import { EventType, Relation } from 'example/src/app/interfaces/event.interface';
import { EventService } from 'example/src/app/services/event.service';
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
    @Input() end?: Date;
    @Input() eventTypeName: string;

    eventTypes: EventType[];
    eventTypeNames: string[];
    selectedEventTypeVersions: number[];
    selectedEventTypeActions: string[];
    // selectedEventTypeRelations: Map<string, string | number | boolean>;

    eventForm: UntypedFormGroup;

    // Making types available for the template
    FormControl = UntypedFormControl;

    /**
     * Initialize services
     * @param formService Get the properties and their validations
     * @param modal Get the modal's functions, actions
     * @param message Set the messages after a successful or failed HTTP call
     */
    constructor(
        private formService: FormService,
        private modal: NzModalRef,
        private message: NzMessageService,
        private eventService: EventService
    ) {}

    /**
     * Component initialization
     */
    ngOnInit(): void {
        this.eventForm = this.formService.eventFormGroup();
        this.eventTypes = this.eventService.getEventTypes();
        this.eventTypeNames = [...new Set(this.eventTypes.map((eventType) => eventType.name))];
        this.setInitialValues();
    }

    setInitialValues() {
        const endDate = this.end ? this.end : addDays(this.start, 7);
        this.eventForm.patchValue({
            startDate: this.start,
            startTime: this.start,
            endDate,
            endTime: endDate,
            eventTypeName: this.eventTypeName
        });
        this.getVersionsByEventTypeName();
    }

    getVersionsByEventTypeName() {
        const selectedEventTypeName = this.eventForm.get('eventTypeName').value;
        this.selectedEventTypeVersions = this.eventTypes
            .filter((eventType) => eventType.name === selectedEventTypeName)
            .map((eventType) => eventType.version);
    }

    getActionsByVersion() {
        const selectedEventTypeVersion = this.eventForm.get('eventTypeVersion').value;
        const selectedEventType = this.eventTypes.find(
            (eventType) => eventType.name === this.eventForm.get('eventTypeName').value && eventType.version === selectedEventTypeVersion
        );

        this.selectedEventTypeActions = selectedEventType.actions;
        // this.selectedEventTypeRelations = selectedEventType.relationsMap;
    }

    setDate(start: boolean): number {
        const selectedDate = this.eventForm.get((start ? 'start' : 'end') + 'Date').value as Date;
        const selectedTime = this.eventForm.get((start ? 'start' : 'end') + 'Time').value as Date;
        return new Date(selectedDate).setHours(selectedTime.getHours(), selectedTime.getMinutes());
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
                timestamp: this.eventForm.get('timestamp').value,
                id: this.eventForm.get('id').value,
                name: this.eventForm.get('name').value,
                description: this.eventForm.get('description').value,
                action: this.eventForm.get('action').value,
                eventTypeName: this.eventForm.get('eventTypeName').value,
                eventTypeVersion: this.eventForm.get('eventTypeVersion').value,
                start: this.setDate(true),
                end: this.setDate(false),
                state: this.eventForm.get('state').value
                // relations: this.eventForm.get('relations').value
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
