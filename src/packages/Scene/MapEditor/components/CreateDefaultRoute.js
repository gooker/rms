import React, { memo, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { CheckOutlined, DownOutlined, DragOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import CostConfigure from './CostConfigure';
import FormattedMessage from '@/components/FormattedMessage';
import popoverPanelStyles from '../../../XIHE/popoverPanel.module.less';
import styles from './createDefaultRoute.module.less';
import RmsConfirm from '@/components/RmsConfirm';
import { formatMessage } from '@/utils/util';

const IconStyle = { color: '#e8e8e8' };

const CreateDefaultRoute = (props) => {
  const { style, dispatch, mapContext } = props;
  const [collapsed, setCollapsed] = useState(true);
  const [value, setValue] = useState({});

  function switchCost(dir, cost) {
    setValue({ ...value, [dir]: cost });
  }

  function createDefaultLines() {
    RmsConfirm({
      content: formatMessage({ id: 'editor.defaultRoute.warn' }),
      onOk: () => {
        dispatch({ type: 'editor/createDefaultLines', payload: value }).then(({ remove, add }) => {
          remove.length > 0 && mapContext.updateLines({ type: 'remove', payload: remove });
          add.length > 0 && mapContext.updateLines({ type: 'add', payload: add });
        });
      },
    });
  }

  return (
    <div className={popoverPanelStyles.panelBlockBase} style={style}>
      <div
        className={styles.title}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <span>
          <FormattedMessage id={'editor.defaultRoute.title'} />
        </span>
        {collapsed ? <DownOutlined style={IconStyle} /> : <UpOutlined style={IconStyle} />}
      </div>
      <div style={{ height: collapsed ? 0 : 330 }} className={styles.body}>
        <div style={{ textAlign: 'end' }}>
          <Button type={'primary'} onClick={createDefaultLines}>
            <CheckOutlined /> <FormattedMessage id={'app.button.confirm'} />
          </Button>
        </div>
        <Row type="flex" justify="center">
          <Col span={7}>
            <CostConfigure
              showSelection
              value={value[0]}
              onChange={(value) => {
                switchCost(0, value);
              }}
            />
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={7} style={{ textAlign: 'left' }}>
            <CostConfigure
              showSelection
              value={value[3]}
              onChange={(value) => {
                switchCost(3, value);
              }}
            />
          </Col>
          <Col span={10} className={popoverPanelStyles.costConfigureArrow}>
            <DragOutlined />
          </Col>
          <Col span={7} style={{ textAlign: 'right' }}>
            <CostConfigure
              showSelection
              value={value[1]}
              onChange={(value) => {
                switchCost(1, value);
              }}
            />
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={7}>
            <CostConfigure
              showSelection
              value={value[2]}
              onChange={(value) => {
                switchCost(2, value);
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
}))(memo(CreateDefaultRoute));
