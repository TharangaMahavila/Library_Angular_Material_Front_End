import {Grade} from "./Grade";

export interface Student {
  regNo: string,
  initial: string,
  fname: string,
  lname: string,
  guardianName: string,
  streetNo: string,
  firstStreet: string,
  secondStreet: string,
  town: string,
  gender: string,
  contact: string,
  active: boolean,
  role: string,
  image: string,
  grades: Grade[]
}
