import React, { memo } from 'react';
import { Button, Col, Row } from 'antd';
import { DragOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import FormattedMessage from '@/components/FormattedMessage';
import CostConfigure from '../components/CostConfigure';
import editorStyles from '../editorLayout.module.less';
import styles from './popoverPanel.module.less';

const CostPanel = (props) => {
  const { dispatch, height, selectLines } = props;

  return (
    <div style={{ height, width: 375 }} className={editorStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.routeMap'} />
      </div>
      <div>
        <div className={styles.panelBlock}>
          {/* 优先级详情 */}
          <Row gutter={[10, 10]}>
            <Col span={12}>
              {/* 低优先级 */}
              <ColorExample color="#e64a19">
                <FormattedMessage id={'editor.cost.lowPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 一般优先级 */}
              <ColorExample color="#ffca28">
                <FormattedMessage id={'editor.cost.normalPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 高优先级 */}
              <ColorExample color="#1976d2">
                <FormattedMessage id={'editor.cost.highPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 最优先级 */}
              <ColorExample color="#388e3c">
                <FormattedMessage id={'editor.cost.topPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 不可走 */}
              <ColorExample color="#aaaeb1a1">
                <FormattedMessage id={'editor.cost.noPass'} />
              </ColorExample>
            </Col>
          </Row>
          <div style={{ marginTop: 20 }}>
            <Button danger size="small">
              <FormattedMessage id="editor.cost.delete" />
            </Button>
            <div
              style={{ flex: 1, display: 'flex', flexFlow: 'column nowrap', paddingTop: '20px' }}
            >
              <Row type="flex" justify="center">
                <CostConfigure
                  onChange={(value) => {
                    this.createLines({ dir: 0, value });
                  }}
                />
              </Row>

              <Row type="flex" justify="space-around">
                <Col span={7} style={{ textAlign: 'left' }}>
                  <CostConfigure
                    onChange={(value) => {
                      this.createLines({ dir: 270, value });
                    }}
                  />
                </Col>
                <Col span={10} className={styles.costConfigureArrow}>
                  <DragOutlined />
                </Col>
                <Col span={7} style={{ textAlign: 'right' }}>
                  <CostConfigure
                    onChange={(value) => {
                      this.createLines({ dir: 90, value });
                    }}
                  />
                </Col>
              </Row>

              <Row type="flex" justify="center">
                <CostConfigure
                  onChange={(value) => {
                    this.createLines({ dir: 180, value });
                  }}
                />
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({ selectLines: editor.selectLines }))(memo(CostPanel));

const ColorExample = (props) => {
  const { color, children } = props;
  return (
    <div style={{ display: 'inline-block', lineHeight: '12px' }}>
      <div style={{ display: 'inline-block', background: color, width: 35, height: 18 }} />
      <div style={{ display: 'inline-block', position: 'absolute', marginLeft: 5 }}>{children}</div>
    </div>
  );
};
