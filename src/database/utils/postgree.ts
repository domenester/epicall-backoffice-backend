import * as moment from "moment";

export const postgreeDateFormat = (date: any) => {
  return moment(date).format("YYYY/MM/DD HH:MM:SS");
}