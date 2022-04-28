import React, { memo, useState } from 'react';
import { Checkbox, Col, Modal, Row } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { NavigationCellType } from '@/config/config';

const StackCellConfirmModal = (props) => {
  const { visible, onCancel, onConfirm, types } = props;
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
          <Col key={code} span={12}>
            <Checkbox value={code}>{name}</Checkbox>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Modal
      width={400}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
      title={<FormattedMessage id={'editor.tip.requireTypeForDeleting'} />}
    >
      <Checkbox.Group onChange={setSelectedTypes}>{renderOptions()}</Checkbox.Group>
    </Modal>
  );
};
export default memo(StackCellConfirmModal);
