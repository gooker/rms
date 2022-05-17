import React, { memo, useEffect, useState } from 'react';
import { Divider, Empty, Modal, Form, Row, Col } from 'antd';
import { find, forIn } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { fillProgramAction, isNull, isStrictNull } from '@/utils/util';
import { renderFormItemContent } from './equipUtils';
import ProgramingConfigure from '@/components/ProgramingConfiguer/ProgramingForm';
import ProgramingDnd from '@/components/ProgramingConfiguer/ProgramingDnd';

const DeviceStateConfigsModal = (props) => {
  const { deviceMonitorData, visible, configs, onCancel, dispatch, programing, onSave } = props;
  const [formRef1] = Form.useForm();

  const [allOptions, setAllOptionsOptions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [configuration, setConfiguration] = useState([]);

  useEffect(() => {
    if (visible && !isNull(deviceMonitorData)) {
      deviceMonitorData?.map(({ actionList }) => {
        const configurations = [];
        actionList.forEach(({ adapterType, actionType, actionId, actionParameters }) => {
          const addedItem = { actionType: [adapterType, actionId] };
          actionParameters.forEach(({ code, value }) => {
            addedItem[code] = value;
          });
          configurations.push(addedItem);
        });

        setConfiguration(configurations);
      });
    } else {
      setConfiguration([]);
    }
  }, [visible]);

  useEffect(() => {
    let newConfigs = [...configs];
    if (newConfigs?.length > 0 && !isNull(deviceMonitorData)) {
      deviceMonitorData?.map(({ deviceMonitorParamsDefinitionList }) => {
        // const currentConfigIndex = findIndex(newConfigs, { id });
        // 目前只会有一条数据！！！
        newConfigs[0].deviceMonitorParamsDefinitionList = deviceMonitorParamsDefinitionList;
      });
    }
    setCurrent(configs[0]?.code);
    setAllOptionsOptions(newConfigs);
  }, [configs]);

  function renderItem() {
    const currentContent = find(allOptions, { code: current });
    return currentContent?.deviceMonitorParamsDefinitionList?.map(
      ({ name, code, valueDataType: type, value, isOptional }, index) => {
        const param = { type };
        const valuePropName = type === 'BOOL' ? 'checked' : 'value';
        let defaultValue = type === 'BOOL' ? JSON.parse(value) ?? false : value;
        return (
          <Col key={`${current}-${index}`} span={8}>
            <Form.Item
              label={name}
              name={code}
              key={`${current}-${index}-${code}`}
              valuePropName={valuePropName}
              initialValue={defaultValue}
              rules={[{ required: isOptional === false }]}
            >
              {renderFormItemContent(param)}
            </Form.Item>
          </Col>
        );
      },
    );
  }

  function add(value) {
    if (Array.isArray(value)) {
      setConfiguration([...configuration, ...value]);
    } else {
      setConfiguration([...configuration, value]);
    }
  }

  function save() {
    formRef1
      .validateFields()
      .then((value) => {
        const deviceMonitorParamsDefinitionList = getParamsDefinitionList(value);
        // 回填数据
        let actionList = [];
        if (Array.isArray(configuration) && configuration.length > 0) {
          actionList = fillProgramAction(configuration, programing);
        }
        const deviceMonitorDTO = [];
        deviceMonitorDTO.push({
          deviceMonitorParamsDefinitionList,
          actionList,
          id: allOptions[0]?.id,
          deviceId: allOptions[0]?.deviceId,
        });
        dispatch({ type: 'equipList/saveState', payload: { deviceMonitorData: deviceMonitorDTO } });

        onSave && onSave(deviceMonitorDTO);
        onCancel();
        formRef1.resetFields();
      })
      .catch(() => {});
  }

  function getParamsDefinitionList(values) {
    const newDefinitionList = [];
    const definitionList = configs[0].deviceMonitorParamsDefinitionList;
    forIn(values, (value, key) => {
      const currentOptions = find(definitionList, (define) => define.code === key);
      newDefinitionList.push({ ...currentOptions, value });
    });
    return newDefinitionList;
  }

  return (
    <Modal
      destroyOnClose
      title={`设备状态动作编程`}
      width={'60%'}
      closable={false}
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={save}
      style={{ maxWidth: 1000, top: '5%' }}
    >
      {/* 阈值 */}
      <Form form={formRef1}>
        <Row gutter={10} style={{ marginTop: 15 }}>
          {renderItem()}
        </Row>
      </Form>

      <Divider />

      {/* 设备状态动作 编程配置信息 */}
      {isStrictNull(current) || configuration?.length === 0 ? (
        <Empty />
      ) : (
        <ProgramingDnd value={configuration} onChane={setConfiguration} programing={programing} />
      )}

      {/*  点位编程配置面板 */}
      <Divider orientation={'left'}>配置面板</Divider>
      <ProgramingConfigure programing={programing} onAdd={add} />
    </Modal>
  );
};
export default connect(({ global, equipList }) => ({
  programing: global.programing ?? {},
  deviceMonitorData: equipList.deviceMonitorData ?? [], // 目前只会有一条数据！！！
}))(memo(DeviceStateConfigsModal));
