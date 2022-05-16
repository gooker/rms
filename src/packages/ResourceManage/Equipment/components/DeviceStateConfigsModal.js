import React, { memo, useEffect, useState } from 'react';
import { Divider, Empty, Modal, Form, Row, Col } from 'antd';
import { Container } from 'react-smooth-dnd';
import { find, forIn } from 'lodash';
import { connect } from '@/utils/RmsDva';
import {
  customTaskApplyDrag,
  fillProgramAction,
  formatMessage,
  isNull,
  isStrictNull,
} from '@/utils/util';
import { renderFormItemContent } from './equipUtils';
import ProgramingConfigure from '@/components/ProgramingConfiguer/ProgramingForm';
import ProgramingDndCard from '@/components/ProgramingConfiguer/ProgramingDndCard';
import styles from '@/components/ProgramingConfiguer/programing.module.less';

const DeviceStateConfigsModal = (props) => {
  const { deviceMonitorData, visible, configs, onCancel, dispatch, programing } = props;
  const [formRef1] = Form.useForm();

  const [allOptions, setAllOptionsOptions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [configuration, setConfiguration] = useState([]);

  useEffect(() => {
    if (visible && !isNull(deviceMonitorData)) {
      const { actionList } = deviceMonitorData;
      const configurations = [];
      actionList.forEach(({ adapterType, actionType, actionId, actionParameters }) => {
        const addedItem = { actionType: [adapterType, actionId] };
        actionParameters.forEach(({ code, value }) => {
          addedItem[code] = value;
        });
        configurations.push(addedItem);
      });

      setConfiguration(configurations);
    } else {
      setConfiguration([]);
    }
  }, [visible]);

  useEffect(() => {
    let newConfigs = [...configs];
    if (newConfigs && !isNull(deviceMonitorData)) {
      const { deviceMonitorParamsDefinitionList } = deviceMonitorData;
      newConfigs[0].deviceMonitorParamsDefinitionList = deviceMonitorParamsDefinitionList;
    }
    setCurrent(configs[0]?.code);
    setAllOptionsOptions(configs);
  }, [configs]);

  function renderItem() {
    const currentContent = find(allOptions, { code: current });
    return currentContent?.deviceMonitorParamsDefinitionList?.map(
      ({ name: labelName, code, isRequired, valueDataType: type, value }, index) => {
        const param = { type };
        const valuePropName = type === 'BOOL' ? 'checked' : 'value';
        let defaultValue = type === 'BOOL' ? JSON.parse(value) ?? false : value;
        return (
          <Col key={`${current}-${index}`} span={8}>
            <Form.Item
              label={labelName}
              name={code}
              key={`${current}-${index}-${code}`}
              valuePropName={valuePropName}
              initialValue={defaultValue}
              rules={[{ required: true }]}
            >
              {renderFormItemContent(param)}
            </Form.Item>
          </Col>
        );
      },
    );
  }

  function onDrop(dropResult) {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      let newConfiguration = [...configuration];
      newConfiguration = customTaskApplyDrag(newConfiguration, dropResult);
      setConfiguration(newConfiguration);
    }
  }

  function add(value) {
    if (Array.isArray(value)) {
      setConfiguration([...configuration, ...value]);
    } else {
      setConfiguration([...configuration, value]);
    }
  }

  function deleteConfiguration(inputIndex) {
    setConfiguration(configuration.filter((item, index) => index !== inputIndex));
  }

  function renderSubTitle(rest, actionParameters) {
    return Object.keys(rest)
      .map((code) => {
        const specific = find(actionParameters, { code });
        return `${specific.name}: ${rest[code]}`;
      })
      .join('; ');
  }

  function generateDndData() {
    return configuration.map((item) => {
      const { actionType, ...rest } = item;
      const [p1, p2] = actionType;
      const { actionParameters, actionDescription } = find(programing[p1], { actionId: p2 });
      return {
        title: `${formatMessage({ id: `editor.program.${p1}` })} / ${actionDescription}`,
        subTitle: renderSubTitle(rest, actionParameters),
      };
    });
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
        const DeviceMonitorDTO = [];
        DeviceMonitorDTO.push({
          deviceMonitorParamsDefinitionList,
          actionList,
          id: allOptions[0]?.id,
        });
        console.log(DeviceMonitorDTO);
        dispatch({ type: 'equipList/saveState', payload: { deviceMonitorData: DeviceMonitorDTO } });
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
        <Container
          dropPlaceholder={{
            showOnTop: true,
            animationDuration: 150,
            className: styles.dndPlaceholder,
          }}
          onDrop={(e) => onDrop(e)}
        >
          {generateDndData().map(({ title, subTitle }, index) => (
            <ProgramingDndCard
              key={`${title}-${index}`}
              index={index}
              title={title}
              subTitle={subTitle}
              onDelete={deleteConfiguration}
            />
          ))}
        </Container>
      )}

      {/*  点位编程配置面板 */}
      <Divider orientation={'left'}>配置面板</Divider>
      <ProgramingConfigure programing={programing} onAdd={add} />
    </Modal>
  );
};
export default connect(({ editor, equipList }) => ({
  programing: editor.programing,
  deviceMonitorData: equipList.deviceMonitorData?.[0],
}))(memo(DeviceStateConfigsModal));
