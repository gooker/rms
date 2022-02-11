import React, { memo, useState } from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import FunctionListItem from '../components/FunctionListItem';
import editorStyles from '../editorLayout.module.less';
import StationForm from './StationForm';

const StationPanel = (props) => {
  const { dispatch, height, commonList, mapContext } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(null);

  function edit(index, record) {
    setEditing(record);
    setFormVisible(true);
    setAddFlag(index);
  }

  function remove(index) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag: index, type: 'commonList', scope: 'logic' },
    }).then((result) => {
      mapContext.removeCommonFunction(result);
      mapContext.refresh();
    });
  }

  function getListData() {
    return commonList.map((item, index) => {
      const { name, station, stopCellId, angle } = item;
      return {
        name,
        index,
        rawData: item,
        fields: [
          {
            field: 'station',
            label: <FormattedMessage id={'app.common.code'} />,
            value: station,
          },
          {
            field: 'stopCellId',
            label: <FormattedMessage id={'editor.workstation.stop'} />,
            value: stopCellId,
          },
          {
            field: 'angle',
            label: <FormattedMessage id={'app.common.angle'} />,
            value: angle,
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
  return { commonList, mapContext: editor.mapContext };
})(memo(StationPanel));
