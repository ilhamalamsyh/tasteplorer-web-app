/**
 * Convert UTC timestamp to relative time format
 * - Less than 24 hours: "Xh" (e.g., "10h")
 * - 1-6 days: "Xd" (e.g., "2d")
 * - 7+ days: "Xw" (e.g., "1w", "50w")
 */
export const formatRelativeTime = (utcTimestamp: string): string => {
  const now = new Date();
  const past = new Date(utcTimestamp);
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - past.getTime();
  
  // Convert to different units
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  
  // Less than 1 hour
  if (diffMinutes < 60) {
    return diffMinutes <= 0 ? 'just now' : `${diffMinutes}m`;
  }
  
  // Less than 24 hours
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  
  // Less than 7 days
  if (diffDays < 7) {
    return `${diffDays}d`;
  }
  
  // 7 days or more
  return `${diffWeeks}w`;
};
