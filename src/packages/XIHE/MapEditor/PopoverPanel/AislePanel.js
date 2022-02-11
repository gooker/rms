import React, { memo, useState } from 'react';
import { Button, Col, Divider, Empty, Row, Table, Tag } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import AisleForm from '../PopoverPanel/AisleForm';
import FunctionListItem from '../components/FunctionListItem';
import editorStyles from '../editorLayout.module.less';
import LabelComponent from '@/components/LabelComponent';

const AislePanel = (props) => {
  const { dispatch, height, aisles, mapContext } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(null);

  function edit(index, record) {
    setEditing(record);
    setFormVisible(true);
    setAddFlag(index);
  }

  function remove(flag) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'tunnels', scope: 'route' },
    }).then((result) => {
      mapContext.renderTunnel([result], false, 'remove');
      mapContext.refresh();
    });
  }

  function getListData() {
    return aisles.map((item, index) => {
      const { tunnelName, cells, tunnelInUnLockCell, in: entrance, out } = item;
      return {
        name: tunnelName,
        index,
        rawData: item,
        fields: [
          {
            field: 'tunnelName',
            label: <FormattedMessage id={'app.common.name'} />,
            value: tunnelName,
          },
          {
            field: 'cells',
            label: <FormattedMessage id={'app.common.code'} />,
            value: cells,
          },
          {
            field: 'tunnelInUnLockCell',
            node: (
              <Col span={24}>
                <LabelComponent label={<FormattedMessage id={'app.map.cell'} />}>
                  {cells.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </LabelComponent>
              </Col>
            ),
          },
          {
            field: 'unLockCells',
            node: (
              <Col span={24}>
                <LabelComponent label={<FormattedMessage id={'editor.aisle.unLockCells'} />}>
                  {tunnelInUnLockCell?.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </LabelComponent>
              </Col>
            ),
          },
          {
            field: 'entrance',
            node: (
              <Col span={24}>
                <LabelComponent label={<FormattedMessage id={'editor.aisle.entrance'} />}>
                  {entrance?.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </LabelComponent>
              </Col>
            ),
          },
          {
            field: 'out',
            node: (
              <Col span={24}>
                <LabelComponent label={<FormattedMessage id={'editor.aisle.exit'} />}>
                  {out?.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </LabelComponent>
              </Col>
            ),
          },
        ],
      };
    });
  }

  const listData = getListData();
  return (
    <div style={{ height, width: 350 }} className={editorStyles.categoryPanel}>
      {/* 标题栏 */}
      <div>
        {formVisible ? (
          <LeftOutlined
            style={{ cursor: 'pointer', marginRight: 5 }}
            onClick={() => {
              setFormVisible(false);
              setEditing(null);
            }}
          />
        ) : null}
        <FormattedMessage id={'app.map.aisle'} />
        {formVisible ? <RightOutlined style={{ fontSize: 16, margin: '0 5px' }} /> : null}
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          {formVisible
            ? isNull(editing)
              ? formatMessage({ id: 'app.button.add' })
              : formatMessage({ id: 'app.button.update' })
            : null}
        </span>
      </div>

      {/* 列表区 */}
      <div>
        {formVisible ? (
          <AisleForm aisle={editing} flag={addFlag} />
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => {
                  setAddFlag(aisles.length + 1);
                  setFormVisible(true);
                }}
              >
                <PlusOutlined /> <FormattedMessage id="app.button.add" />
              </Button>
            </div>

            {listData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              listData.map((item) => (
                <FunctionListItem
                  key={getRandomString(6)}
                  data={item}
                  onEdit={edit}
                  onDelete={remove}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default connect(({ editor }) => {
  const { mapContext } = editor;
  const currentScopeMapData = getCurrentRouteMapData();
  const tunnels = currentScopeMapData?.tunnels ?? [];
  return { mapContext, aisles: tunnels };
})(memo(AislePanel));
