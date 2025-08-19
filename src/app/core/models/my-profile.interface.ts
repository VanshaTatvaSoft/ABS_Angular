export interface MyProfileInterface{
  userId: number,
  name: string,
  phoneNo: string,
  isProvider: boolean,
  isAvailable: boolean,
  profileImageUrl?: string,
  startTime: string,
  endTime: string,
  canNotEditTime: boolean
}