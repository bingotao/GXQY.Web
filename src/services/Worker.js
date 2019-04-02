import { error } from '../utils/notification';
let baseUrl = 'api/worker/';
let emptyfun = () => {};

function getWorkers(sf, ef = error) {
  $.post(
    baseUrl + 'GetWorkers',
    null,
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

function getWorker(id, sf, ef = error) {
  $.post(
    baseUrl + 'GetWorker',
    { id: id },
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

function removeWorker(id, sf, ef = error) {
  $.post(
    baseUrl + 'RemoveWorker',
    { id: id },
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

function saveWorker(obj, sf, ef = error) {
  $.post(
    baseUrl + 'ModifyWorker',
    { worker: JSON.stringify(obj) },
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

function addToProject(prjId, id, sf, ef = error) {
  $.post(
    baseUrl + 'AddToProject',
    {
      prjId: prjId,
      wkId: id,
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

function removeWorkerFromProject(wkId, prjId, sf, ef = error) {
  $.post(
    baseUrl + 'RemoveWorkerFromProject',
    {
      prjId: prjId,
      wkId: wkId,
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

export { getWorkers, removeWorker, getWorker, saveWorker, addToProject, removeWorkerFromProject };
