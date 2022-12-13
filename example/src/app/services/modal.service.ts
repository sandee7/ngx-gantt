/*
 * <<licensetext>>
 */

import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EChartsOption } from 'echarts';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GanttItem } from 'ngx-gantt';
import { Event, State } from '../interfaces/event.interface';
import { CreateEventComponent } from '../modals/create-event/create-event-modal.component';
import { EchartComponent } from '../modals/echart/echart-modal.component';

@UntilDestroy()
@Injectable()
export class ModalService {
    constructor(private nzModal: NzModalService) {}

    createEventModal(
        start: Date,
        state: State,
        successCallback: (event: Event) => void,
        cancelCallback: () => void,
        end?: Date,
        eventTypeName?: string
    ) {
        const modal: any = this.nzModal.create({
            nzTitle: 'Create event',
            nzContent: CreateEventComponent,
            nzComponentParams: {
                state,
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

    modifyEventModal(state: State, event: GanttItem, successCallback: (event: Event) => void, cancelCallback: () => void) {
        const modal: any = this.nzModal.create({
            nzTitle: 'Modify event',
            nzContent: CreateEventComponent,
            nzComponentParams: {
                state,
                event
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
