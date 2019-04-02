import { error } from '../utils/notification';
let baseUrl = 'api/project/';
let emptyfun = () => {};

function getProjects(paras, sf, ef = error) {
  $.post(
    baseUrl + 'GetProjects',
    paras,
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

function getProject(id, sf, ef = error) {
  $.post(
    baseUrl + 'GetProject',
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

function removeProject(id, sf, ef = error) {
  $.post(
    baseUrl + 'RemoveProject',
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

function saveProject(obj, sf, ef = error) {
  $.post(
    baseUrl + 'ModifyProject',
    { project: JSON.stringify(obj) },
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

function getProjectWorker(prjId, sf, ef = error) {
  $.post(
    baseUrl + 'GetProjectWorker',
    { prjId: prjId },
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

function saveProjectWorker(projectWorkers, sf, ef = error) {
  $.post(
    baseUrl + 'SaveProjectWorkers',
    { projectWorkers: projectWorkers },
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

export { getProjects, removeProject, getProject, saveProject, getProjectWorker, saveProjectWorker };
