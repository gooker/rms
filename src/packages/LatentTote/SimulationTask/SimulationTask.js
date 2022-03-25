import React, { memo, useState } from 'react';
import { Tooltip, Badge, Row, Col, Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import LabelComponent from '@/components/LabelComponent';
import { formatMessage, isStrictNull } from '@/utils/util';
import commonStyles from '@/common.module.less';

const StatusColor = {
  START: '0x00FFFF', // 亮蓝色
  STOP: '0xFF0000', // 红色
};

const SimulationTask = (props) => {
  const { allTaskTypes, agvType } = props;
  const [loading, setLoading] = useState(false);
  const [addVisible, setAddVisible] = useState(false);

  const [selectRowKey, setSelectRowKey] = useState([]);

  function checkDetail(taskId) {
    const { dispatch, agvType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, agvType },
    });
  }

  function deleteTask(){

  }

  const columns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'id',
      align: 'center',
      width: 100,
      render: (text) => {
        return (
          <Tooltip title={text}>
            <span
              className={commonStyles.textLinks}
              onClick={() => {
                checkDetail(text);
              }}
            >
              {text ? '*' + text.substr(text.length - 6, 6) : null}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="app.task.state" />,
      dataIndex: 'callStatus',
      align: 'center',
      width: 120,
      render: (text) => {
        if (text != null) {
          return (
            <Badge
              status={StatusColor[text]}
              text={formatMessage({ id: `app.simulateTask.state.${text}` })}
            />
          );
        } else {
          return <FormattedMessage id="app.taskDetail.notAvailable" />;
        }
      },
    },

    {
      title: <FormattedMessage id="app.simulateTask.callType" />,
      dataIndex: 'callType',
      align: 'center',
      width: 150,
      render: (text) => formatMessage({ id: `app.simulateTask.type.${text}` }),
    },

    {
      title: <FormattedMessage id="app.task.type" />,
      dataIndex: 'toteTaskType',
      align: 'center',
      width: 150,
      render: (text) => {
        return allTaskTypes?.[agvType]?.[text] || text;
      },
    },
  ];

  const expandColumns = [
    {
      title: <FormattedMessage id="app.simulateTask.priority.list" />,
      dataIndex: 'priorities',
      render: (text) => {
        if (isStrictNull(text)) return '-';
        const content = text.toString();
        return content || '';
      },
    },
    {
      title: <FormattedMessage id="app.map.workStation" />,
      dataIndex: 'workStationCodes',
      render: (text) => {
        if (isStrictNull(text)) return '-';
        const content = text.toString();
        return content || '';
      },
    },
    {
      title: <FormattedMessage id="app.pod" />,
      dataIndex: 'appointPodIds',
      render: (text) => {
        if (isStrictNull(text)) return '-';
        const content = text.toString();
        return content || '';
      },
    },
    {
      title: <FormattedMessage id="app.pod.direction" />,
      dataIndex: 'appointPodFaces',
      render: (text) => {
        if (isStrictNull(text)) return '-';
        const content = text.toString();
        return content || '';
      },
    },
    {
      title: <FormattedMessage id="app.simulateTask.total" />,
      dataIndex: 'stationOrderTaskTotalNum',
    },
    {
      title: <FormattedMessage id="app.simulateTask.maxTask" />,
      dataIndex: 'stationMaxOrderTaskNum',
    },
    {
      title: <FormattedMessage id="app.simulateTask.pod.maxTask" />,
      dataIndex: 'podFaceMaxOrderTaskNum',
    },
    {
      title: <FormattedMessage id="app.simulateTask.generateInterval" />,
      dataIndex: 'taskGenerateIntervalMill',
    },
  ];

  function expandedRowRender(currentItemData) {
    if (currentItemData) {
      return (
        <>
          {currentItemData.map((record) => {
            <Row>
              {expandColumns.map(({ title, dataIndex, render }, index) => (
                <Col key={index} span={12}>
                  <LabelComponent label={title} color={'#000'}>
                    {typeof render === 'function'
                      ? render(record[dataIndex], record)
                      : record[dataIndex]}
                  </LabelComponent>
                </Col>
              ))}
            </Row>;
          })}
        </>
      );
    }
  }

  return (
    <TablePageWrapper>
      <Row>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          {/* 新增 */}
          <Button
            type="primary"
            onClick={() => {
              setAddVisible(true)
            }}
          >
            <PlusOutlined /> <FormattedMessage id="app.button.add" />
          </Button>

          {/* 编辑 */}
          <Button
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              setAddVisible(true)
            }}
          >
            <EditOutlined /> <FormattedMessage id="app.button.edit" />
          </Button>

          {/* 删除 */}
          <Button danger disabled={selectRowKey.length !== 1} onClick={deleteTask}>
            <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
          </Button>
        </Col>
        <Col>
          <Button>
            <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      <TableWithPages
        bordered
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={[]}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectRowKey,
          onChange: (selectRowKey, selectRow) => {
            setSelectRowKey(selectRowKey);
          },
        }}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record?.workStationCallParms),
        }}
      />
    </TablePageWrapper>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(SimulationTask));
