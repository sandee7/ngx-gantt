/*
 * <<licensetext>>
 */

import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';

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
        return this.fb.group(
            {
                id: ['', {}],
                title: [
                    '',
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                start: [
                    '',
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ],
                end: [
                    '',
                    {
                        validators: Validators.compose([Validators.required])
                    }
                ]
            },
            { validators: [], updateOn: 'change' }
        );
    }
}
