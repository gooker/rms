import React, { memo, useState } from 'react';
import { Button, Col, Row, Form, InputNumber, message } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const PositionCell = (props) => {
  const { close, mapContext } = props;

  const [cellId, setCellId] = useState(null);

  function positionSpot() {
    if (!isNull(cellId)) {
      const result = mapContext.positionCell(cellId);
      if (result) {
        close();
      } else {
        message.error(formatMessage({ id: 'editor.cell.notExist' }));
      }
    }
  }

  return (
    <Row>
      <Col>
        <Form.Item label={formatMessage({ id: 'app.map.cell' })}>
          <InputNumber
            onChange={(value) => {
              setCellId(value);
            }}
          />
        </Form.Item>
      </Col>
      <Col offset={1}>
        <Button type={'primary'} onClick={positionSpot}>
          <FormattedMessage id={'app.button.search'} />
        </Button>
      </Col>
    </Row>
  );
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
}))(memo(PositionCell));
