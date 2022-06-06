import React, { Component } from 'react';
import { Table, Tag } from 'antd';
import { convertToUserTimezone, formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const alertLevel = { ERROR: 'red', WARN: '#f5df19', INFO: 'blue' };
// 任务告警和任务日志公用一个组件
class TaskRecordOrAlarm extends Component {
  state = {
    currentTaskRecord: [],
    currentTaskAlaram: [],
    expandedRowKeys: [],
  };

  componentDidMount() {
    this.getTaskLog();
  }

  getTaskLog = () => {
    const { taskRecord = [], taskAlarm = [] } = this.props;
    const newTaskAlarm = [];
    taskAlarm.map(({ alertItemList }) => {
      if (Array.isArray(alertItemList)) {
        alertItemList.map((item) => {
          newTaskAlarm.push({ ...item });
        });
      }
    });
    this.setState({
      currentTaskRecord: taskRecord,
      currentTaskAlaram: newTaskAlarm,
    });
  };

  alaramColumns = [
    {
      title: <FormattedMessage id="app.taskAlarm.code" />,
      dataIndex: 'alertCode',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.taskAlarm.level" />,
      dataIndex: 'alertItemLevel',
      render: (text) => {
        if (!isNull(text)) {
          return <span style={{ color: alertLevel[text] }}>{text}</span>;
        }
      },
    },
    { title: <FormattedMessage id="app.map.cell" />, dataIndex: 'cellId' },
    { title: <FormattedMessage id="app.taskAlarm.count" />, dataIndex: 'alertCount' },
    { title: <FormattedMessage id="app.common.type" />, dataIndex: 'alertItemType' },
    {
      title: <FormattedMessage id="app.taskAlarm.alertName" />,
      dataIndex: 'alertNameI18NKey',
    },
    {
      title: <FormattedMessage id="app.taskAlarm.alertContent" />,
      dataIndex: 'alertContentI18NKey',
    },
    {
      title: <FormattedMessage id="app.taskDetail.firstTime" />,
      dataIndex: 'createTime',
      fixed: 'right',
      render: (text) => {
        if (!isNull(text)) {
          return convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
  ];

  recordColumns = [
    {
      title: formatMessage({ id: 'app.time' }), //日期
      dataIndex: 'createTime',
      align: 'center',
      fixed: 'left',
      render: (text) => {
        return !isNull(text) && convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: formatMessage({ id: 'sso.user.level' }),
      dataIndex: 'level',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return <Tag color={alertLevel[text]}>{text}</Tag>;
        }
      },
    },
    {
      title: formatMessage({ id: 'app.common.type' }),
      dataIndex: 'logType',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return formatMessage({ id: `app.taskLog.${text}` });
        }
      },
    },
    {
      title: 'ID',
      dataIndex: 'logId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'logName',
      align: 'center',
      fixed: 'right',
    },
  ];

  render() {
    const { currentTaskRecord, currentTaskAlaram } = this.state; // 2个参数不可能同时都有值
    return (
      <div>
        {/* TODO考虑把这个提取出来 小车弹框也用到这个 */}
        {currentTaskAlaram.length > 0 && (
          <Table
            columns={this.alaramColumns}
            dataSource={currentTaskAlaram || []}
            pagination={false}
            rowKey={(_, index) => index}
            scroll={{ x: 'max-content' }}
          />
        )}
        {currentTaskRecord.length > 0 && (
          <Table
            columns={this.recordColumns}
            dataSource={currentTaskRecord}
            pagination={false}
            rowKey={({ id }) => id}
            expandedRowKeys={this.state.expandedRowKeys}
            onExpand={(expanded, record) => {
              var keys = [];
              if (expanded) {
                keys.push(record.id);
              }

              this.setState({ expandedRowKeys: keys });
            }}
            expandedRowRender={(record) => {
              return (
                <>
                  {!isNull(record.detail)
                    ? record.detail.map(({ key, value }) => {
                        return (
                          <>
                            <span style={{ margin: '10px 12px' }}>{`${key} : ${value}`}</span>
                          </>
                        );
                      })
                    : '-'}
                </>
              );
            }}
            scroll={{ x: 'max-content' }}
          />
        )}
      </div>
    );
  }
}
export default TaskRecordOrAlarm;
