import { Component } from 'react';
import { Button, Icon, Tooltip, Modal, Popconfirm, Input, Radio } from 'antd';
import st from './Workers.less';

import { getWorkers, removeWorker, addToProject } from '../../services/Worker';
import WorkerForm from './WorkerForm';
import { success } from '../../utils/notification';

class Workers extends Component {
  state = {
    workers: [],
    showWorkerForm: false,
    keyword: '',
  };

  addToProject(w) {
    let { prjId, onAddToProject } = this.props;
    let { Id } = w;

    addToProject(prjId, Id, e => {
      success('添加至项目');
      onAddToProject && onAddToProject();
    });
  }

  filterWorkers() {
    let { keyword, category, workers } = this.state;
    let { prjId } = this.props;
    let nWorkers = keyword ? workers.filter(w => w.Name.indexOf(keyword) > -1) : workers;

    nWorkers = category
      ? nWorkers.filter(w => w.Department && w.Department.indexOf(category) > -1)
      : nWorkers;

    return nWorkers.map(w => {
      return (
        <div className={st.worker + ' ' + (w.Department ? st.y : '')}>
          {w.Name}
          {prjId ? (
            <Tooltip title="添加至项目">
              <Icon type="plus-square" onClick={e => this.addToProject(w)} />
            </Tooltip>
          ) : null}
        </div>
      );
    });
  }

  getWorkers() {
    getWorkers(d => {
      this.setState({ workers: d });
    });
  }

  showWorkerForm(id) {
    this.workerId = id;
    this.setState({ showWorkerForm: true });
  }

  closeWorkerForm() {
    this.setState({ showWorkerForm: false });
  }

  componentDidMount() {
    this.getWorkers();
  }

  removeWorker(id) {
    removeWorker(id, e => {
      this.getWorkers();
    });
  }

  render() {
    let { workers, showWorkerForm } = this.state;
    return (
      <div className={st.Workers}>
        <div>
          <Input.Search
            style={{ width: 200 }}
            placeholder="请输入姓名..."
            onSearch={e => {
              this.setState({ keyword: e });
            }}
          />
          &emsp;
          <Radio.Group defaultValue={null} onChange={e => this.setState({ category: e.target.value })}>
            <Radio value={null}>全部</Radio>
            <Radio value={'管理'}>管理</Radio>
            <Radio value={'规划'}>规划</Radio>
            <Radio value={'交通'}>交通</Radio>
            <Radio value={'海绵'}>海绵</Radio>
            <Radio value={'大数据'}>大数据</Radio>
          </Radio.Group>
          &emsp;
          <Button icon="plus" type="primary" onClick={e => this.showWorkerForm(undefined)}>
            新增人员
          </Button>
        </div>
        <div className={st.workerpanel}>{this.filterWorkers()}</div>
        <Modal
          destroyOnClose
          title={(this.workerId ? '修改' : '新增') + '人员'}
          visible={showWorkerForm}
          onCancel={this.closeWorkerForm.bind(this)}
          footer={null}
        >
          <WorkerForm
            id={this.workerId}
            saveSuccess={d => {
              this.closeWorkerForm();
              this.getWorkers();
            }}
            onCancel={this.closeWorkerForm.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

export default Workers;
