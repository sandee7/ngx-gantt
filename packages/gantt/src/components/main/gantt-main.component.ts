/*
 * <<licensetext>>
 */

import { Component, EventEmitter, HostBinding, Inject, Input, OnInit, OnChanges, Output, TemplateRef, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { GanttBarClickEvent, GanttGroupInternal, GanttItemInternal, GanttLineClickEvent } from '../../class';
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

    @Output() barClick = new EventEmitter<GanttBarClickEvent>();

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @HostBinding('class.gantt-main-container') ganttMainClass = true;

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

    maxItemsSize: number[];
    currentGroupIndex = 0;
    firstChange = true;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    ngOnInit(): void {
        this.items?.map((item) => {
            // item.type = GanttItemType.custom;
        });
        // this.groups.map((group) => group.items.map((item) => (item.type = GanttItemType.custom)));
        this.getMaxItemSizeWrapper();
    }

    ngOnChanges(): void {
        if (!this.firstChange) {
            this.currentGroupIndex = 0;
            this.getMaxItemSizeWrapper();
        }
        if (this.firstChange) {
            this.firstChange = false;
        }
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }

    getMaxItemSizeWrapper() {
        this.maxItemsSize = [];
        if (this.items && this.items.length > 0) {
            this.maxItemsSize = [this.getMaxItemSize(this.items)];
        } else {
            this.groups.map((group) => {
                this.maxItemsSize.push(this.getMaxItemSize(group.items));
            });
        }
    }

    getMaxItemSize(items: GanttItemInternal[]) {
        let map: Map<[Date, Date], GanttItemInternal[]> = new Map();
        let maxItemsSize = 0;
        items.map((item) => {
            let counter = 0;
            for (let [key, value] of map) {
                // If the two ranges are intersects each other
                if (key[1] >= item.start.value && key[0] <= item.end.value) {
                    item.refs.y += item.refs.y * 5 * value.length;
                    value.push(item);
                    const newStart = Math.min(key[0].getTime(), item.start.value.getTime());
                    const newEnd = Math.max(key[1].getTime(), item.end.value.getTime());
                    const newKey: [Date, Date] = [new Date(newStart), new Date(newEnd)];
                    map.set(newKey, value);
                    map.delete(key);
                    counter++;
                    maxItemsSize = Math.max(maxItemsSize, value.length);
                    map = this.mergeMapItems(map, item);
                    // console.log(map);
                    return;
                }
            }
            if (counter === 0) {
                map.set([new Date(item.start.value), new Date(item.end.value)], [item]);
                maxItemsSize = Math.max(maxItemsSize, 1);
            }
        });

        return maxItemsSize;
    }

    mergeMapItems(map: Map<[Date, Date], GanttItemInternal[]>, item: GanttItemInternal) {
        let values: GanttItemInternal[] = [];
        let keyPairs: [Date, Date][] = [];
        for (let [key, value] of map) {
            // If the two ranges are intersects each other
            if (key[1] >= item.start.value && key[0] <= item.end.value) {
                values.push(...value);
                keyPairs.push(key);
            }
        }
        // Set the newly merged map
        let newStart: number = values[0].start.getTime();
        let newEnd: number = values[0].end.getTime();
        let yDistance = 9;
        values.map((value) => {
            newStart = Math.min(newStart, value.start.value.getTime());
            newEnd = Math.max(newEnd, value.end.value.getTime());
            value.refs.y = yDistance;
            yDistance += 45;
        });
        const newKey: [Date, Date] = [new Date(newStart), new Date(newEnd)];
        map.set(newKey, values);
        // Remove the 'merged' map items
        keyPairs.map((keyPair) => map.delete(keyPair));

        return map;
    }

    getMaxY(values: GanttItemInternal[]): number {
        return Math.max(...values.map((value) => value.refs.y));
    }

    getCurrentMaxItemSize() {
        if (this.items && this.items.length > 0) {
            return this.maxItemsSize[0];
        } else {
            const maxItemSize = this.maxItemsSize[this.currentGroupIndex];
            this.currentGroupIndex++;
            return maxItemSize;
        }
    }
}
