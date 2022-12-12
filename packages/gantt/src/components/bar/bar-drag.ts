/*
 * <<licensetext>>
 */

import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable, OnDestroy, SkipSelf } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GanttItemInternal } from '../../class/item';
import { GanttDomService } from '../../gantt-dom.service';
import { GanttDragContainer } from '../../gantt-drag-container';
import { GanttUpper } from '../../gantt-upper';
import { NgxGanttRootComponent } from '../../root.component';
import { differenceInCalendarDays, GanttDate } from '../../utils/date';
import { passiveListenerOptions } from '../../utils/passive-listeners';

const dragMinWidth = 10;
const activeClass = 'gantt-bar-active';
const dropActiveClass = 'gantt-bar-drop-active';
const singleDropActiveClass = 'gantt-bar-single-drop-active';

function createSvgElement(qualifiedName: string, className: string) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
    element.classList.add(className);
    return element;
}

@Injectable()
export class GanttBarDrag implements OnDestroy {
    private ganttUpper: GanttUpper;

    private barElement: HTMLElement;

    private item: GanttItemInternal;

    private get dragDisabled() {
        return !this.item.draggable || !this.ganttUpper.draggable;
    }

    private barDragRef: DragRef;

    private dragRefs: DragRef[] = [];

    private destroy$ = new Subject<void>();

    constructor(
        private dragDrop: DragDrop,
        private dom: GanttDomService,
        private dragContainer: GanttDragContainer,
        @SkipSelf() private root: NgxGanttRootComponent
    ) {}

