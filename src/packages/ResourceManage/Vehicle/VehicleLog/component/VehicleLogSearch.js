import React, { memo, useState } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { DownloadOutlined, RedoOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleLogDownload from './VehicleLogDownload';
import commonStyles from '@/common.module.less';
import { fetchVehicleLogs } from '@/services/resourceService';

const VehicleLogSearch = (props) => {
  const { onSearch, allData, allAdaptors, refreshData, selectedRows, type } = props;

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false); // 下载日志

  function logSearch() {
    form.validateFields().then((values) => {
      onSearch(allData, { ...values });
    });
  }

  function renderVehicleIdFilter() {
    return allData.map(({ vehicleId, vehicleType, id }) => (
      <Select.Option key={id} value={id}>
        {`${vehicleId}-${vehicleType}`}
      </Select.Option>
    ));
  }

  function renderVehicleStateFilter() {
    const vehicleStates = Dictionary('vehicleStatus');
    return Object.keys(vehicleStates).map((item) => (
      <Select.Option key={item} value={item}>
        <FormattedMessage id={vehicleStates[item]} />
      </Select.Option>
    ));
  }

  function onCancel() {
    setVisible(false);
  }

  // 日志下载
  async function onSave(values) {
    const params = [];
    const { fileName } = values;
    selectedRows?.map(({ vehicleId, adapterType }) => {
      params.push({ vehicleId, adapterType, fileName });
    });

    const response = await fetchVehicleLogs(params);
    if (!dealResponse(response, 1)) {
      onCancel();
      refreshData();
    }
  }

  return (
    <Form form={form}>
      <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 0 }}>
        <Form.Item label={formatMessage({ id: 'vehicle.id' })} name="ids">
          <Select allowClear mode="multiple" style={{ width: 300 }}>
            {renderVehicleIdFilter()}
          </Select>
        </Form.Item>
        <Form.Item label={<FormattedMessage id={'app.vehicleType'} />} name="vehicleType">
          <Select allowClear style={{ width: 300 }}>
            {Object.values(allAdaptors).map(({ adapterType }) => {
              const { id, name, vehicleTypes } = adapterType;
              return (
                <Select.OptGroup key={id} label={name}>
                  {vehicleTypes.map((item, index) => (
                    <Select.Option key={index} value={`${id}@${item.code}`}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.vehicleState' })} name="vehicleStatus">
          <Select allowClear mode="multiple" style={{ width: 300 }}>
            {renderVehicleStateFilter()}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={logSearch}>
            <SearchOutlined /> <FormattedMessage id="app.button.search" />
          </Button>
          <Button
            style={{ marginLeft: 15 }}
            onClick={() => {
              form.resetFields();
              onSearch(allData, {});
            }}
          >
            <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
          </Button>
        </Form.Item>
      </Row>
      {type === 'log' && (
        <Row justify={'space-between'}>
          <Col className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <DownloadOutlined /> <FormattedMessage id="app.logDownload" />
            </Button>

            <Button onClick={refreshData}>
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      )}

      {/* 日志下载 */}
      <VehicleLogDownload onCancel={onCancel} visible={visible} onSubmit={onSave} />
    </Form>
  );
};
export default memo(VehicleLogSearch);
