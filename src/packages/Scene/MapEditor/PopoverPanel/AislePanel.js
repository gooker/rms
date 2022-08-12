import React, { memo, useState } from 'react';
import { Button, Col, Empty, Tag } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined, SwapRightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import { getCurrentRouteMapData, getIdByNaviId, getNaviIdById } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import AisleForm from './AisleForm';
import FunctionListItem from '../components/FunctionListItem';
import commonStyles from '@/common.module.less';
import LabelComponent from '@/components/LabelComponent';

const AislePanel = (props) => {
  const { dispatch, height, aisles, cellMap, mapContext } = props;

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

  function renderGiveWay(data) {
    return (
      <Col key={getRandomString(6)} span={24}>
        <LabelComponent label={<FormattedMessage id={'editor.tunnel.giveWay'} />}>
          {Object.entries(data).map(([source, target], index) => {
            // 将 source 和 target转成导航ID
            const naviSource = getIdByNaviId(source, cellMap);
            const naviTarget = getIdByNaviId(`${target}`, cellMap);
            return (
              <Tag key={index} color='blue'>
                {naviSource}
                <SwapRightOutlined />s
                {naviTarget}
              </Tag>
            );
          })}
        </LabelComponent>
      </Col>
    );
  }

  function getListData() {
    return aisles.map((item, index) => {
      const { tunnelName, cells, giveWayCellMap } = item;
      const result = {
        name: tunnelName,
        index,
        rawData: item,
        fields: [
          {
            label: <FormattedMessage id={'app.map.cell'} />,
            value: cells.map((cell) => getNaviIdById(cell, cellMap)),
          },
        ],
      };

      if (!isNull(giveWayCellMap)) {
        result.fields.push({
          label: <FormattedMessage id={'editor.tunnel.giveWay'} />,
          node: renderGiveWay(giveWayCellMap),
        });
      }
      return result;
    });
  }

  const listData = getListData();
  return (
    <div style={{ height, width: 350 }} className={commonStyles.categoryPanel}>
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
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: '#fff' }} />
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
  const { mapContext, currentMap } = editor;
  const currentScopeMapData = getCurrentRouteMapData();
  const tunnels = currentScopeMapData?.tunnels ?? [];
  return { cellMap: currentMap.cellMap, mapContext, aisles: tunnels };
})(memo(AislePanel));
