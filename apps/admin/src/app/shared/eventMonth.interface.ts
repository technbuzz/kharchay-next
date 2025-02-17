import { IEvent } from "./event.interface";
export interface IEventMonth {
  name: string,
  id: string,
  date: Date,
  events: IEvent[]
}