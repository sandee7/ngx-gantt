/*
 * <<licensetext>>
 */

import { InjectionToken } from '@angular/core';

export interface GanttDateFormat {
    week?: string;
    month?: string;
    quarter?: string;
    year?: string;
    yearMonth?: string;
    yearQuarter?: string;
}

export interface GanttGlobalConfig {
    dateFormat?: GanttDateFormat;
}

export const defaultConfig = {
    dateFormat: {
        week: 'w',
        month: 'M',
        quarter: 'QQQ',
        year: 'yyyy',
        yearMonth: 'yyyy.MM.',
        yearQuarter: 'yyyy-QQQ'
    }
};

export const GANTT_GLOBAL_CONFIG = new InjectionToken<GanttGlobalConfig>('GANTT_GLOBAL_CONFIG');
