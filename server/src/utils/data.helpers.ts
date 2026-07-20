
/**
 * Remove object entries with undefined value.
 * @param obj 
 * @returns fltrd
 */
export const sanitizeObject = (obj: Object) => {
  const fltrd = Object.fromEntries(
    Object.entries(obj).filter( ([_, value]) => value != undefined )
  );
  return fltrd;
}

/**
 * 
 * @param initDate 
 * @param interval 
 * Examples:
 * - "15s"   = 15 seconds
 * - "15min" = 15 minutes
 * - "2h"    = 2 hours
 * - "7d"    = 7 days
 * - "2w"    = 2 weeks
 * - "1m"    1 month
 */
export const getDateAfterInterval = (
  initDate: Date, 
  interval: string
) => {
  const dur = Number.parseInt(interval); 
  const unit = interval.toLowerCase().match(/^\d+(s|min|h|d|w|m|y)$/)?.[1];

  const multipliers = {
    s: 1000,
    min: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    m: 30 * 7 * 24 * 60 * 60 * 1000,
    y: 12 * 30 * 7 * 24 * 60 * 60 * 1000,
  } as const;

  let ms = dur * multipliers[unit as keyof typeof multipliers];

  return new Date( initDate.getTime() + ms );
}

export const injectPropertyIntoObjects = ( 
  arr: {}[], 
  pair: {} 
) => {
  let newArr = arr.map(f => ({ ...f, ...pair }));
  return newArr;
}

export const stringOrNull = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

