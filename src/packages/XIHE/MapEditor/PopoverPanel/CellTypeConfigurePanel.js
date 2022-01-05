import React, { memo } from 'react';
import { Button, Col, Divider, Row, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import { CellTypeSetting } from '../enums';
import FormattedMessage from '@/components/FormattedMessage';
import editorStyles from '../components/editorLayout.module.less';
import commonStyles from '@/common.module.less';
import styles from './popoverPanel.module.less';

const CellTypeConfigurePanel = (props) => {
  const { height, selectCells, onClick } = props;

  return (
    <div style={{ height, width: 450 }} className={editorStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.feature'} />
      </div>
      <div>
        <div className={styles.panelBlock}>
          <div style={{ padding: '0 10px' }}>
            {CellTypeSetting.map(({ type, picture, i18n, scope, texture }) => (
              <>
                <div key={type} style={{ marginBottom: 15 }}>
                  <div className={commonStyles.flexVerticalCenter} style={{ marginBottom: 5 }}>
                    <img style={{ height: 20, marginRight: 10 }} src={`/textures/${picture}`} />
                    <FormattedMessage id={i18n} />
                  </div>
                  <Row gutter={8}>
                    <Col span={18}>
                      <Select notFoundContent={null} style={{ width: '100%' }} />
                    </Col>
                    <Col span={3}>
                      <Button
                        disabled={selectCells.length === 0}
                        onClick={() => {
                          onClick && onClick('add');
                        }}
                      >
                        <PlusOutlined />
                      </Button>
                    </Col>
                    <Col span={3}>
                      <Button
                        danger
                        disabled={selectCells.length === 0}
                        onClick={() => {
                          onClick && onClick('remove');
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Col>
                  </Row>
                </div>
                <Divider style={{ margin: 5, borderTop: '1px solid #b0b0b0' }} />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  selectCells: editor.selectCells,
}))(memo(CellTypeConfigurePanel));