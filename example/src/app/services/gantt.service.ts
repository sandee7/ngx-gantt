/*
 * <<licensetext>>
 */

import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { GanttGroupInternal, GanttItemInternal } from 'ngx-gantt';
import { ECHART_HEIGHT } from '../constants/global-variables';

@UntilDestroy()
@Injectable()
export class GanttService {
    public maxItemsSize: number[] = [];

    constructor() {}

    getMaxItemSizeWrapper(items?: GanttItemInternal[], groups?: GanttGroupInternal[]) {
        this.maxItemsSize = [];
        if (items && items.length > 0) {
            this.maxItemsSize = [this.getMaxItemSize(items as unknown as GanttItemInternal[])];
        } else {
            (groups as GanttGroupInternal[]).map((group) => {
                this.maxItemsSize.push(this.getMaxItemSize(group.items as GanttItemInternal[]));
            });
        }
    }

    getMaxItemSize(items: GanttItemInternal[]): number {
        let map: Map<[Date, Date], GanttItemInternal[]> = new Map();
        let maxItemY = 0;
        items.map((item) => {
            let counter = 0;
            for (let [key, value] of map) {
                // If the two ranges are intersects each other
                if (key[1] >= item.start?.value && key[0] <= item.end?.value) {
                    counter++;
                    value.push(item);
                    const newStart = Math.min(key[0].getTime(), item.start?.value.getTime());
                    const newEnd = Math.max(key[1].getTime(), item.end?.value.getTime());
                    const newKey: [Date, Date] = [new Date(newStart), new Date(newEnd)];
                    map.set(newKey, value);
                    map.delete(key);
                    const result = this.mergeMapItems(map, item);
                    map = result.map;
                    maxItemY = Math.max(maxItemY, result.yDistance);
                    return;
                }
            }
            if (counter === 0) {
                map.set([new Date(item.start?.value), new Date(item.end?.value)], [item]);
                maxItemY = Math.max(maxItemY, item.refs.y);
            }
        });

        return maxItemY;
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
        // todo: Create a global variable
        let yDistance = 10; // The distance from the top
        values.map((value) => {
            newStart = Math.min(newStart, value.start.value.getTime());
            newEnd = Math.max(newEnd, value.end.value.getTime());
            value.refs.y = yDistance;
            // Add distance between the items
            yDistance += 45 + (value.origin.options ? this.getHeightByOptions(value) : 0);
        });
        const newKey: [Date, Date] = [new Date(newStart), new Date(newEnd)];
        map.set(newKey, values);
        // Remove the 'merged' map items
        keyPairs.map((keyPair) => map.delete(keyPair));

        return { map, yDistance };
    }

    getMaxY(values: GanttItemInternal[]): number {
        return Math.max(...values.map((value) => value.refs.y));
    }

    getCurrentMaxItemSize(items: GanttItemInternal[], currentGroupIndex: number) {
        if (items && items.length > 0) {
            return this.maxItemsSize[0];
        } else if (currentGroupIndex > -1) {
            const maxItemSize = this.maxItemsSize[currentGroupIndex];
            return maxItemSize;
        } else {
            return 0;
        }
    }

    getHeightByOptions(item: GanttItemInternal) {
        if (item.origin.options.echart) {
            return ECHART_HEIGHT;
        }
    }
}
