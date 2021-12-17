import React, { memo, useState } from 'react';
import { Table, Radio, Card, Col, Row } from 'antd';
import { DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { groupBy } from 'lodash';
import moment from 'moment';
import { connect } from '@/utils/dva';
import Dictionary from '@/utils/Dictionary';
import ControlledRangePicker from './ControlledRangePicker';
import FilterTag from './FilterTag';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../ReportCenter.module.less';

const FormTable = (props) => {
  const { data, description, children, remove, info, deletable, filterDateOnChange } = props;
  const { agvType, allTaskTypes } = props;

  const [defaultValue, setDefaultValue] = useState(1);
  const [toggles, setToggles] = useState(0);
  const [number, setNumber] = useState(0);

  const todoAddHandler = () => {
    setNumber(1);
  };

  const todoCloseHandler = () => {
    setNumber(0);
  };

  const { descriptionKeys, descriptionValues } = description;
  if (descriptionKeys == null || descriptionValues == null) {
    return children;
  }

  // 生成表格数据
  let newData = data;
  if (descriptionKeys.length > 1) {
    const group = groupBy(data, (record) => record[descriptionKeys[0]]);
    const result = [];
    Object.keys(group).forEach((key) => {
      const elements = group[key];
      for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (index === 0) {
          result.push({
            colKey: descriptionKeys[0],
            ...element,
            colSpan: elements.length,
          });
        } else {
          result.push({
            colKey: descriptionKeys[0],
            ...element,
            colSpan: 0,
          });
        }
      }
    });
    newData = result.map((record, index) => ({ ...record, uniqueKey: index }));
  }
  // 将数据数据里的任务类型替换成翻译
  newData = newData.map((item) => ({
    ...item,
    agvTaskType: allTaskTypes[agvType]?.[item.agvTaskType] || item.agvTaskType,
  }));

  // 生成表格 column 模板
  const column = [];
  for (let index = 0; index < descriptionKeys.length; index++) {
    const element = descriptionKeys[index];
    column.push({
      title: info[element] || formatMessage({ id: Dictionary('reportCenterTable', element) }),
      align: 'center',
      dataIndex: element,
      width: '45%',
      render: (text, record) => {
        const obj = { children: text, props: {} };
        const { colKey, colSpan } = record;
        if (colKey == element) {
          obj.props.rowSpan = colSpan;
        }
        return obj;
      },
    });
  }
  for (let index = 0; index < descriptionValues.length; index++) {
    const element = descriptionValues[index];
    if (element) {
      column.push({
        align: 'center',
        title: info[element] || formatMessage({ id: Dictionary('reportCenterTable', element) }),
        dataIndex: element,
      });
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <Card
        bordered
        hoverable
        bodyStyle={{ padding: '10px' }}
        title={
          <Row style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>{description.title}</Row>
        }
        extra={
          <Col>
            <Radio.Group
              value={defaultValue}
              onChange={({ target }) => {
                setDefaultValue(target.value);
              }}
            >
              <Radio.Button
                value={1}
                onClick={() => {
                  setToggles(0);
                }}
              >
                <FormattedMessage id="app.reportCenter.chart" />
              </Radio.Button>
              <Radio.Button
                value={2}
                onClick={() => {
                  setToggles(1);
                }}
              >
                <FormattedMessage id="app.reportCenter.report" />
              </Radio.Button>
            </Radio.Group>
          </Col>
        }
        actions={[
          <div key="a" style={{ position: 'relative' }}>
            {number == 1 ? (
              <div>
                <a
                  onClick={() => {
                    todoCloseHandler();
                  }}
                >
                  <FormattedMessage id="app.reportCenter.packUp" />
                  <UpOutlined style={{ marginLeft: 5 }} />
                </a>
                <Card
                  style={{ minHeight: 100 }}
                  bordered={false}
                  bodyStyle={{ background: '#ffffff', transition: 'all 1s ease-in-out' }}
                >
                  <Row>
                    <Col span={4}>
                      <FormattedMessage id="app.reportCenter.filterCriteria" />:
                    </Col>
                    <Col span={20}>
                      <FilterTag
                        info={info}
                        filters={description.filters}
                        onChange={(value) => {
                          filterDateOnChange({ data: value, type: 'filter' });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 10 }}>
                    <Col span={4}>
                      <FormattedMessage id="app.reportCenter.filtrationTime" /> :
                    </Col>
                    <Col span={20}>
                      <ControlledRangePicker
                        onChange={filterDateOnChange}
                        datePattern={description.datePattern}
                        value={[new moment(description.startDate), new moment(description.endDate)]}
                      />
                    </Col>
                  </Row>
                </Card>
              </div>
            ) : (
              <Row>
                <a
                  onClick={() => {
                    todoAddHandler();
                  }}
                >
                  <FormattedMessage id="app.reportCenter.expand" />
                  <DownOutlined style={{ marginLeft: 5 }} />
                </a>
              </Row>
            )}
          </div>,
        ]}
      >
        <Col span={24}>
          {/* 删除按钮 */}
          {deletable ? (
            <span className={styles.deleteFormDiv}>
              <DeleteOutlined
                className={styles.deleteFormIcon}
                onClick={() => {
                  remove(description);
                }}
              />
            </span>
          ) : null}

          {/* 视图切换 */}
          <div style={{ marginTop: 0, height: 400 }}>
            {toggles ? (
              <Table
                bordered
                size={'small'}
                style={{ marginTop: 30 }}
                scroll={{ y: 300 }}
                columns={column}
                pagination={false}
                dataSource={newData}
                rowKey={(record) => record.uniqueKey}
              />
            ) : (
              children
            )}
          </div>
        </Col>
      </Card>
    </div>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(FormTable));
