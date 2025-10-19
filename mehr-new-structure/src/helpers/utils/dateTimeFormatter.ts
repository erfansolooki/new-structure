type DateInput = Date | string | number;

export interface IFormatOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  use24Hour?: boolean;
  includeTimezone?: boolean;
  locale?: string;
}

/**
 * Formats a date/time value according to specified options
 * @param date - Date object, ISO string, or timestamp
 * @param format - Format string or preset ('short', 'medium', 'long', 'full', 'time', 'date')
 * @param options - Additional formatting options
 * @returns Formatted date/time string
 */
export const formatDateTime = (
  date: DateInput,
  format: string = 'medium',
  options: IFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const {
    includeTime = true,
    includeSeconds = false,
    use24Hour = false,
    includeTimezone = false,
    locale = 'en-US',
  } = options;

  // Preset formats
  const presets: Record<string, Intl.DateTimeFormatOptions> = {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      ...(includeTime && { hour: 'numeric', minute: 'numeric' }),
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && { hour: 'numeric', minute: 'numeric' }),
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: 'numeric',
        minute: 'numeric',
        second: includeSeconds ? 'numeric' : undefined,
      }),
    },
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: 'numeric',
        minute: 'numeric',
        second: includeSeconds ? 'numeric' : undefined,
      }),
    },
    time: {
      hour: 'numeric',
      minute: 'numeric',
      second: includeSeconds ? 'numeric' : undefined,
    },
    date: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  };

  if (presets[format]) {
    const formatOptions: Intl.DateTimeFormatOptions = {
      ...presets[format],
      hour12: !use24Hour,
      ...(includeTimezone && { timeZoneName: 'short' }),
    };
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  }

  // Custom format string parsing (supports common tokens)
  const pad = (num: number, size: number = 2): string => num.toString().padStart(size, '0');

  const tokens: Record<string, string> = {
    YYYY: dateObj.getFullYear().toString(),
    YY: dateObj.getFullYear().toString().slice(-2),
    MMMM: dateObj.toLocaleString(locale, { month: 'long' }),
    MMM: dateObj.toLocaleString(locale, { month: 'short' }),
    MM: pad(dateObj.getMonth() + 1),
    M: (dateObj.getMonth() + 1).toString(),
    DD: pad(dateObj.getDate()),
    D: dateObj.getDate().toString(),
    dddd: dateObj.toLocaleString(locale, { weekday: 'long' }),
    ddd: dateObj.toLocaleString(locale, { weekday: 'short' }),
    HH: pad(dateObj.getHours()),
    H: dateObj.getHours().toString(),
    hh: pad(dateObj.getHours() % 12 || 12),
    h: (dateObj.getHours() % 12 || 12).toString(),
    mm: pad(dateObj.getMinutes()),
    m: dateObj.getMinutes().toString(),
    ss: pad(dateObj.getSeconds()),
    s: dateObj.getSeconds().toString(),
    A: dateObj.getHours() >= 12 ? 'PM' : 'AM',
    a: dateObj.getHours() >= 12 ? 'pm' : 'am',
  };

  let formatted = format;
  // Sort tokens by length (descending) to match longer tokens first
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);

  for (const token of sortedTokens) {
    formatted = formatted.replace(new RegExp(token, 'g'), tokens[token]);
  }

  return formatted;
};

/**
 * Formats a date to ISO string format
 */
export const toISOString = (date: DateInput): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toISOString();
};

/**
 * Formats a date to a relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: DateInput, locale: string = 'en-US'): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const [seconds, unit] of intervals) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      return rtf.format(diffInSeconds < 0 ? interval : -interval, unit);
    }
  }

  return rtf.format(0, 'second');
};

/**
 * Gets the start of a day for a given date
 */
export const getStartOfDay = (date: DateInput): Date => {
  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Gets the end of a day for a given date
 */
export const getEndOfDay = (date: DateInput): Date => {
  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Checks if a date is today
 */
export const isToday = (date: DateInput): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a date is in the past
 */
export const isPast = (date: DateInput): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.getTime() < Date.now();
};

/**
 * Checks if a date is in the future
 */
export const isFuture = (date: DateInput): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.getTime() > Date.now();
};
