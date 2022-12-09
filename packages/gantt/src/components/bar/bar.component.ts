/*
 * <<licensetext>>
 */

import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { GanttService } from 'example/src/app/services/gantt.service';
import { fromEvent, merge, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { GanttBarClickEvent } from '../../class';
import { GanttDragContainer } from '../../gantt-drag-container';
import { GanttItemUpper } from '../../gantt-item-upper';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';
import { barBackground } from '../../gantt.styles';
import { hexToRgb } from '../../utils/helpers';
import { GanttBarDrag } from './bar-drag';

function linearGradient(sideOrCorner: string, color: string, stop: string) {
    return `linear-gradient(${sideOrCorner},${color} 0%,${stop} 40%)`;
}

@Component({
    selector: 'ngx-gantt-bar,gantt-bar',
    templateUrl: './bar.component.html',
    providers: [GanttBarDrag]
})
export class NgxGanttBarComponent extends GanttItemUpper implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Output() barClick = new EventEmitter<GanttBarClickEvent>();

    @ViewChild('content') contentElementRef: ElementRef<HTMLDivElement>;

    @HostBinding('class.gantt-bar') ganttItemClass = true;

    @ViewChildren('handle') handles: QueryList<ElementRef<HTMLElement>>;

    constructor(
        private dragContainer: GanttDragContainer,
        private drag: GanttBarDrag,
        elementRef: ElementRef<HTMLDivElement>,
        @Inject(GANTT_UPPER_TOKEN) public override ganttUpper: GanttUpper,
        private ngZone: NgZone,
        ganttService: GanttService
    ) {
        super(elementRef, ganttUpper, ganttService);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.dragContainer.dragEnded.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setContentBackground();
        });
    }

    ngAfterViewInit() {
        this.drag.createDrags(this.elementRef, this.item, this.ganttUpper);
        this.setContentBackground();

        this.handles.changes
            .pipe(
                startWith(this.handles),
                switchMap(
                    () =>
                        // Note: we need to explicitly subscribe outside of the Angular zone since `addEventListener`
                        // is called when the `fromEvent` is subscribed.
                        new Observable<Event>((subscriber) =>
                            this.ngZone.runOutsideAngular(() =>
                                merge(...this.handles.toArray().map((handle) => fromEvent(handle.nativeElement, 'mousedown'))).subscribe(
                                    subscriber
                                )
                            )
                        )
                ),
                takeUntil(this.unsubscribe$)
            )
            .subscribe((event) => {
                event.stopPropagation();
            });
    }

    onBarClick(event: Event, item: any) {
        this.barClick.emit({ event, item: this.item.origin });
    }

    private setContentBackground() {
        const contentElement = this.contentElementRef.nativeElement;
        const color = this.item.color || barBackground;
        const style: Partial<CSSStyleDeclaration> = this.item.barStyle || {};
        if (this.item.origin.start && this.item.origin.end) {
            style.background = color;
            style.borderRadius = '';
        }
        if (this.item.origin.start && !this.item.origin.end) {
            style.background = linearGradient('to left', hexToRgb(color, 0.55), hexToRgb(color, 1));
            style.borderRadius = '4px 12.5px 12.5px 4px';
        }
        if (!this.item.origin.start && this.item.origin.end) {
            style.background = linearGradient('to right', hexToRgb(color, 0.55), hexToRgb(color, 1));
            style.borderRadius = '12.5px 4px 4px 12.5px';
        }
        if (this.item.progress >= 0) {
            const contentProgressElement = contentElement.querySelector('.gantt-bar-content-progress') as HTMLDivElement;
            style.background = hexToRgb(color, 0.3);
            style.borderRadius = '';
            contentProgressElement.style.background = color;
        }

        for (const key in style) {
            if (style.hasOwnProperty(key)) {
                contentElement.style[key] = style[key];
            }
        }
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
