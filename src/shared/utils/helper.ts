export function parseDuration(duration: string): number {
  if (!duration) throw new Error('Invalid duration');

  const regex = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)?$/i;
  const match = duration.match(regex);

  if (!match) throw new Error('Invalid duration format');

  const value = parseFloat(match[1]);
  const unit = match[2]?.toLowerCase() || 'ms';

  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error('Unknown duration unit: ' + unit);
  }
}
