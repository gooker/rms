import React, { memo } from 'react';
import { Button, Col, Dropdown, Menu, Row, Select } from 'antd';
import { BgColorsOutlined, DownOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';
import commonStyles from '@/common.module.less';

const TriggerSearchComponent = (props) => {
  const {
    checkedList,
    dataList,
    selectedSearchValue,
    onAdd,
    onPaste,
    onRefresh,
    onSelected,
    onStatusChange,
    onBatchChange,
  } = props;
  return (
    <div className={commonStyles.tableToolLeft}>
      <Row justify="space-between">
        <Col>
          <Button type='primary' onClick={onAdd}>
            <PlusOutlined /> <FormattedMessage id='app.button.add' />
          </Button>
          <Button
            style={{ margin: '0 15px' }}
            disabled={checkedList?.length !== 1}
            onClick={onPaste}
          >
            <BgColorsOutlined /> <FormattedMessage id='app.button.clone' />
          </Button>
          <Button
            onClick={() => {
              onRefresh();
            }}
          >
            <RedoOutlined /> <FormattedMessage id='app.button.refresh' />
          </Button>
        </Col>
        <Col>
          <Select
            allowClear
            showSearch
            mode="multiple"
            maxTagCount={2}
            value={checkedList?.map(({ id }) => id)}
            onChange={(e) => {
              const newChecked = dataList?.filter(({ id }) => e.includes(id));
              onSelected(newChecked);
              return e;
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ marginRight: 13, width: 350 }}
            placeholder={formatMessage({ id: 'app.common.select' })}
          >
            {dataList?.map((record) => (
              <Select.Option key={record.id} value={record.id}>
                {record.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            allowClear
            value={selectedSearchValue}
            onChange={onStatusChange}
            style={{ marginRight: 13, width: 150 }}
            placeholder={formatMessage({ id: 'taskTrigger.stateQuery' })}
          >
            <Select.Option value="start">
              {<FormattedMessage id="app.triggerState.executing" />}
            </Select.Option>
            <Select.Option value="pause">
              {<FormattedMessage id="app.triggerState.paused" />}
            </Select.Option>
            <Select.Option value="end">
              {<FormattedMessage id="app.triggerState.end" />}
            </Select.Option>
          </Select>
          <Dropdown
            disabled={checkedList.length === 0}
            trigger={['click']}
            overlay={
              <Menu onClick={onBatchChange}>
                <Menu.Item key="start">
                  {<FormattedMessage id="app.triggerAction.start" />}
                </Menu.Item>
                <Menu.Item key="pause">
                  {<FormattedMessage id="app.triggerAction.pause" />}
                </Menu.Item>
                <Menu.Item key="end">
                  {<FormattedMessage id="app.triggerAction.terminate" />}
                </Menu.Item>
              </Menu>
            }
          >
            <Button>
              <FormattedMessage id="app.button.batchOperate" /> <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
};
export default memo(TriggerSearchComponent);
