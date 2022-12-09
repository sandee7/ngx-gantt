/*
 * <<licensetext>>
 */

import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EChartsOption } from 'echarts';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Event } from '../interfaces/event.interface';
import { CreateEventComponent } from '../modals/create-event/create-event-modal.component';
import { EchartComponent } from '../modals/echart/echart-modal.component';

@UntilDestroy()
@Injectable()
export class ModalService {
    constructor(private nzModal: NzModalService) {}

    createEventModal(start: Date, successCallback: (event: Event) => void, cancelCallback: () => void, end?: Date, eventTypeName?: string) {
        const modal: any = this.nzModal.create({
            nzTitle: 'Create new event',
            nzContent: CreateEventComponent,
            nzComponentParams: {
                start,
                end,
                eventTypeName
            },
            nzOnOk: () => successCallback(modal.getContentComponent().modal.result),
            nzOnCancel: () => cancelCallback(),
            nzClassName: 'modal'
        });
        return modal;
    }

    openEchart(echart: EChartsOption) {
        const modal: any = this.nzModal.create({
            nzTitle: 'Echart',
            nzContent: EchartComponent,
            nzComponentParams: {
                echart
            },
            nzClassName: 'modal',
            nzFooter: []
        });
        return modal;
    }
}
