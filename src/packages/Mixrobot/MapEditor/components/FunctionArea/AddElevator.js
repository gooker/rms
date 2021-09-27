/* eslint-disable no-shadow */
import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Row, Form, Button, Divider, List, Select } from 'antd';
import update from 'immutability-helper';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import Input from '@/pages/MapTool/components/MapForm/MapInput';
import MenuIcon from '@/utils/MenuIcon';
import MapContext from '../MapContext';

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

class AddElevator extends Component {
  static contextType = MapContext;

  formRef = React.createRef();

  state = {
    isDouble: false, // 是否是双开门
    showReplace: true,
    logicAreaId: null,
  };

  gotoConfigPage = (item) => {
    const { id } = item;
    const isDouble = this.getDoorCount(id) === 2;
    this.setState({ showReplace: false, logicAreaId: id, isDouble }, () => {
      const { setFieldsValue } = this.formRef.current;
      setFieldsValue({ logicAreaId: id });
    });
  };

  addElevator = (allValues) => {
    const { dispatch, flag, elevatorList } = this.props;
    const { replaceCell, logicAreaId, innerCellId } = allValues;
    const innerMapping = {};
    for (let index = 0; index < replaceCell.length; index++) {
      const element = replaceCell[index];
      const { cellId } = element;
      innerMapping[innerCellId[index]] = cellId;
    }

    let currentElevator =
      elevatorList?.length === 0 ? { ...allValues, flag } : { ...elevatorList[flag - 1], flag };
    currentElevator = update(currentElevator, {
      logicLocations: {
        [logicAreaId]: {
          $set: {
            doors: allValues.doors,
            innerMapping,
          },
        },
      },
    });

    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'map', type: 'elevatorList', data: currentElevator },
    }).then((result) => {
      if (result.type === 'update') {
        const { pre, current } = result;
        pre && this.context.removeElevator(pre);
        current && this.context.renderElevator([current]);
        this.context.refresh();
      }
    });
  };

  getCurrentElevator = () => {
    const { flag, elevatorList } = this.props;
    let currentElevator = null;
    if (elevatorList.length >= flag) {
      currentElevator = elevatorList[flag - 1];
    }
    return currentElevator;
  };

  getDoorCount = (logicAreaId) => {
    const currentElevator = this.getCurrentElevator();
    return currentElevator?.logicLocations[logicAreaId]?.doors.length;
  };

  render() {
    const { selectCellIds, logicAreaList } = this.props;
    const { isDouble, showReplace, logicAreaId } = this.state;

    const currentElevator = this.getCurrentElevator();

    // 编辑 - 第一步
    if (showReplace) {
      return (
        <Row>
          {/* 返回 */}
          <Button
            type="primary"
            icon={MenuIcon.rollback}
            onClick={() => {
              const { cancel } = this.props;
              cancel && cancel();
            }}
          >
            <FormattedMessage id="app.workStationMap.back" />
          </Button>

          {/* 设置电梯 */}
          <div style={{ width: '100%' }}>
            <Divider orientation="left">
              <FormattedMessage id="app.addElevator.settingElevator" />
            </Divider>
          </div>

          {/* "电梯点" */}
          <Form.Item
            {...formLayout}
            style={{ width: '100%' }}
            label={formatMessage({ id: 'app.elevatorList.elevatorPoint' })}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              defaultValue={currentElevator?.innerCellId}
              onChange={(value) => {
                const { dispatch, flag } = this.props;
                dispatch({
                  type: 'editor/saveElevatorReplaceId',
                  payload: { value, flag },
                });
              }}
            />
          </Form.Item>

          {/* 进入配置页 */}
          <List
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            grid={{ gutter: 8, sm: 2 }}
            dataSource={logicAreaList}
            renderItem={(logicArea) => (
              <List.Item>
                <Button
                  icon={MenuIcon.setting}
                  style={{ width: '100px', height: '100px' }}
                  disabled={!currentElevator}
                  onClick={() => {
                    this.gotoConfigPage(logicArea);
                  }}
                >
                  {logicArea.name}
                </Button>
              </List.Item>
            )}
          />
        </Row>
      );
    }

    // 获取电梯点默认值, 其实就是原始地图点位
    const defaultInnerMapping = currentElevator?.logicLocations[logicAreaId]?.innerMapping ?? {};
    const originalCellId = defaultInnerMapping[currentElevator?.innerCellId];
    // 编辑 - 第二步
    return (
      <div style={{ width: '100%' }}>
        <div>
          {/* 返回 */}
          <Button
            icon={MenuIcon.rollback}
            onClick={() => {
              this.setState({ showReplace: true });
            }}
          >
            <FormattedMessage id="app.workStationMap.back" />
          </Button>

          {/* 确定 */}
          <Button
            type="primary"
            style={{ marginLeft: 20 }}
            onClick={() => {
              const { validateFields } = this.formRef.current;
              validateFields().then((allValues) => {
                this.addElevator(allValues);
              });
            }}
          >
            <FormattedMessage id="app.generateCode.sure" />
          </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Form ref={this.formRef}>
            <Form.Item hidden name={'logicAreaId'} />
            <Form.Item hidden name={'innerCellId'} initialValue={currentElevator?.innerCellId} />

            {/* 替换点 */}
            <Form.List name={'replaceCell'} initialValue={[{ cellId: originalCellId }]}>
              {(fields) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                    <Form.Item
                      key={key}
                      {...restField}
                      name={[name, 'cellId']}
                      fieldKey={[fieldKey, 'cellId']}
                      label={currentElevator?.innerCellId[index]}
                    >
                      <Input type="number" currentCellId={selectCellIds} />
                    </Form.Item>
                  ))}
                </>
              )}
            </Form.List>

            {/* 电梯门 */}
            <Form.List
              name={'doors'}
              initialValue={
                currentElevator &&
                currentElevator?.logicLocations &&
                currentElevator.logicLocations[logicAreaId]
                  ? currentElevator.logicLocations[logicAreaId]?.doors
                  : [{}]
              }
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        marginBottom: '20px',
                        padding: '24px 10px 0 10px',
                        borderRadius: '5px',
                        border: '1px solid #e0dcdc',
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'cellId']}
                        fieldKey={[fieldKey, 'cellId']}
                        label={formatMessage({ id: 'app.addElevator.entryPoint' })}
                      >
                        <Input type="number" currentCellId={selectCellIds} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'waitCellId']}
                        fieldKey={[fieldKey, 'waitCellId']}
                        label={formatMessage({ id: 'app.addElevator.waitingPoint' })}
                      >
                        <Input type="number" currentCellId={selectCellIds} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'leaveCellId']}
                        fieldKey={[fieldKey, 'leaveCellId']}
                        label={formatMessage({ id: 'app.addElevator.exitPoint' })}
                      >
                        <Input type="number" currentCellId={selectCellIds} />
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item>
                    {isDouble ? (
                      <Button
                        type="primary"
                        onClick={() => {
                          this.setState({ isDouble: false });
                          remove(fields[1]?.name);
                        }}
                        style={{ width: '100%' }}
                      >
                        <FormattedMessage id="app.addElevator.singleDoor" />
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => {
                          this.setState({ isDouble: true });
                          add();
                        }}
                        style={{ width: '100%' }}
                      >
                        <FormattedMessage id="app.addElevator.doubleDoor" />
                      </Button>
                    )}
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </div>
    );
  }
}
export default connect(({ editor }) => {
  const { currentMap, selectCells } = editor;
  const { elevatorList, logicAreaList } = currentMap;
  return { elevatorList, logicAreaList, selectCellIds: selectCells };
})(AddElevator);
