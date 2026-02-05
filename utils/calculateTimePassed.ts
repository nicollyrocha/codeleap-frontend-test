export const calculateTimePassed = (createdDatetime: string): string => {
  const createdDate = new Date(createdDatetime);
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000,
  );
  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  for (const interval in intervals) {
    const intervalSeconds = intervals[interval];
    const count = Math.floor(diffInSeconds / intervalSeconds);
    if (count >= 1) {
      return `${count} ${interval}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};
