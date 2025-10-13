// Generated via prompt: prompts/date_format_standardization_v1.md
import dayjs from 'dayjs';

// Standard date formats for the project - DD/MM/YYYY
export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',                    // 15/01/2024
    DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',     // 15/01/2024 10:00
    DISPLAY_WITH_TIME_AMPM: 'DD/MM/YYYY h:mm A', // 15/01/2024 10:00 AM
    API: 'YYYY-MM-DD',                         // 2024-01-15
    API_DATETIME: 'YYYY-MM-DD HH:mm:ss',      // 2024-01-15 10:00:00
    API_DATETIME_TZ: 'YYYY-MM-DDTHH:mm:ss',   // 2024-01-15T10:00:00
    EXPORT: 'DD-MM-YYYY',                     // 15-01-2024
    EXPORT_WITH_TIME: 'DD-MM-YYYY HH-mm-ss'   // 15-01-2024 10-00-00
};

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (date: string | Date | dayjs.Dayjs): string => {
    if (!date) return '';
    return dayjs(date).format(DATE_FORMATS.DISPLAY);
};

/**
 * Format date with time to DD/MM/YYYY HH:mm
 */
export const formatDateTime = (date: string | Date | dayjs.Dayjs): string => {
    if (!date) return '';
    return dayjs(date).format(DATE_FORMATS.DISPLAY_WITH_TIME);
};

/**
 * Format date with time and AM/PM to DD/MM/YYYY h:mm A
 */
export const formatDateTimeWithAmPm = (date: string | Date | dayjs.Dayjs): string => {
    if (!date) return '';
    return dayjs(date).format(DATE_FORMATS.DISPLAY_WITH_TIME_AMPM);
};

/**
 * Format date for API calls (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: string | Date | dayjs.Dayjs): string => {
    if (!date) return '';
    return dayjs(date).format(DATE_FORMATS.API);
};

/**
 * Format datetime for API calls (YYYY-MM-DD HH:mm:ss)
 */
export const formatDateTimeForAPI = (date: string | Date | dayjs.Dayjs): string => {
    if (!date) return '';
    return dayjs(date).format(DATE_FORMATS.API_DATETIME);
};

/**
 * Format date for export files
 */
export const formatDateForExport = (date: string | Date | dayjs.Dayjs): string => {
    if (!date) return '';
    return dayjs(date).format(DATE_FORMATS.EXPORT);
};

/**
 * Format datetime for export files
 */
export const formatDateTimeForExport = (date: string | Date | dayjs.Dayjs): string => {
    if (!date) return '';
    return dayjs(date).format(DATE_FORMATS.EXPORT_WITH_TIME);
};

/**
 * Parse date string to dayjs object
 */
export const parseDate = (date: string | Date): dayjs.Dayjs => {
    return dayjs(date);
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: string | Date | dayjs.Dayjs): boolean => {
    if (!date) return false;
    return dayjs(date).isValid();
};

/**
 * Get current date in DD/MM/YYYY format
 */
export const getCurrentDate = (): string => {
    return dayjs().format(DATE_FORMATS.DISPLAY);
};

/**
 * Get current datetime in DD/MM/YYYY HH:mm format
 */
export const getCurrentDateTime = (): string => {
    return dayjs().format(DATE_FORMATS.DISPLAY_WITH_TIME);
};