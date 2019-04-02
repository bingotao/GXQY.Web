import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Input, Button, Row, Col } from 'antd';
import { getProjectWorker, saveProjectWorker } from '../../services/Project';
import { success } from '../../utils/notification';
import st from './ProjectWorkers.less';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? '#ccc' : '',
  ...draggableStyle,
});

class ProjectWorkers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  mObj = {};

  getData() {
    var { prjId } = this.props;
    if (prjId) {
      getProjectWorker(prjId, d => {
        this.setState({
          items: d.map(i => {
            i.id = i.ProjectId + i.WorkerId;
            return i;
          }),
        });
      });
    }
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(this.state.items, result.source.index, result.destination.index);

    for (let i = 0, j = items.length; i < j; i++) {
      let it = items[i];
      it.Index = i;
      this.mObj[it.ProjectId + it.WorkerId] = {
        ProjectId: it.ProjectId,
        WorkerId: it.WorkerId,
        ...this.mObj[it.ProjectId + it.WorkerId],
        Index: i,
      };
    }

    this.setState({
      items,
    });
  }

  saveProjectWorker() {
    let datas = [];
    for (let i in this.mObj) {
      datas.push(this.mObj[i]);
    }

    saveProjectWorker(datas, d => {
      this.mObj = {};
      success('保存成功');
      this.getData();
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    let { items } = this.state;

    return (
      <div className={st.ProjectWorkers}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={st.itemlist}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={st.item}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <Row>
                          <Col span={2}>{item.Index + 1}</Col>
                          <Col span={4}>{item.Name}</Col>
                          <Col span={18}>
                            <Input
                              defaultValue={item.ProjectRole}
                              placeholder="在项目中承担的角色或工作..."
                              onChange={e => {
                                this.mObj[item.ProjectId + item.WorkerId] = {
                                  WorkerId: item.WorkerId,
                                  ProjectId: item.ProjectId,
                                  ...this.mObj[item.ProjectId + item.WorkerId],
                                  ProjectRole: e.target.value,
                                };
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className={st.btns}>
          <span>* 拖动调整顺序</span>
          <div>
            <Button
              onClick={e => {
                this.saveProjectWorker();
              }}
              type="primary"
            >
              保存
            </Button>
            &emsp;
            <Button
              onClick={e => {
                this.props.onCloseBtnClick && this.props.onCloseBtnClick();
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectWorkers;
