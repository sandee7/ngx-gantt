/*
 * <<licensetext>>
 */

import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-echart',
    templateUrl: './echart-modal.component.html',
    styleUrls: ['./echart-modal.component.less']
})
export class EchartComponent implements OnInit {
    @Input() echart: EChartsOption;

    /**
     * Initialize services
     * @param modal Get the modal's functions, actions
     */
    constructor(private modal: NzModalRef) {}

    /**
     * Component initialization
     */
    ngOnInit(): void {}

    /**
     * Close the modal.
     */
    close(): void {
        this.modal.triggerCancel();
    }
}