    private createMouseEvents() {
        fromEvent(this.barElement, 'mouseenter', passiveListenerOptions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.barElement.classList.add(activeClass);
            });
    }

    private createBarDrag() {
        const dragRef = this.dragDrop.createDrag(this.barElement);
        dragRef.lockAxis = 'x';
        dragRef.started.subscribe(() => {
            this.setDraggingStyles();
            this.dragContainer.dragStarted.emit({ item: this.item.origin });
        });
        dragRef.moved.subscribe((event) => {
            const currentX = parseInt(this.barElement.style.left.split('px')[0]) + event.distance.x;
            const currentDate = this.ganttUpper.view.getDateByXPoint(currentX);
            const currentStartX = this.ganttUpper.view.getXPointByDate(currentDate);
            const dayWidth = this.ganttUpper.view.getDayOccupancyWidth(currentDate);
            const diffDays = differenceInCalendarDays(this.item.end.value, this.item.start.value);
            let start = currentDate;
            let end = currentDate.addDays(diffDays);
            if (currentX > currentStartX + dayWidth / 2) {
                start = start.addDays(1);
                end = end.addDays(1);
            }
            this.openDragBackdrop(this.barElement, start, end);
            this.item.updateDate(start, end);
            this.dragContainer.dragMoved.emit({ item: this.item.origin });
        });
        dragRef.ended.subscribe((event) => {
            this.clearDraggingStyles();
            this.closeDragBackdrop();
            event.source.reset();
            this.item.refs.x = parseInt(this.barElement.style.left.split('px')[0]);
            this.dragContainer.dragEnded.emit({ item: this.item.origin });
        });
        this.barDragRef = dragRef;
        return dragRef;
    }

    private createBarHandleDrags() {
        const dragRefs = [];
        const handles = this.barElement.querySelectorAll<HTMLElement>('.drag-handles .handle');
        handles.forEach((handle, index) => {
            const isBefore = index === 0;
            const dragRef = this.dragDrop.createDrag(handle);
            dragRef.lockAxis = 'x';
            dragRef.withBoundaryElement(this.dom.root as HTMLElement);

            dragRef.started.subscribe(() => {
                this.setDraggingStyles();
                this.item.refs.x = parseInt(this.barElement.style.left.split('px')[0]);
                this.item.refs.width = parseInt(this.barElement.style.width.split('px')[0]);
                this.dragContainer.dragStarted.emit({ item: this.item.origin });
            });

            dragRef.moved.subscribe((event) => {
                if (isBefore) {
                    const x = this.item.refs.x + event.distance.x;
                    const width = this.item.refs.width + event.distance.x * -1;
                    if (width > dragMinWidth) {
                        this.barElement.style.width = width + 'px';
                        this.barElement.style.left = x + 'px';
                        this.openDragBackdrop(this.barElement, this.ganttUpper.view.getDateByXPoint(x), this.item.end);
                    }
                } else {
                    const width = this.item.refs.width + event.distance.x;
                    if (width > dragMinWidth) {
                        this.barElement.style.width = width + 'px';
                        this.openDragBackdrop(
                            this.barElement,
                            this.item.start,
                            this.ganttUpper.view.getDateByXPoint(this.item.refs.x + width)
                        );
                    }
                }
                this.dragContainer.dragMoved.emit({ item: this.item.origin });
                event.source.reset();
            });

            dragRef.ended.subscribe((event) => {
                this.item.refs.x = parseInt(this.barElement.style.left.split('px')[0]);
                this.item.refs.width = parseInt(this.barElement.style.width.split('px')[0]);
                if (isBefore) {
                    const width = this.item.refs.width;
                    if (width > dragMinWidth) {
                        this.item.updateDate(this.ganttUpper.view.getDateByXPoint(this.item.refs.x), this.item.end);
                    } else {
                        this.item.updateDate(this.item.end.startOfDay(), this.item.end);
                    }
                } else {
                    const width = this.item.refs.width;
                    if (width > dragMinWidth) {
                        this.item.updateDate(
                            this.item.start,
                            this.ganttUpper.view.getDateByXPoint(this.item.refs.x + this.item.refs.width)
                        );
                    } else {
                        this.item.updateDate(this.item.start, this.item.start.endOfDay());
                    }
                }
                this.clearDraggingStyles();
                this.closeDragBackdrop();
                this.dragContainer.dragEnded.emit({ item: this.item.origin });
            });
            dragRefs.push(dragRef);
        });
        return dragRefs;
    }

    private openDragBackdrop(dragElement: HTMLElement, start: GanttDate, end: GanttDate) {
        const dragBackdropElement = this.root.backdrop.nativeElement;
        const dragMaskElement = dragBackdropElement.querySelector('.gantt-drag-mask') as HTMLElement;
        const rootRect = this.dom.root.getBoundingClientRect();
        const dragRect = dragElement.getBoundingClientRect();
        const left = dragRect.left - rootRect.left - this.dom.side.clientWidth;
        const width = dragRect.right - dragRect.left;
        // Note: updating styles will cause re-layout so we have to place them consistently one by one.
        dragMaskElement.style.left = left + 'px';
        dragMaskElement.style.width = width + 'px';
        dragMaskElement.style.display = 'block';
        dragBackdropElement.style.display = 'block';
        // This will invalidate the layout, but we won't need re-layout, because we set styles previously.
        dragMaskElement.querySelector('.start').innerHTML = start.format('MM-dd');
        dragMaskElement.querySelector('.end').innerHTML = end.format('MM-dd');
    }

    private closeDragBackdrop() {
        const dragBackdropElement = this.root.backdrop.nativeElement;
        const dragMaskElement = dragBackdropElement.querySelector('.gantt-drag-mask') as HTMLElement;
        dragMaskElement.style.display = 'none';
        dragBackdropElement.style.display = 'none';
    }

    private setDraggingStyles() {
        this.barElement.style.pointerEvents = 'none';
        this.barElement.classList.add('gantt-bar-draggable-drag');
    }

    private clearDraggingStyles() {
        this.barElement.style.pointerEvents = '';
        this.barElement.classList.remove('gantt-bar-draggable-drag');
    }

    createDrags(elementRef: ElementRef, item: GanttItemInternal, ganttUpper: GanttUpper) {
        this.item = item;
        this.barElement = elementRef.nativeElement;
        this.ganttUpper = ganttUpper;
        if (this.dragDisabled) {
            return;
        } else {
            this.createMouseEvents();
            if (!this.dragDisabled) {
                const dragRef = this.createBarDrag();
                const dragHandlesRefs = this.createBarHandleDrags();
                this.dragRefs.push(dragRef, ...dragHandlesRefs);
            }
        }
    }

    ngOnDestroy() {
        this.closeDragBackdrop();
        this.dragRefs.forEach((dragRef) => dragRef.dispose());
        this.destroy$.next();
        this.destroy$.complete();
    }
}
