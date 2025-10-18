// YES, I admit, this is AI generated. All credits to Claude Sonnet 4.5

import { FAANOTAM } from "../interfaces";

interface TimeRange {
  start: string; // HHmm format
  end: string;   // HHmm format
}

interface DateRange {
  month: number;
  days: number[];
  timeRanges: TimeRange[];
}

interface ParsedSchedule {
  isH24: boolean;
  isDaily: boolean;
  daysOfWeek?: string[];
  excludedDays?: string[];
  dateRanges: DateRange[];
}

//Well this is NOT AI, this is my doing
export function getItemD(notam:FAANOTAM){
    const dItemRegex = /D\)\s*([\s\S]*?)(?=\n[A-Z]\)|$)/;
    const match = notam.icaoMessage.match(dItemRegex);
    if (match) {
        console.log(match[1]); // OCT 15-16 20-23 0600-1000 1100-2100, 27-30 NOV 03-06 10-13
        return match[1]
    }
}

const MONTHS: { [key: string]: number } = {
  'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
  'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
};

const DAYS_OF_WEEK: { [key: string]: number } = {
  'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6
};

export function parseItemD(itemD: string): ParsedSchedule {
  const schedule: ParsedSchedule = {
    isH24: false,
    isDaily: false,
    dateRanges: []
  };

  // Check for H24 (24 hours)
  if (/H24|H-24/.test(itemD)) {
    schedule.isH24 = true;
    return schedule;
  }

  // Check for DAILY
  if (/DAILY/i.test(itemD)) {
    schedule.isDaily = true;
  }

  // Check for excluded days (EXC SAT SUN)
  const excMatch = itemD.match(/EXC\s+((?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:\s+(?:MON|TUE|WED|THU|FRI|SAT|SUN))*)/);
  if (excMatch) {
    schedule.excludedDays = excMatch[1].split(/\s+/);
    itemD = itemD.replace(excMatch[0], ''); // Remove EXC part for further parsing
  }

  // Extract time ranges first (before processing days)
  const timeMatches = itemD.match(/\b(\d{4})-(\d{4})\b/g);
  if (timeMatches) {
    schedule.dateRanges.push({
      month: -1, // Special case for day-of-week patterns
      days: [],
      timeRanges: timeMatches.map(tr => {
        const [start, end] = tr.split('-');
        return { start, end };
      })
    });
  }

  // Check for days of week (MON-FRI, SAT, etc.)
  const dowMatch = itemD.match(/(MON|TUE|WED|THU|FRI|SAT|SUN)-(MON|TUE|WED|THU|FRI|SAT|SUN)/);
  if (dowMatch) {
    schedule.daysOfWeek = expandDayRange(dowMatch[1], dowMatch[2]);
  } else {
    // Match single or multiple days: SAT, MON TUE, etc.
    const singleDowMatch = itemD.match(/\b(MON|TUE|WED|THU|FRI|SAT|SUN)(?:\s+(MON|TUE|WED|THU|FRI|SAT|SUN))*\b/);
    if (singleDowMatch) {
      schedule.daysOfWeek = singleDowMatch[0].split(/\s+/).filter(d => d.length > 0);
    }
  }

  // Parse date ranges with times
  // Pattern: OCT 15-16 20-23 0600-1000 1100-2100, 27-30 NOV 03-06
  const segments = itemD.split(',');
  
  let currentMonth: number | null = null;
  let currentTimeRanges: TimeRange[] = [];

  for (const segment of segments) {
    const trimmed = segment.trim();
    
    // Find month
    const monthMatch = trimmed.match(/\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/);
    if (monthMatch) {
      currentMonth = MONTHS[monthMatch[1]];
    }

    // Find date ranges (15-16, 20-23, etc.)
    const dateRanges = trimmed.match(/\b(\d{1,2})-(\d{1,2})\b/g);
    
    // Find time ranges (0600-2100, etc.)
    const timeMatches = trimmed.match(/\b(\d{4})-(\d{4})\b/g);
    if (timeMatches) {
      currentTimeRanges = timeMatches.map(tr => {
        const [start, end] = tr.split('-');
        return { start, end };
      });
    }

    if (dateRanges && currentMonth !== null) {
      for (const dateRange of dateRanges) {
        const [startDay, endDay] = dateRange.split('-').map(Number);
        const days = [];
        for (let d = startDay; d <= endDay; d++) {
          days.push(d);
        }
        
        schedule.dateRanges.push({
          month: currentMonth,
          days,
          timeRanges: [...currentTimeRanges]
        });
      }
    }
  }

  return schedule;
}

