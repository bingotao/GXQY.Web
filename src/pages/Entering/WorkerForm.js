import { Component } from 'react';
import { Button, Input } from 'antd';
import st from './WorkerForm.less';

import { getWorker, saveWorker } from '../../services/Worker';
import { success } from '../../utils/notification';

class WorkerForm extends Component {
  state = { worker: {} };
  mObj = {};
  save() {
    console.log(this.mObj);
    let saveObj = {
      ...this.mObj,
      Id: this.props.id,
    };

    saveWorker(saveObj, e => {
      success('保存成功！');
      this.mObj = {};
      this.setState({ worker: e });
      this.props.saveSuccess && this.props.saveSuccess(e);
    });
  }

  getWorker(id) {
    getWorker(id, e => {
      this.setState({ worker: e });
    });
  }

  componentDidMount() {
    let { id } = this.props;
    if (id) {
      this.getWorker(id);
    }
  }

  render() {
    let { worker } = this.state;
    return (
      <div className={st.WorkerForm}>
        <div>
          <label>姓名：</label>
          &emsp;
          <Input
            onChange={e => (this.mObj.Name = e.target.value)}
            defaultValue={worker.Name}
            style={{ width: 300 }}
            placeholder="姓名"
          />
        </div>
        <div>
          <Button type="primary" onClick={e => this.save()}>
            确定
          </Button>
          &emsp;
          <Button
            onClick={e => {
              this.props.onCancel && this.props.onCancel();
            }}
          >
            取消
          </Button>
        </div>
      </div>
    );
  }
}

export default WorkerForm;
