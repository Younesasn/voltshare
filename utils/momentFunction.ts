import moment from "moment";

export const getDayOfWeek = (date: Date) => {
  return moment(date).format("dddd");
};