function expandDayRange(start: string, end: string): string[] {
  const startIdx = DAYS_OF_WEEK[start];
  const endIdx = DAYS_OF_WEEK[end];
  const days: string[] = [];
  
  for (let i = startIdx; i <= endIdx; i++) {
    days.push(Object.keys(DAYS_OF_WEEK).find(k => DAYS_OF_WEEK[k] === i)!);
  }
  
  return days;
}

// test date 2025-11-04T09:00:00.000Z
export function isNOTAMActive(schedule: ParsedSchedule, checkTime: Date = new Date()): boolean {
  // H24 is always active
  if (schedule.isH24) {
    return true;
  }

  const currentDay = checkTime.getDate();
  const currentMonth = checkTime.getMonth();
  const currentDayOfWeek = Object.keys(DAYS_OF_WEEK).find(
    k => DAYS_OF_WEEK[k] === checkTime.getDay()
  );
  const currentTime = checkTime.getHours() * 100 + checkTime.getMinutes();

  // Check excluded days
  if (schedule.excludedDays && currentDayOfWeek && schedule.excludedDays.includes(currentDayOfWeek)) {
    return false;
  }

  // Check days of week
  if (schedule.daysOfWeek && currentDayOfWeek) {
    if (!schedule.daysOfWeek.includes(currentDayOfWeek)) {
      return false;
    }
    
    // Check time ranges for day-of-week patterns
    for (const range of schedule.dateRanges) {
      if (range.month === -1) { // Day-of-week pattern
        for (const timeRange of range.timeRanges) {
          const start = parseInt(timeRange.start);
          const end = parseInt(timeRange.end);
          
          if (currentTime >= start && currentTime <= end) {
            return true;
          }
        }
        return false; // Time doesn't match
      }
    }
    
    return true; // Day matches, no time restriction
  }

  // If DAILY with time ranges but no specific dates, check time only
  if (schedule.isDaily && schedule.dateRanges.length === 0) {
    // Need to extract time from original if available
    return true; // Simplified - you'd need to parse time from DAILY pattern
  }

  // Check date ranges
  for (const range of schedule.dateRanges) {
    if (range.month === currentMonth && range.days.includes(currentDay)) {
      // Check if current time falls within any time range
      if (range.timeRanges.length === 0) {
        return true; // No time restriction
      }
      
      for (const timeRange of range.timeRanges) {
        const start = parseInt(timeRange.start);
        const end = parseInt(timeRange.end);
        
        if (currentTime >= start && currentTime <= end) {
          return true;
        }
      }
    }
  }

  return false;
}

export function notamActiveCheck(notam:FAANOTAM){
    const itemD = getItemD(notam)
    if(itemD === undefined){
        return
    }
    const parsedItemD = parseItemD(itemD)
    console.log(parsedItemD)
    const isActive = isNOTAMActive(parsedItemD)
    return isActive

}

// Example usage and testing
export function testNOTAMParser() {
  const examples = [
    "H24",
    "DAILY 0600-2200",
    "MON-FRI 0800-1700",
    "SAT 0900-1400",
    "DAILY 0600-2200 EXC SAT SUN",
    "OCT 15-16 20-23 0600-1000 1100-2100, 27-30 NOV 03-06 10-13 0700-1100 1200-2100"
  ];

  examples.forEach(example => {
    console.log('\n---');
    console.log('Item D:', example);
    const parsed = parseItemD(example);
    console.log('Parsed:', JSON.stringify(parsed, null, 2));
    console.log('Currently active:', isNOTAMActive(parsed));
  });
}