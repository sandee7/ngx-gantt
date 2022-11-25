/*
 * <<licensetext>>
 */

import { Component, EventEmitter, HostBinding, Inject, Input, OnInit, OnChanges, Output, TemplateRef } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AppGanttExampleComponent } from 'example/src/app/gantt/gantt.component';
import { GanttService } from 'example/src/app/services/gantt.service';
import { GanttBarClickEvent, GanttGroupInternal, GanttItemInternal } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';

@Component({
    selector: 'gantt-main',
    templateUrl: './gantt-main.component.html'
})
export class GanttMainComponent implements OnInit, OnChanges {
    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input() groupHeaderTemplate: TemplateRef<any>;

    @Input() itemTemplate: TemplateRef<any>;

    @Input() barTemplate: TemplateRef<any>;

    @Input() rangeTemplate: TemplateRef<any>;

    @Output() _barClick = new EventEmitter<GanttBarClickEvent>();

    // @Output() override lineClick = new EventEmitter<GanttLineClickEvent>();

    @HostBinding('class.gantt-main-container') ganttMainClass = true;

    firstChange = true;

    chartOption: EChartsOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'pie'
            }
        ]
    };

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper, public ganttService: GanttService) {
        // super();
    }

    ngOnInit(): void {
        // this.groups.map((group) => group.items.map((item) => (item.type = GanttItemType.custom)));
        this.ganttService.getMaxItemSizeWrapper(this.items, this.groups);
    }

    ngOnChanges(): void {
        if (!this.firstChange) {
            this.ganttService.getMaxItemSizeWrapper(this.items, this.groups);
        }
        if (this.firstChange) {
            this.firstChange = false;
        }
    }

    getCurrentMaxItemSize(currentGroup: GanttGroupInternal) {
        if (!this.firstChange) {
            const index = this.groups.findIndex((group) => group.id === currentGroup.id);
            return this.ganttService.getCurrentMaxItemSize(this.items, index);
        }
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }
}
