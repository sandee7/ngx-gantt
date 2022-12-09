/*
 * <<licensetext>>
 */

import { Component, Inject } from '@angular/core';
import { EChartsOption } from 'echarts';
import { GanttGroupInternal, GanttItemInternal } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';

@Component({
    selector: 'custom-chart',
    templateUrl: './chart.component.html'
})
export class ChartComponent {
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
                type: 'line'
            }
        ]
    };
    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }

    setItemMap(items: GanttItemInternal[]) {
        const map: Map<[Date, Date], GanttItemInternal[]> = new Map();
        let maxItemsSize = 0;
        items.map((item) => {
            let counter = 0;
            for (let [key, value] of map) {
                // If the two ranges are intersects each other
                if (key[1] >= item.start.value && key[0] <= item.end.value) {
                    item.refs.y += item.refs.y * 5 * value.length;
                    value.push(item);
                    map.delete(key);
                    const newStart = Math.min(key[0].getTime(), item.start.value.getTime());
                    const newEnd = Math.min(key[1].getTime(), item.end.value.getTime());
                    const newKey: [Date, Date] = [new Date(newStart), new Date(newEnd)];
                    map.set(newKey, value);
                    counter++;
                    maxItemsSize = Math.max(maxItemsSize, value.length);
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
}
