import React, { memo, useState } from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import FunctionListItem from '../components/FunctionListItem';
import LabelComponent from '@/components/LabelComponent';
import Dictionary from '@/utils/Dictionary';
import IntersectionForm from '@/packages/Scene/MapEditor/PopoverPanel/IntersectionForm';
import commonStyles from '@/common.module.less';

const IntersectionPanel = (props) => {
  const { height, dispatch, mapContext, intersectionList } = props;

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
      payload: { flag, type: 'intersectionList', scope: 'logic' },
    }).then((result) => {
      mapContext.removeIntersection(result);
      mapContext.refresh();
    });
  }

  function renderIP(ip) {
    return (
      <LabelComponent label={'IP'}>
        {ip.map((record, index) => (
          <div key={index}>{`${formatMessage({
            id: `${Dictionary('vehicleDirection', [record.direction])}`,
          })}: ${record.value}`}</div>
        ))}
      </LabelComponent>
    );
  }

  function getListData() {
    return intersectionList.map((item, index) => {
      const { cellId, ip, isTrafficCell } = item;
      return {
        name: cellId,
        index,
        rawData: item,
        fields: [
          {
            field: 'ip',
            node: renderIP(ip),
          },
          {
            field: 'isTrafficCell',
            label: <FormattedMessage id={'editor.intersection.isTrafficCell'} />,
            value: formatMessage({ id: `app.common.${isTrafficCell}` }),
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
        <FormattedMessage id={'app.map.intersection'} />
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
          <IntersectionForm intersection={editing} flag={addFlag} />
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => {
                  setAddFlag(intersectionList.length + 1);
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
  const intersectionList = currentLogicAreaData?.intersectionList ?? [];
  return { intersectionList, mapContext: editor.mapContext };
})(memo(IntersectionPanel));
