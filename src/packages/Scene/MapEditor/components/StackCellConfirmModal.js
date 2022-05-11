import React, { memo, useState } from 'react';
import { Checkbox, Col, Modal, Row } from 'antd';
import { NavigationCellType } from '@/config/config';

const StackCellConfirmModal = (props) => {
  const { visible, onCancel, onConfirm, types, title } = props;
  const [selectedTypes, setSelectedTypes] = useState([]);

  function submit() {
    onConfirm(selectedTypes);
    onClose();
  }

  function onClose() {
    onCancel();
    setSelectedTypes([]);
  }

  function renderOptions() {
    return (
      <Row gutter={[10, 10]}>
        {NavigationCellType.filter((item) => types.includes(item.code)).map(({ code, name }) => (
          <Col key={code} span={8}>
            <Checkbox value={code}>{name}</Checkbox>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Modal
      destroyOnClose
      closable={false}
      width={400}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
      title={title}
    >
      <Checkbox.Group onChange={setSelectedTypes} style={{ width: '100%' }}>
        {renderOptions()}
      </Checkbox.Group>
    </Modal>
  );
};
export default memo(StackCellConfirmModal);
