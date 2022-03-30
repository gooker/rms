import React, { memo, useState, useEffect } from 'react';
import { Tooltip, Tag, Row, Col, Button, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import {
  deleteSimulationTasks,
  fetchAllSimulationTasks,
  updateSimulationTask,
} from '@/services/latentTote';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import LabelComponent from '@/components/LabelComponent';
import { formatMessage, isStrictNull, isNull, dealResponse } from '@/utils/util';
import SimulationTaskComponent from './SimulationTaskComponent';
import commonStyles from '@/common.module.less';
import style from './simulationTask.module.less';

const taskList = [
  {
    id: '121212',
    callStatus: 'START',
    toteTaskType: 'TRANSPORT_IN ',
    callType: 'Auto',
    copySimulationId: '1222212121221',
    workStationCallParms: [
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
    ],
  },
  {
    id: '121213',
    callStatus: 'STOP',
    toteTaskType: 'TRANSPORT_IN ',
    callType: 'Auto',
    copySimulationId: '1222212121221',
    workStationCallParms: [
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
    ],
  },
  {
    id: '121214',
    callStatus: 'STOP',
    toteTaskType: 'TRANSPORT_IN ',
    callType: 'Auto',
    copySimulationId: '1222212121221',
    workStationCallParms: [
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
    ],
    laToteSimulationTaskRecords: [
      {
        createTime: '2022-03-28 16:47:27',
        endTime: '2022-03-28 16:47:27',
      },
    ],
  },
  {
    id: '121215',
    callStatus: 'RETRY',
    toteTaskType: 'TRANSPORT_IN ',
    callType: 'Auto',
    copySimulationId: '1222212121221',
    workStationCallParms: [
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
      {
        priorities: [1, 2],
        workStationCodes: ['1', '2'],
        stationOrderTaskTotalNum: 3,
        stationMaxOrderTaskNum: 3,
        podFaceMaxOrderTaskNum: 3,
        appointPodIds: ['12', '23', '32'],
        appointPodFaces: ['A', 'C'],
        taskGenerateIntervalMill: '3000L',
      },
    ],
    laToteSimulationTaskRecords: [
      {
        createTime: '2022-03-28 16:47:27',
        endTime: '2022-03-28 16:47:27',
      },
    ],
  },
];

const SimulationTask = (props) => {
  const { allTaskTypes, agvType } = props;
  const [loading, setLoading] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);

  const [selectRowKey, setSelectRowKey] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    setDataList(taskList);
  }, []);

  function checkDetail(taskId) {
    const { dispatch, agvType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, agvType },
    });
  }

  async function getData() {
    setLoading(true);
    const response = await fetchAllSimulationTasks();
    if (!dealResponse(response)) {
      setDataList(response);
    }
    setLoading(false);
  }

  async function statusSwitch(params) {
    const updateRes = await updateSimulationTask(params);
    if (!dealResponse(updateRes)) {
      getData();
    }
  }

  async function deleteTask(flag, id) {
    let ids = [];
    if (flag) {
      ids = selectRowKey;
    } else {
      ids = [id];
    }
    const response = await deleteSimulationTasks(ids.toString());
    if (!dealResponse(response)) {
      getData();
    }
  }

  function editRow(record) {
    setAddVisible(true);
    setUpdateRecord(record);
  }

  const columns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'id',
      align: 'center',

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
      title: <FormattedMessage id="app.simulateTask.callType" />,
      dataIndex: 'callType',
      align: 'center',

      render: (text) => formatMessage({ id: `app.simulateTask.type.${text}` }),
    },

    {
      title: <FormattedMessage id="app.task.type" />,
      dataIndex: 'toteTaskType',
      align: 'center',

      render: (text) => {
        return allTaskTypes?.[agvType]?.[text] || text;
      },
    },
    {
      title: <FormattedMessage id="app.task.state" />,
      dataIndex: 'callStatus',
      align: 'center',
      render: (text, record) => {
        if (text != null) {
          return <Tag>{text}</Tag>;
        } else {
          return <FormattedMessage id="app.taskDetail.notAvailable" />;
        }
      },
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <div className={style.operateContent}>
          {record.callStatus !== 'START' && record.callStatus !== 'RETRY' && (
            <EditOutlined
              onClick={() => {
                editRow(record);
              }}
            />
          )}
          {record.callStatus === 'STOP' && (
            <DeleteOutlined
              onClick={() => {
                deleteTask(false, record.id);
              }}
            />
          )}

          {record.callStatus !== 'STOP' && (
            <Button
              size={'small'}
              type="link"
              onClick={() => {
                statusSwitch({ ...record, callStatus: 'STOP' });
              }}
            >
              <FormattedMessage id="app.simulateTask.state.STOP" />
            </Button>
          )}

          {record.laToteSimulationTaskRecords?.length > 0 && record.callStatus === 'STOP' && (
            <Button
              size={'small'}
              type="link"
              onClick={() => {
                statusSwitch({ ...record, callStatus: 'RETRY' });
              }}
            >
              <FormattedMessage id="app.taskDetail.restart" />
            </Button>
          )}
          {record.laToteSimulationTaskRecords?.length === 0 && (
            <Button
              size={'small'}
              type="link"
              onClick={() => {
                statusSwitch({ ...record, callStatus: 'START' });
              }}
            >
              <FormattedMessage id="app.simulateTask.state.START" />
            </Button>
          )}
        </div>
      ),
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
    return (
      <>
        {currentItemData.map((record, i) => {
          return (
            <>
              <Row style={{ margin: 10, borderBottom: '1px solid #f5efef', color: '#625f5f' }}>
                {expandColumns.map(({ title, dataIndex, render }, index) => (
                  <Col key={index} flex="auto">
                    <LabelComponent label={title} color={'#625f5f'}>
                      {typeof render === 'function'
                        ? render(record[dataIndex], record)
                        : record[dataIndex]}
                    </LabelComponent>
                  </Col>
                ))}
              </Row>
            </>
          );
        })}
      </>
    );
  }

  return (
    <TablePageWrapper>
      <Row>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          {/* 新增模拟配置 */}
          <Button
            type="primary"
            onClick={() => {
              setAddVisible(true);
              setUpdateRecord(null);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="app.simulateTask.config" />
          </Button>

          {/* 删除 */}
          <Button danger disabled={selectRowKey.length !== 1} onClick={deleteTask}>
            <DeleteOutlined /> <FormattedMessage id="app.simulateTask.batchDelete" />
          </Button>

          <Button onClick={getData}>
            <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      <TableWithPages
        bordered
        columns={columns}
        rowKey={({ id }) => id}
        dataSource={dataList}
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

      {addVisible && (
        <SimulationTaskComponent
          visible={addVisible}
          updateRecord={updateRecord}
          onClose={() => {
            setAddVisible(false);
          }}
          onRefresh={getData}
        />
      )}
    </TablePageWrapper>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(SimulationTask));
