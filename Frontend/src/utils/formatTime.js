import dayjs from "dayjs";

export const formatTime = (timeString) => {
  if (!timeString) return "";
  return dayjs(`2000-01-01 ${timeString}`).format("hh:mm A");
};
