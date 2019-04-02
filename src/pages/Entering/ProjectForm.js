import { Component } from 'react';
import st from './ProjectForm.less';
import { Row, Col, Form, Input, DatePicker, Button, Select } from 'antd';
import { getProject, saveProject } from '../../services/Project';
import { success } from '../../utils/notification';

class ProjectForm extends Component {
  state = {
    project: {},
  };

  mObj = {};

  save() {
    console.log(this.mObj);
    let saveObj = {
      ...this.mObj,
      Id: this.props.id,
    };

    saveProject(saveObj, e => {
      success('保存成功！');
      this.mObj = {};
      this.setState({ project: e });
      this.props.saveSuccess && this.props.saveSuccess(e);
    });
  }

  getProject(id) {
    getProject(id, e => {
      this.setState({ project: e });
    });
  }

  componentDidMount() {
    let { id } = this.props;
    if (id) {
      this.getProject(id);
    }
  }

  render() {
    let { project } = this.state;
    return (
      <div className={st.ProjectForm}>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="项目名称">
              <Input
                onChange={e => (this.mObj.Name = e.target.value)}
                defaultValue={project.Name}
                placeholder="项目名称"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="项目金额">
              <Input
                onChange={e => {
                  this.mObj.ContractAmount = e.target.value;
                }}
                defaultValue={project.ContractAmount}
                placeholder="项目金额（元）"
                addonAfter="元"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="项目期限">
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <DatePicker
                  onChange={e => {
                    this.mObj.StartTime = e && e.format();
                    this.mObj.Year = e && e.year();
                    let { project } = this.state;
                    project.StartTime = e;
                    project.Year = e && e.year();
                    this.setState({});
                  }}
                  value={project.StartTime ? moment(project.StartTime) : undefined}
                  style={{ width: 170 }}
                  placeholder="起始时间"
                />
                ~
                <DatePicker
                  onChange={e => {
                    this.mObj.EndTime = e && e.format();
                    let { project } = this.state;
                    project.EndTime = e;
                    this.setState({});
                  }}
                  value={project.EndTime ? moment(project.EndTime) : undefined}
                  style={{ width: 170 }}
                  placeholder="结束时间"
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="研究中心">
              <Select
                style={{ width: '100%' }}
                value={project.Department}
                placeholder="所属研究中心"
                onChange={e => {
                  this.mObj.Department = e;
                  let { project } = this.state;
                  project.Department = e;
                  this.setState({});
                }}
              >
                <Select.Option key="大数据研究中心" value="大数据研究中心">
                  大数据研究中心
                </Select.Option>
                <Select.Option key="规划研究中心" value="规划研究中心">
                  规划研究中心
                </Select.Option>
                <Select.Option key="交通研究中心" value="交通研究中心">
                  交通研究中心
                </Select.Option>
                <Select.Option key="海绵城市研究中心" value="海绵城市研究中心">
                  海绵城市研究中心
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="项目编号">
              <Input
                onChange={e => (this.mObj.SerialNumber = e.target.value)}
                defaultValue={project.SerialNumber}
                placeholder="项目编号"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="决议书编号">
              <Input
                onChange={e => (this.mObj.ResolutionNumber = e.target.value)}
                defaultValue={project.ResolutionNumber}
                placeholder="决议书编号"
              />
            </Form.Item>
          </Col>
        </Row>
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

export default ProjectForm;
