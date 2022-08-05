import React, { memo, useEffect } from 'react';
import { CheckOutlined, SwapOutlined, SwapRightOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import { MapSelectableSpriteType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyle from '@/common.module.less';

const MergeCells = (props) => {
  const { selectCellIds, mapContext } = props;

  useEffect(() => {
  }, []);

  function swap() {
    //
  }

  function confirm() {
  }

  return (
    <div>
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={10}>
          <Input />
        </Col>
        <Col
          span={4}
          className={commonStyle.flexCenter}
          style={{
            color: '#ffffff',
            fontSize: 24,
          }}
        >
          <SwapRightOutlined onClick={swap} />
        </Col>
        <Col span={10}>
          <Input />
        </Col>
      </Row>
      <Row gutter={8} justify={'end'}>
        <Col>
          <Button type={'primary'} onClick={confirm}>
            <SwapOutlined /> <FormattedMessage id={'editor.button.swap'} />
          </Button>
        </Col>
        <Col>
          <Button type={'primary'} onClick={confirm}>
            <CheckOutlined /> <FormattedMessage id={'translator.languageManage.merge'} />
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, mapContext } = editor;
  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ naviId }) => naviId);
  return { selectCellIds, mapContext };
})(memo(MergeCells));
