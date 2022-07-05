import React, { memo, useEffect, useState } from 'react';
import { Button, Form, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import request from '@/utils/request';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { VehicleType } from '@/config/config';
import styles from '../monitorLayout.module.less';
import { fetchRequestorList } from '@/services/commonService';
import { renderRequestBodyForm } from '@/packages/Strategy/Requestor/requestorUtil';

const TabVehicleMap = {
  LatentVehicle: VehicleType.LatentLifting,
  ToteVehicle: VehicleType.Tote,
  SorterVehicle: VehicleType.Sorter,
};

const { formItemLayout } = getFormLayout(6, 16);

const CustomComponent = (props) => {
  const { dispatch, category } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const [apiList, setApiList] = useState([]);
  const [currentApiId, setCurrentApiId] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  useEffect(() => {
    getApis();
  }, []);

  function getApis() {
    // 获取自定义API
    fetchRequestorList().then((response) => {
      if (!dealResponse(response)) {
        setApiList(response);
      }
    });
  }

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  const renderCustomButton = () => {
    const vehicleType = TabVehicleMap[category];
    const vehicleApiList = apiList
      .filter((item) => item.vehicleType === vehicleType)
      .map(({ id, name }) => ({ id, name }));

    if (vehicleApiList.length > 0) {
      return (
        <Form.Item
          {...formItemLayout}
          style={{ width: '100%' }}
          label={formatMessage({ id: 'app.common.custom' })}
        >
          {vehicleApiList.map(({ id, name }) => (
            <Button
              key={id}
              size="small"
              type={currentApiId === id ? 'primary' : ''}
              style={{ marginRight: '10px', marginBottom: '10px' }}
              onClick={() => {
                const dataSource = apiList.filter((item) => item.id === id)[0];
                setCurrentApiId(id);
                setDataSource(dataSource);
              }}
            >
              {name}
            </Button>
          ))}
        </Form.Item>
      );
    }
  };

  const sendApiRequest = async () => {
    const formValue = formRef.getFieldsValue();

    const apiData = apiList.filter((item) => item.id === currentApiId)[0];

    let requestBody;
    // 特殊Case: 对于非{}形式的参数
    if (formValue.placeholder) {
      requestBody = formValue.placeholder;
    } else {
      requestBody = { ...formValue };
    }

    // 请求器
    async function fetchRequest() {
      return request(apiData.url, {
        method: apiData.method,
        data: requestBody,
        headers: apiData.header,
      });
    }

    setExecuting(true);
    // 开始请求
    const response = await fetchRequest();
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'monitor.requestor.execute.failed' }));
    } else {
      message.success(formatMessage({ id: 'monitor.requestor.execute.success' }));
    }
    setExecuting(false);
  };

  return (
    <div style={getMapModalPosition(600, 360)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'app.common.custom'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        {/* 自定义操作 */}
        <Form form={formRef}>
          {renderCustomButton()}
          {dataSource && (
            <div style={{ width: '100%' }}>
              {renderRequestBodyForm(dataSource, formRef, true, {
                formLayout: {},
                layout: 'vertical',
              })}
              <Button
                type="primary"
                style={{ marginLeft: 84 }}
                onClick={sendApiRequest}
                loading={executing}
                disabled={executing}
              >
                <FormattedMessage id="app.vehicle.batchCommand.Modal.confirm" />
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  allVehicles: monitor.allVehicles,
  category: monitor.categoryPanel,
}))(memo(CustomComponent));
