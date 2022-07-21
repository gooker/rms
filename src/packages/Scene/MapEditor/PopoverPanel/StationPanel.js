import React, { memo, useState } from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import FunctionListItem from '../components/FunctionListItem';
import StationForm from './StationForm';
import commonStyles from '@/common.module.less';
import Dictionary from '@/utils/Dictionary';

const Colors = Dictionary().color;
const StationPanel = (props) => {
  const { dispatch, height, cellMap, commonList, mapContext } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(null);

  function edit(index, record) {
    // 此处record.stopCellId是业务ID，需要转换成导航ID
    const _record = { ...record, stopCellId: cellMap[record.stopCellId]?.naviId };
    setEditing(_record);
    setFormVisible(true);
    setAddFlag(index);
  }

  function remove(index) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag: index, type: 'commonList', scope: 'logic' },
    }).then((result) => {
      mapContext.removeStation(result);
      mapContext.refresh();
    });
  }

  function getListData() {
    return commonList.map((item, index) => {
      const { code, name, stopCellId, angle, nangle } = item;

      const naviID = cellMap[stopCellId]?.naviId ?? (
        <span style={{ color: Colors.red }}>
          <FormattedMessage id={'app.common.notAvailable'} />
        </span>
      );

      return {
        index,
        name,
        rawData: item,
        fields: [
          {
            label: <FormattedMessage id={'app.common.code'} />,
            value: code,
            col: 24,
          },
          {
            label: <FormattedMessage id={'editor.cellType.stop'} />,
            value: naviID,
          },
          {
            label: <FormattedMessage id={'app.map.landAngle'} />,
            value: angle,
          },
          {
            label: <FormattedMessage id={'app.map.naviAngle'} />,
            value: nangle,
          },
        ],
      };
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
        <FormattedMessage id={'app.map.station'} />
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
          <StationForm station={editing} flag={addFlag} />
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => {
                  setAddFlag(commonList.length + 1);
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
  const currentLogicAreaData = getCurrentLogicAreaData();
  const commonList = currentLogicAreaData?.commonList ?? [];
  return { commonList, mapContext: editor.mapContext, cellMap: editor.currentMap?.cellMap };
})(memo(StationPanel));
