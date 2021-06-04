import {Category} from "./Category";

export interface Book{
    bookId: string,
    englishName: string,
    sinhalaName: string,
    year: number,
    price: number,
    medium: string,
    pages: number,
    image: string,
    note: string,
    author: number,
    categories: Category[],
}
