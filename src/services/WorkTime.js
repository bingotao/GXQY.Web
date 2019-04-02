import { error } from '../utils/notification';
let baseUrl = 'api/worktime/';
let emptyfun = () => {};

function getWorkTime(prjId, year, month, sf, ef = error) {
  $.post(
    baseUrl + 'GetWorkTime',
    {
      prjId: prjId,
      year: year,
      month: month,
    },
    d => {
      if (d.ErrorMessage) {
        ef(d.ErrorMessage);
      } else {
        sf && sf(d.Data);
      }
    },
    'json'
  );
}

function getWorkTime2(prjId, year, month, sf, ef = error) {
  $.post(
    baseUrl + 'GetWorkTime2',
    {
      prjId: prjId,
      year: year,
      month: month,
    },
    d => {
      if (d.ErrorMessage) {
        ef(d.ErrorMessage);
      } else {
        sf && sf(d.Data);
      }
    },
    'json'
  );
}

function addWorkTime(prjId, wkId, date, sf, ef = error) {
  $.post(
    baseUrl + 'AddWorkTime',
    {
      prjId: prjId,
      wkId: wkId,
      date: date,
    },
    d => {
      if (d.ErrorMessage) {
        ef(d.ErrorMessage);
      } else {
        sf && sf(d.Data);
      }
    },
    'json'
  );
}

export { getWorkTime, addWorkTime, getWorkTime2 };
