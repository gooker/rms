import React, { memo, useState } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { DownloadOutlined, RedoOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleLogDownload from './VehicleLogDownload';
import commonStyles from '@/common.module.less';
import { fetchVehicleLogs } from '@/services/resourceService';
import { VehicleUpgradeState } from '../../upgradeConst';
import { VehicleState } from '@/config/consts';

const VehicleLogSearch = (props) => {
  const { onSearch, allData, allAdaptors, refreshData, selectedRows, type } = props;

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false); // 下载日志

  let allVersion = allData
    ?.filter(({ softVersion }) => !isStrictNull(softVersion))
    .map(({ softVersion }) => softVersion);
  if (allVersion.length > 0) {
    allVersion.push('no');
  }

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
    return Object.values(VehicleState).map((item) => (
      <Select.Option key={item} value={item}>
        {formatMessage(`app.task.state.${item}`)}
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
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label={formatMessage({ id: 'vehicle.id' })} name="ids">
            <Select allowClear mode="multiple">
              {renderVehicleIdFilter()}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={<FormattedMessage id={'app.vehicleType'} />} name="vehicleType">
            <Select allowClear>
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
        </Col>

        <Col span={6}>
          <Form.Item label={formatMessage({ id: 'app.vehicleState' })} name="vehicleStatus">
            <Select allowClear mode="multiple">
              {renderVehicleStateFilter()}
            </Select>
          </Form.Item>
        </Col>
        {type === 'fireware' && (
          <>
            <Col span={6}>
              <Form.Item
                label={formatMessage({ id: 'vehicle.maintenanceState' })}
                name="maintenanceState"
              >
                <Select allowClear>
                  <Select.Option value={true}>
                    <FormattedMessage id="vehicle.maintenanceState.true" />
                  </Select.Option>
                  <Select.Option value={false}>
                    <FormattedMessage id="app.common.normal" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={formatMessage({ id: 'firmdware.progress' })} name="progress">
                <Select allowClear>
                  {Object.keys(VehicleUpgradeState)?.map((key) => (
                    <Select.Option key={key} value={key}>
                      {formatMessage({ id: `${VehicleUpgradeState[key]}` })}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label={formatMessage({ id: 'firmdware.version' })} name="softVersion">
                <Select allowClear mode="multiple">
                  {allVersion.map((version) => (
                    <Select.Option key={version} value={version}>
                      {version === 'no'
                        ? formatMessage({ id: 'firmdware.upgrade.nothave' })
                        : version}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </>
        )}
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
              disabled={selectedRows?.length === 0}
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
export default connect(({ global }) => ({
  allAdaptors: global.allAdaptors,
}))(memo(VehicleLogSearch));
