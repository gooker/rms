import React, { memo, useState } from 'react';
import { Tooltip, Badge, Row, Col } from 'antd';
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
  const [selectRowKey, setSelectRowKey] = useState([]);

  function checkDetail(taskId) {
    const { dispatch, agvType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, agvType },
    });
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

    {
      title: <FormattedMessage id="app.request.headers" />,
      dataIndex: 'headers',
      render: (text) => {
        if (isStrictNull(text)) return '{}';
        const content = JSON.stringify(text);
        return content || '';
      },
    },
  ];

  function expandedRowRender(currentItemData) {
    if (currentItemData) {
      return (
        <>
          {currentItemData.map((item) => {
            <Row>
              {columns.map(({ title, dataIndex, render }, index) => (
                <Col key={index} span={12}>
                  {/* <LabelComponent label={title} color={'#000'}>
                    {typeof render === 'function'
                      ? render(record[dataIndex], record)
                      : record[dataIndex]}
                  </LabelComponent> */}
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
      <div>111</div>
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
