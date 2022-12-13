/*
 * <<licensetext>>
 */

import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { State } from '../interfaces/event.interface';

@UntilDestroy()
@Injectable()
export class FormService {
    constructor(private fb: UntypedFormBuilder) {}

    markAllAsTouched(form: UntypedFormGroup) {
        form.markAllAsTouched();
        if (form.controls) {
            for (const control of Object.keys(form.controls)) {
                form.controls[control].markAsTouched();
                form.controls[control].updateValueAndValidity();
                if (form.controls[control] instanceof UntypedFormGroup) {
                    this.markAllAsTouched(form.controls[control] as UntypedFormGroup);
                }
                if (form.controls[control].value && form.controls[control].value instanceof UntypedFormGroup) {
                    this.markAllAsTouched(form.controls[control].value as UntypedFormGroup);
                }
                if (form.controls[control].value && Array.isArray(form.controls[control].value)) {
                    (form.controls[control].value as Array<any>).forEach((element) => {
                        if (element instanceof UntypedFormGroup) {
                            this.markAllAsTouched(element);
                        }
                        if (element.value instanceof UntypedFormGroup) {
                            this.markAllAsTouched(element.value);
                        }
                    });
                }
            }
        }
        form.updateValueAndValidity();
    }

    eventFormGroup(): UntypedFormGroup {
        const now = new Date();
        return this.fb.group(
            {
                timestamp: [now, {}],
                id: ['', {}],
                name: [
                    '',
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                description: ['', { validators: Validators.compose([Validators.maxLength(150)]) }],
                eventTypeName: [
                    '',
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                eventTypeVersion: [
                    '',
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                action: [
                    '',
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                startDate: [
                    now,
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                startTime: [
                    now,
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                endDate: [
                    now,
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                endTime: [
                    now,
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                state: [
                    State.CREATED,
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                relations: ['', {}],
                options: ['', {}],
                // meta: { temporaryEvent: ['', {}]},
                group_id: ['', {}],
                color: ['', {}],
                draggable: [true, {}],
                expandable: [true, {}]
            },
            { validators: [], updateOn: 'change' }
        );
    }
}
