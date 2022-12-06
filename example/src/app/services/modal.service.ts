/*
 * <<licensetext>>
 */

import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { GanttItemInternal } from 'ngx-gantt';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateEventComponent } from '../modals/create-event/update-category/create-event-modal.component';

@UntilDestroy()
@Injectable()
export class ModalService {
    constructor(private nzModal: NzModalService) {}

    createEventModal(start: Date, successCallback: (event: GanttItemInternal) => void, cancelCallback: () => void, end?: Date) {
        const modal: any = this.nzModal.create({
            nzTitle: 'Create new event',
            nzContent: CreateEventComponent,
            nzComponentParams: {
                start,
                end
            },
            nzOnOk: () => successCallback(modal.getContentComponent().modal.result),
            nzOnCancel: () => cancelCallback(),
            nzClassName: 'modal'
        });
        return modal;
    }
}
