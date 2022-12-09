/*
 * <<licensetext>>
 */

import { Input, ElementRef, Inject, TemplateRef, Directive, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { GanttItemInternal, GanttItemType } from './class';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { rangeHeight } from './gantt.styles';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';
import { ITEM_HEIGHT } from 'example/src/app/constants/global-variables';
import { GanttService } from 'example/src/app/services/gantt.service';

@Directive()
export abstract class GanttItemUpper implements OnChanges, OnInit, OnDestroy {
    @Input() template: TemplateRef<any>;

    @Input() item: GanttItemInternal;

    public firstChange = true;

    public unsubscribe$ = new Subject<void>();

    constructor(
        protected elementRef: ElementRef<HTMLElement>,
        @Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper,
        private ganttService: GanttService
    ) {}

    ngOnInit() {
        this.firstChange = false;
        this.item.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }

    ngOnChanges(): void {
        if (!this.firstChange) {
            this.setPositions();
        }
    }

    private setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.item.refs.x + 'px';
        itemElement.style.top = this.item.refs.y + 'px';
        itemElement.style.width = this.item.refs.width + 'px';
        if (this.item.type === GanttItemType.bar) {
            itemElement.style.height =
                ITEM_HEIGHT + (this.item.origin.options ? this.ganttService.getHeightByOptions(this.item) : 0) + 'px';
        } else if (this.item.type === GanttItemType.range) {
            itemElement.style.height = rangeHeight + 'px';
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
