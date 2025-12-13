import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string | number, prefix: string = '', suffix: string = ''): string {
    if (!value) return prefix + '' + suffix;

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return prefix + 'just now' + suffix;
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return prefix + (minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`) + suffix;
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return prefix + (hours === 1 ? '1 hour ago' : `${hours} hours ago`) + suffix;
    }
    if (seconds < 604800) {
      // less than 7 days
      const days = Math.floor(seconds / 86400);
      return prefix + (days === 1 ? '1 day ago' : `${days} days ago`) + suffix;
    }
    if (seconds < 2419200) {
      // less than 28 days
      const weeks = Math.floor(seconds / 604800);
      return prefix + (weeks === 1 ? '1 week ago' : `${weeks} weeks ago`) + suffix;
    }

    // For older dates, show full date
    return prefix + date.toLocaleDateString() + suffix;
  }
}
