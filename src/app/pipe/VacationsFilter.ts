import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "moment";
import {Vacation} from "../model/Vacation";

@Pipe({
  name: 'vacationsFilter',
  pure: false
})
export class VacationsFilter implements PipeTransform {
  transform(items : Vacation[], filter : any): any {
    if (!items || !filter) {
      return items;
    }

    let monthsArr = filter.split(', ');
    let monthsNumbersArr: any[] = [];

    monthsArr.forEach((month: string | number) => {
      monthsNumbersArr.push(moment().month(month).format('MM'));
    });

    return items.filter(item => {
      return monthsNumbersArr.includes(moment(item.date_from).format('MM'));
    });
  }
}
