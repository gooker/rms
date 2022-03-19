import React, { PureComponent } from 'react';
import { Row, Col, Pagination, Timeline } from 'antd';
import {
  MehOutlined,
  SmileTwoTone,
  FrownOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { formatMessage, convertToUserTimezone } from '@/utils/util';
import { AGVType } from '@/config/config';
import { connect } from '@/utils/RmsDva';
import styles from './index.module.less';

const taskStatusIcon = {
  New: {
    icon: <MehOutlined style={{ fontSize: '16px', color: '#f5222d' }} />,
  },
  Executing: {
    icon: <SyncOutlined spin style={{ fontSize: '16px', color: '#1890FF' }} />,
  },
  Finished: {
    icon: <SmileTwoTone style={{ fontSize: '16px', color: '#2FC25B' }} />,
  },
  Error: {
    icon: <FrownOutlined style={{ fontSize: '16px', color: 'rgb(255, 205, 54)' }} />,
  },
  Cancel: {
    icon: <CloseCircleOutlined style={{ fontSize: '16px', color: '#b3b2b2' }} />,
    color: '#b3b2b2',
  },
};

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class TaskRecordTab extends PureComponent {
  renderDescription = (record) => {
    return <Col>{convertToUserTimezone(record.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Col>;
  };

  renderStep = (record) => {
    const { agvType, allTaskTypes } = this.props;
    const taskStatus = taskStatusIcon[record.taskStatus];
    return (
      <Timeline.Item dot={taskStatus.icon} key={taskStatus.id}>
        {this.renderDescription(record)}
        <Col>
          <span
            className={styles.tableBar}
            style={{ lineHeight: '25px' }}
            onClick={() => {
              const { onDetail } = this.props;
              if (onDetail) {
                onDetail(record.taskId, AGVType.Sorter);
              }
            }}
          >
            {allTaskTypes?.[agvType]?.[record.type] || record.type}
          </span>
        </Col>
      </Timeline.Item>
    );
  };

  renderTimeline = (taskList) => {
    let data_ = [];
    for (let i = 0; i < taskList.length; i++) {
      const activityListElement = taskList[i];
      data_.push(this.renderStep(activityListElement));
    }
    return data_;
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        <Col span={24} style={{ minHeight: 550, marginTop: 15 }}>
          <Row>
            {data ? (
              <Timeline style={{ width: '78%' }} mode="alternate">
                {this.renderTimeline(data.list || [])}
              </Timeline>
            ) : null}
          </Row>
          <div style={{ position: 'absolute', bottom: 0, right: 10 }}>
            <Pagination
              pageSize={7}
              current={data && data.page ? data.page.currentPage : 0}
              total={data && data.page ? data.page.totalElements : 0}
              showTotal={(total) =>
                formatMessage({ id: 'app.common.tableRecord' }, { count: total })
              }
              showSizeChanger={false}
              onChange={(current) => {
                let params = {
                  current: current,
                  size: 6,
                };
                const { pageOnchange } = this.props;
                if (pageOnchange) {
                  pageOnchange(params);
                }
              }}
            />
          </div>
        </Col>
      </div>
    );
  }
}
export default TaskRecordTab;
