import { Component } from 'react';
import {
  Table,
  Form,
  Tooltip,
  Select,
  Input,
  Button,
  DatePicker,
  Modal,
  Popconfirm,
  Icon,
  Popover,
  Radio,
} from 'antd';

import st from './Entering.less';

import { getProjects, removeProject } from '../../services/Project';
import { getWorkTime, getWorkTime2, addWorkTime } from '../../services/WorkTime';
import { removeWorkerFromProject } from '../../services/Worker';
import { warn, success } from '../../utils/notification';

import ProjectForm from './ProjectForm';
import Workers from './Workers';
import ProjectWorkers from './ProjectWorkers';

let { MonthPicker } = DatePicker;
let FormItem = Form.Item;

class Entering extends Component {
  columns = [
    {
      key: 'Index',
      dataIndex: 'Index',
      width: 80,
      align: 'center',
      title: '序号',
    },
    {
      key: 'WorkName',
      dataIndex: 'WorkerName',
      width: 140,
      align: 'center',
      title: '姓名',
      render: (text, record, index) => {
        return (
          <div>
            {text}
            &emsp;
            {record.WorkerId != 'HJ' && (
              <span>
                <Popconfirm
                  title="确定从项目中移除该人员？"
                  onConfirm={e => this.removeWorkerFromProject(record.WorkerId)}
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                >
                  <Button size="small" type="primary" shape="circle" icon="minus" />
                </Popconfirm>
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'ProjectRole',
      dataIndex: 'ProjectRole',
      width: 180,
      align: 'center',
      title: '项目角色',
    },
    {
      key: 'KQ',
      dataIndex: 'KQ',
      align: 'center',
      title: (
        <div className={st.kqtitle}>
          考勤&emsp;&emsp;
          <div className={st.legend}>
            <div className="gzr" />
            工作日&emsp;
            <div className="jjr" />
            节假日&emsp;
            <div className="dq" />
            当前项目&emsp;
            <div className="qt" />
            其他项目
          </div>
        </div>
      ),
      render: (text, record, index) => {
        let { Name, Id } = this.state.project;
        let { WorkerId, WorkTime } = record;
        let getType = e => {
          if (e === Name) return 'dq';
          switch (e) {
            case '工作日':
              return 'gzr';
            case '节假日':
              return 'jjr';
            default:
              return 'qt';
          }
        };

        return (
          <div className={st.cellcontainer}>
            {WorkTime &&
              WorkTime.map(wt => {
                let pPanel = (
                  <div>
                    <Radio.Group
                      defaultValue={wt.ProjectId}
                      onChange={e => this.addWork(e.target.value, WorkerId, wt.Date)}
                    >
                      {record.Projects.map(e => (
                        <Radio
                          style={{
                            display: 'block',
                            height: '30px',
                            lineHeight: '30px',
                          }}
                          value={e.ProjectId}
                        >
                          {e.ProjectName}({e.StartTime || '无'} - {e.EndTime || '无'})
                        </Radio>
                      ))}
                      <Radio
                        style={{
                          display: 'block',
                          height: '30px',
                          lineHeight: '30px',
                        }}
                        value={null}
                      >
                        无
                      </Radio>
                    </Radio.Group>
                  </div>
                );
                return (
                  <Popover title={wt.Type} content={pPanel} trigger="click">
                    <div className={getType(wt.Type)}>{wt.Date2}</div>
                  </Popover>
                );
              })}
          </div>
        );
      },
    },
    {
      key: 'Workday',
      dataIndex: 'Workday',
      width: 160,
      align: 'center',
      title: (
        <div>
          天数
          <br />
          <div style={{ fontSize: '12px' }}>（本项目/科研/总）</div>
        </div>
      ),
      render: (text, record, index) => {
        return (
          <div className="gs">
            {record.PResearchDay || 0}/{record.ResearchDay || 0}/
            {(record.Workday || 0) + (record.ResearchDay || 0)}
          </div>
        );
      },
    },
    {
      key: 'BasePay',
      dataIndex: 'BasePay',
      width: 240,
      align: 'center',
      title: (
        <div>
          劳务费用
          <div style={{ fontSize: '12px' }}>（本项目/科研/总）</div>
        </div>
      ),
      render: (text, record, index) => {
        return (
          <div className="gz">
            <div>
              <span>绩效：</span>
              <span>
                {parseInt(record.PBonus || 0)}/{parseInt(record.Bonus_R || 0)}/
                {parseInt(record.Bonus || 0)}
              </span>
            </div>
            <div>
              <span>工资：</span>
              <span>
                {parseInt(record.PBasePay || 0)}/{parseInt(record.BasePay_R || 0)}/
                {parseInt(record.BasePay || 0)}
              </span>
            </div>
            <div>
              <span>公积：</span>
              <span>
                {parseInt(record.PAccumulationFund || 0)}/{parseInt(record.AccumulationFund_R || 0)}
                /{parseInt(record.AccumulationFund || 0)}
              </span>
            </div>
            <div>
              <span>社保：</span>
              <span>
                {parseInt(record.PSocialSecurity || 0)}/{parseInt(record.SocialSecurity_R || 0)}/
                {parseInt(record.SocialSecurity || 0)}
              </span>
            </div>
          </div>
        );
      },
    },
    /*
    {
      key: 'Workday',
      dataIndex: 'Workday',
      width: 100,
      align: 'center',
      title: '生产天数',
    },
    {
      key: 'ResearchDay',
      dataIndex: 'ResearchDay',
      width: 100,
      align: 'center',
      title: '科研天数',
      render: (text, record, index) => {
        return (
          <div className="gz">
            <div>
              <span>合计：</span>
              <span> {record.ResearchDay || 0}</span>
            </div>
            <div>
              <span>本项目：</span>
              <span>{record.PResearchDay || 0}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'BasePay',
      dataIndex: 'BasePay',
      width: 200,
      align: 'center',
      title: '基本工资',
      render: (text, record, index) => {
        return (
          <div className="gz">
            <div>
              <span>当月工资：</span>
              <span>{(record.BasePay || 0).toFixed(2)}</span>
            </div>
            <div>
              <span>生产合计：</span>
              <span>{(record.BasePay_W || 0).toFixed(2)}</span>
            </div>
            <div>
              <span>科研合计：</span>
              <span>{(record.BasePay_R || 0).toFixed(2)}</span>
            </div>
            <div>
              <span>项目科研：</span>
              <span>{(record.PBasePay || 0).toFixed(2)}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'Bonus',
      dataIndex: 'Bonus',
      width: 200,
      align: 'center',
      title: '绩效工资',
      render: (text, record, index) => {
        return (
          <div className="gz">
            <div>
              <span>当月绩效：</span>
              <span>{(record.Bonus || 0).toFixed(2)}</span>
            </div>
            <div>
              <span>生产合计：</span>
              <span>{(record.Bonus_W || 0).toFixed(2)}</span>
            </div>
            <div>
              <span>科研合计：</span>
              <span>{(record.Bonus_R || 0).toFixed(2)}</span>
            </div>
            <div>
              <span>项目科研：</span>
              <span>{(record.PBonus || 0).toFixed(2)}</span>
            </div>
          </div>
        );
      },
    },*/
  ];

  state = {
    projects: [],
    prjState: '进行中',
    projectInfo: null,
    project: null,
    showProjectForm: false,
    showWorkers: false,
    year: moment()
      .subtract(1, 'month')
      .year(),
    month: moment()
      .subtract(1, 'month')
      .month(),
    showProjectRole: false,
  };

  showProjectRoleForm(record) {
    let { project } = this.state;
    this.setState({ showProjectRole: true });
    console.log(project);
  }

  removeWorkerFromProject(wkId) {
    let { Id } = this.state.project;
    removeWorkerFromProject(wkId, Id, e => {
      success('成功移除该人员！');
      this.refreshTable();
    });
  }

  addWork(prjId, wkId, date) {
    addWorkTime(prjId, wkId, date, e => {
      success('修改成功！');
      this.refreshTable();
    });
  }

  showProjectForm(id) {
    this.prjId = id;
    this.setState({ showProjectForm: true });
  }

  closeProjectForm() {
    this.setState({ showProjectForm: false });
  }

  showWorkers() {
    this.setState({ showWorkers: true });
  }

  closeWorkers() {
    this.setState({ showWorkers: false });
  }

  getProjects() {
    let { prjState, year, month } = this.state;
    getProjects({ prjState: prjState, month: year * 100 + month + 1 }, e => {
      this.setState({ projects: e });
    });
  }

  removeProject() {
    let { project } = this.state;
    if (project) {
      removeProject(project.Id, e => {
        this.setState({ project: null });
        this.getProjects();
      });
    } else {
      warn('尚未选择任何项目！');
    }
  }

  refreshTable() {
    let { Id } = this.state.project;
    let { year, month } = this.state;
    if (Id && year) {
      getWorkTime2(Id, year, month + 1, e => {
        this.setState({
          projectInfo: e.Project,
          rows: e.WorkMonth
            ? e.WorkMonth.map((i, idx) => {
                i.idx = idx + 1;
                i.Index += 1;
                i.key = i.WorkerId;
                return i;
              })
            : [],
        });
      });
    }
  }
  getProjectInfo() {
    let total = 0;
    let { projectInfo, project } = this.state;
    projectInfo.map(i => {
      total += i.BasePay_R + i.Bonus_R + i.AccumulationFund_R + i.SocialSecurity_R;
    });

    return (
      <div className="projectinfo">
        <div>
          <div>总金额</div>
          <div>剩余</div>
        </div>
        <div>
          <div>{((project.ContractAmount || 0) / 10000).toFixed(2)}</div>
          <div>{(((project.ContractAmount || 0) - total) / 10000).toFixed(2)}</div>
        </div>
        <div>
          <div>月份</div>
          <div>金额</div>
        </div>
        {projectInfo.map(i => {
          return (
            <div>
              <div>{i.Month}</div>
              <div>
                {(
                  ((i.BasePay_R || 0) +
                    (i.Bonus_R || 0) +
                    (i.AccumulationFund_R || 0) +
                    (i.SocialSecurity_R || 0)) /
                  10000
                ).toFixed(2)}
              </div>
            </div>
          );
        })}
        <div>
          <div>合计</div>
          <div>{(total / 10000).toFixed(2)}</div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getProjects();
  }

  render() {
    let {
      projects,
      project,
      prjState,
      projectInfo,
      showProjectForm,
      showWorkers,
      year,
      month,
      rows,
      showProjectRole,
    } = this.state;
    return (
      <div className={st.Entering}>
        <div className={st.project}>
          <Select
            value={prjState}
            style={{ width: '100px' }}
            placeholder="项目状态"
            onChange={e => {
              this.setState(
                { prjState: e, projects: [], project: null },
                this.getProjects.bind(this)
              );
            }}
          >
            <Select.Option value={'进行中'} key={'进行中'}>
              进行中
            </Select.Option>
            <Select.Option value={'已结束'} key={'已结束'}>
              已结束
            </Select.Option>
          </Select>
          &ensp;
          <Select
            showSearch
            value={
              project
                ? `[${project.Year}-${project.SerialNumber}]${project.Name}(${project.StartTime ||
                    '无'}-${project.EndTime || '无'})`
                : undefined
            }
            onChange={(e, o) => {
              this.setState({ projectInfo: null, project: o.props.prj, rows: [] });
            }}
            style={{ width: '500px' }}
            placeholder="请选择科研项目..."
          >
            {projects.map(e => {
              let name = `[${e.Year}-${e.SerialNumber}]${e.Name}(${e.StartTime ||
                '无'}-${e.EndTime || '无'})`;
              return (
                <Select.Option prj={e} value={name} key={e.Id}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>
          &ensp;
          <MonthPicker
            allowClear={false}
            placeholder="考勤月份"
            defaultValue={moment().subtract(1, 'month')}
            onChange={e => {
              this.setState(
                {
                  rows: [],
                  projectInfo: null,
                  year: e ? e.year() : null,
                  month: e ? e.month() : null,
                },
                this.getProjects.bind(this)
              );
            }}
          />
          &ensp;
          <Button
            disabled={!((year || month) && project)}
            icon="reload"
            type="primary"
            onClick={this.refreshTable.bind(this)}
          >
            刷新表格
          </Button>
          &ensp;
          <Button
            icon="plus"
            type="primary"
            onClick={e => {
              this.showProjectForm();
            }}
          >
            新增项目
          </Button>
          &ensp;
          <Button
            icon="edit"
            type="primary"
            disabled={!project}
            onClick={e => {
              let { project } = this.state;
              if (project) {
                this.showProjectForm(project.Id);
              } else {
                warn('请选择要修改的项目！');
              }
            }}
          >
            修改项目
          </Button>
          &ensp;
          <Button
            disabled={!project}
            icon="usergroup-add"
            type="primary"
            onClick={e => this.showWorkers()}
          >
            添加项目人员
          </Button>
          &ensp;
          <Button
            disabled={!project}
            onClick={e => this.showProjectRoleForm()}
            type="primary"
            icon="edit"
          >
            人员角色
          </Button>
          &ensp;
          <Popover
            content={
              <div className={st.exportBtns}>
                <Button
                  disabled={!(year || month) || !project}
                  icon="export"
                  type="primary"
                  onClick={e => {
                    let { year, month } = this.state;
                    let { project } = this.state;
                    window.open(
                      `api/Export/DownloadProjectMonthTable2?prjid=${project.Id}&month=${year *
                        100 +
                        month +
                        1}`
                    );
                  }}
                >
                  导出项目科研费用（绩效）
                </Button>
                <br />
                <Button
                  disabled={!(year || month) || !project}
                  icon="export"
                  type="primary"
                  onClick={e => {
                    let { year, month } = this.state;
                    let { project } = this.state;
                    window.open(
                      `api/Export/DownloadProjectMonthTable1?prjid=${project.Id}&month=${year *
                        100 +
                        month +
                        1}`
                    );
                  }}
                >
                  导出项目科研费用（工资、公积金、社保）
                </Button>
                <br />
                <Button
                  disabled={!(year || month)}
                  icon="export"
                  type="primary"
                  onClick={e => {
                    let { year, month } = this.state;

                    window.open(`api/Export/DownloadMonthTable2?&month=${year * 100 + month + 1}`);
                  }}
                >
                  导出月度人员科研费用（绩效）
                </Button>
                <br />
                <Button
                  disabled={!(year || month)}
                  icon="export"
                  type="primary"
                  onClick={e => {
                    let { year, month } = this.state;

                    window.open(`api/Export/DownloadMonthTable1?&month=${year * 100 + month + 1}`);
                  }}
                >
                  导出月度人员科研费用（工资、公积金、社保）
                </Button>
                <br />
                <Button
                  disabled={!(year || month)}
                  icon="export"
                  type="primary"
                  onClick={e => {
                    let { year, month } = this.state;
                    window.open(
                      `api/Export/DownloadMaintainProjects?&month=${year * 100 + month + 1}`
                    );
                  }}
                >
                  导出项目存续表
                </Button>
                <br />
              </div>
            }
          >
            <Button icon="export">导出</Button>
          </Popover>
        </div>
        {projectInfo ? this.getProjectInfo() : null}

        <div className={st.table}>
          <Table pagination={false} columns={this.columns} bordered dataSource={rows} />
        </div>
        <Modal
          destroyOnClose
          title={(this.prjId ? '修改' : '新增') + '项目'}
          visible={showProjectForm}
          onCancel={this.closeProjectForm.bind(this)}
          footer={null}
        >
          <ProjectForm
            id={this.prjId}
            saveSuccess={d => {
              this.prjId && this.setState({ project: d });
              this.getProjects();
            }}
            onCancel={this.closeProjectForm.bind(this)}
          />
        </Modal>
        <Modal
          destroyOnClose
          title={'人员管理'}
          visible={showWorkers}
          onCancel={this.closeWorkers.bind(this)}
          footer={null}
          width={1000}
        >
          <Workers prjId={project && project.Id} onAddToProject={this.refreshTable.bind(this)} />
        </Modal>
        <Modal
          destroyOnClose
          title={'人员角色'}
          visible={showProjectRole}
          onCancel={e => {
            this.setState({ showProjectRole: false });
          }}
          footer={null}
          width={800}
        >
          {showProjectRole ? (
            <ProjectWorkers
              onCloseBtnClick={e => {
                this.setState({ showProjectRole: false });
              }}
              prjId={project && project.Id}
            />
          ) : null}
        </Modal>
      </div>
    );
  }
}

export default Entering;
