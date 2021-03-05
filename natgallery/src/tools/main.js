import moment from 'moment';

export function GetAlbumDate(d1, d2) {

  // date
  let strDate1 = moment(d1).format('ll');
  let strDate2 = moment(d2).format('ll');

  if (strDate1 === strDate2) return strDate1;

  // month
  let mon1 = moment(d1).format('MMM');
  let mon2 = moment(d2).format('MMM');

  // year
  let year1 = moment(d1).format('YYYY');
  let year2 = moment(d2).format('YYYY');

  if (mon1 === mon2) {
    // remove year from 2nd string
    strDate2 = strDate2.replace(mon2 + " ", "");
  }

  if (year1 === year2) {
    // remove year from 1st string
    strDate1 = strDate1.replace(", " + year1, "");
  }

  return strDate1 + '-' + strDate2;
}