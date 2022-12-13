/*
 * <<licensetext>>
 */

import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { addDays } from 'date-fns';
import { EventType, State } from 'example/src/app/interfaces/event.interface';
import { EventService } from 'example/src/app/services/event.service';
import { FormService } from 'example/src/app/services/form.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { GanttItem } from 'ngx-gantt';

@Component({
    selector: 'app-create-event',
    templateUrl: './create-event-modal.component.html',
    styleUrls: ['./create-event-modal.component.less']
})
export class CreateEventComponent implements OnInit {
    @Input() state: State;
    @Input() start: Date;
    @Input() end?: Date;
    @Input() event: GanttItem;
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
        if (this.state === State.CREATED) {
            const endDate = this.end ? this.end : addDays(this.start, 7);
            this.eventForm.patchValue({
                state: this.state,
                startDate: this.start,
                startTime: this.start,
                endDate,
                endTime: endDate,
                eventTypeName: this.eventTypeName
            });
        }
        // If this is an event modification
        else {
            this.eventForm.patchValue({
                state: this.state,
                id: this.event.id,
                name: this.event.name,
                desciption: this.event.description,
                startDate: new Date(parseInt(this.event.start.toString().concat('000'))),
                startTime: new Date(parseInt(this.event.start.toString().concat('000'))),
                endDate: new Date(parseInt(this.event.end.toString().concat('000'))),
                endTime: new Date(parseInt(this.event.end.toString().concat('000'))),
                eventTypeName: this.event.eventTypeName,
                eventTypeVersion: this.event.eventTypeVersion,
                action: this.event.action,
                relations: this.event.relations,
                options: this.event.options,
                group_id: this.event.group_id,
                color: this.event.color
            });
        }
        this.getVersionsByEventTypeName();
        this.getActionsByVersion();
    }

    getVersionsByEventTypeName() {
        const selectedEventTypeName = this.eventForm.get('eventTypeName').value;
        this.selectedEventTypeVersions = this.eventTypes
            .filter((eventType) => eventType.name === selectedEventTypeName)
            .map((eventType) => eventType.version);
    }

    getActionsByVersion() {
        const selectedEventTypeVersion = this.eventForm.get('eventTypeVersion').value;
        if (selectedEventTypeVersion) {
            const selectedEventType = this.eventTypes.find(
                (eventType) =>
                    eventType.name === this.eventForm.get('eventTypeName').value && eventType.version === selectedEventTypeVersion
            );

            this.selectedEventTypeActions = selectedEventType.actions;
        }
        // this.selectedEventTypeRelations = selectedEventType.relationsMap;
    }

    setDate(start: boolean): number {
        const selectedDate = this.eventForm.get((start ? 'start' : 'end') + 'Date').value as Date;
        const selectedTime = this.eventForm.get((start ? 'start' : 'end') + 'Time').value as Date;
        return (
            new Date(selectedDate).setHours(selectedTime.getHours(), selectedTime.getMinutes()) / (this.state === State.CREATED ? 1 : 1000)
        );
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
                eventTypeName: this.eventForm.get('eventTypeName').value,
                eventTypeVersion: this.eventForm.get('eventTypeVersion').value,
                action: this.eventForm.get('action').value,
                start: this.setDate(true),
                end: this.setDate(false),
                state: this.eventForm.get('state').value,
                relations: this.eventForm.get('relations').value,
                options: this.eventForm.get('options').value,
                group_id: this.eventForm.get('group_id').value,
                color: this.eventForm.get('color').value,
                draggable: this.eventForm.get('draggable').value,
                expandable: this.eventForm.get('expandable').value
            };
            this.message.success(`${this.state === State.CREATED ? 'Yaay, new event created!' : 'Yaay, an event modified!'}`);
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
