import { ScheduleData } from "./my-schedule.interface";

export interface TodaysBreakViewModel{
  providerId: number;
  dailyStartTime: string;
  dailyEndTime: string;
  myScheduleList: ScheduleData[];
  breakInfoList: BreakData[];
}

export interface BreakData {
  providerBreakId: number;
  providerId: number;
  startTime: string;
  endTime: string;
  breakDate: string;
}