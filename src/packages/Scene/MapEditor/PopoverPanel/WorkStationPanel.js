import React, { memo, useState } from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import FunctionListItem from '../components/FunctionListItem';
import WorkStationForm from './WorkStationForm';
import styles from '../../../XIHE/popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const WorkStationPanel = (props) => {
  const { height, dispatch, mapContext, workstationList } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  function edit(index, record) {
    setEditing(record);
    setFormVisible(true);
    setAddFlag(index);
  }

  function remove(flag) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'workstationList', scope: 'logic' },
    }).then((result) => {
      mapContext.removeWorkStation(result);
      mapContext.refresh();
    });
  }

  function getListData() {
    return workstationList.map((item, index) => {
      const { name, station, stopCellId, angle } = item;
      return {
        name,
        index,
        rawData: item,
        fields: [
          {
            field: 'name',
            label: <FormattedMessage id={'app.common.name'} />,
            value: name,
          },
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
        <FormattedMessage id={'app.map.workStation'} />
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
          <div className={styles.formWhiteLabel}>
            <WorkStationForm workStation={editing} flag={addFlag} />
          </div>
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => {
                  setAddFlag(workstationList.length + 1);
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
  const workstationList = currentLogicAreaData?.workstationList ?? [];
  return { workstationList, mapContext: editor.mapContext };
})(memo(WorkStationPanel));
