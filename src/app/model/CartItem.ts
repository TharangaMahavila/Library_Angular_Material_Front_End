import {BookCustom} from "./BookCustom";

export interface CartItem{
    userId:string
    bookCustomEntity: BookCustom,
    requestedAt: Date,
    requestStatus: boolean
}
