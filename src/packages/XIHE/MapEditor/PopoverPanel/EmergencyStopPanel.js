import React, { memo, useState } from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import FunctionListItem from '../components/FunctionListItem';
import EmergencyStopForm from './EmergencyStopForm';
import editorStyles from '../editorLayout.module.less';

const EmergencyStopPanel = (props) => {
  const { height, dispatch, mapContext, emergencyStopFixedList } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(null);

  function edit(index, record) {
    setEditing(record);
    setAddFlag(index);
    setFormVisible(true);
  }

  function remove(flag) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'emergencyStopFixedList', scope: 'logic' },
    }).then((result) => {
      if (isNull(result)) return;
      mapContext.removeFixedEStopFunction(result);
      mapContext.refresh();
    });
  }

  function getListData() {
    return emergencyStopFixedList.map((item, index) => {
      const { x, y, name, code, estopMode, group, xlength, ylength, r } = item;
      const fields = [
        {
          field: 'code',
          label: <FormattedMessage id={'app.common.code'} />,
          value: code,
          col: 24,
        },
        {
          field: 'estopMode',
          label: <FormattedMessage id="editor.emergency.mode" />,
          value: <FormattedMessage id={`editor.emergency.${estopMode}`} />,
          col: 12,
        },
        {
          field: 'group',
          label: <FormattedMessage id="editor.emergency.group" />,
          value: group,
        },
        { field: 'X', label: 'X', value: x },
        { field: 'Y', label: 'Y', value: y },
      ];

      if (!isNull(xlength)) {
        fields.push({
          field: 'xlength',
          label: <FormattedMessage id="app.common.width" />,
          value: `${xlength} mm`,
        });
      }

      if (!isNull(ylength)) {
        fields.push({
          field: 'ylength',
          label: <FormattedMessage id="app.common.height" />,
          value: `${ylength} mm`,
        });
      }

      if (!isNull(r)) {
        fields.push({
          field: 'r',
          label: <FormattedMessage id="app.common.radius" />,
          value: `${r} mm`,
        });
      }

      return {
        name,
        index,
        fields,
        rawData: item,
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
        <FormattedMessage id={'app.map.emergencyStop'} />
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
          <EmergencyStopForm
            flag={addFlag}
            editing={editing}
            back={() => {
              setFormVisible(false);
            }}
          />
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => {
                  setAddFlag(emergencyStopFixedList.length + 1);
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
export default connect(({ editor, editorView }) => {
  const currentLogicAreaData = getCurrentLogicAreaData();
  const emergencyStopFixedList = currentLogicAreaData?.emergencyStopFixedList ?? [];
  return {
    emergencyStopFixedList,
    mapContext: editor.mapContext,
    forceUpdate: editorView.forceUpdate,
  };
})(memo(EmergencyStopPanel));
