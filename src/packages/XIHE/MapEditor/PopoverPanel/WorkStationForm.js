import React, { memo } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull, isStrictNull } from '@/utils/util';
import { WorkStationSize } from '@/config/consts';
import AngleSelector from '@/components/AngleSelector';
import FormattedMessage from '@/components/FormattedMessage';
import RichInput from '@/packages/XIHE/components/RichInput';
import CardRadio from '@/packages/XIHE/components/CardRadio';
import SuperMultiSelect from '@/packages/XIHE/components/SuperMultiSelect';
import styles from './popoverPanel.module.less';

const WorkStationForm = (props) => {
  const { dispatch, mapContext, selectCellIds, workStation, allWorkstations } = props;
  const [formRef] = Form.useForm();

  // 拆分size
  let iconWidth = null;
  let iconHeight = null;
  if (!isStrictNull(workStation)) {
    [iconWidth, iconHeight] = workStation.size.split('@').map((item) => parseInt(item));
  }

  function onValuesChange(changedValues, allValues) {
    // 配置工作站最少参数是 角度 & 停止点
    if (!isNull(allValues.angle) && !isNull(allValues.stopCellId)) {
      const currentWorkStation = { ...allValues };
      // 如果此时没有输入编码，就是用默认值
      if (isStrictNull(currentWorkStation.station)) {
        currentWorkStation.station = `${allValues.stopCellId}-${allValues.angle}`;
      }
      // 默认值(保证数据正确)和size字段
      currentWorkStation.size = `${currentWorkStation.iconWidth || WorkStationSize.width}@${
        currentWorkStation.iconHeight || WorkStationSize.height
      }`;
      // 删除无用的字段
      delete currentWorkStation['direction&&angle'];
      delete currentWorkStation.iconWidth;
      delete currentWorkStation.iconHeight;

      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'workstationList', data: currentWorkStation },
      }).then((result) => {
        if (result.type === 'add') {
          mapContext.addWorkStation(result.payload);
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          pre && mapContext.removeWorkStation(pre);
          mapContext.addWorkStation(current);
        }
        mapContext.refresh();
      });
    }
  }

  function checkCodeDuplicate(station) {
    const { tid } = formRef.getFieldValue();
    const existCodes = allWorkstations
      .filter((item) => item.tid !== tid)
      .map((item) => item.station);
    return existCodes.includes(station);
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} onValuesChange={onValuesChange} layout={'vertical'}>
        {/* 隐藏字段 */}
        <Form.Item hidden name={'direction'} initialValue={workStation?.direction} />
        <Form.Item hidden name={'angle'} initialValue={workStation?.angle} />

        {/* 编码 */}
        <Form.Item
          name={'station'}
          initialValue={workStation?.station || getRandomString(6)}
          label={formatMessage({ id: 'app.common.code' })}
          rules={[
            () => ({
              validator(_, value) {
                const isDuplicate = checkCodeDuplicate(value);
                if (!isDuplicate) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(formatMessage({ id: 'editor.code.duplicate' })));
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>

        {/* 名称 */}
        <Form.Item
          name={'name'}
          initialValue={workStation?.name}
          label={<FormattedMessage id="app.common.name" />}
        >
          <Input />
        </Form.Item>

        {/* 停止点 */}
        <Form.Item
          name={'stopCellId'}
          initialValue={workStation?.stopCellId}
          label={formatMessage({ id: 'editor.cellType.stop' })}
        >
          <RichInput
            currentCellId={selectCellIds}
            icon={<img alt={'stop'} style={{ width: 25 }} src={'/stop.png'} />}
          />
        </Form.Item>

        {/* 距离停止点的距离 */}
        <Form.Item
          name={'offset'}
          initialValue={workStation?.offset || 1000}
          label={<FormattedMessage id="editor.station.distance" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标 */}
        <Form.Item
          name={'icon'}
          initialValue={workStation?.icon || 'work_station'}
          label={<FormattedMessage id="editor.station.icon" />}
        >
          <CardRadio />
        </Form.Item>

        {/* 图标宽度 */}
        <Form.Item
          name={'iconWidth'}
          initialValue={iconWidth || 1000}
          label={<FormattedMessage id="editor.station.icon.width" />}
        >
          <InputNumber />
        </Form.Item>

        {/* 图标高度 */}
        <Form.Item
          name={'iconHeight'}
          initialValue={iconHeight || 1000}
          label={<FormattedMessage id="editor.station.icon.height" />}
        >
          <InputNumber />
        </Form.Item>

        {/* 角度 */}
        <Form.Item
          name={'direction&&angle'}
          initialValue={workStation?.angle}
          label={<FormattedMessage id="app.common.angle" />}
          getValueFromEvent={(value) => {
            formRef.setFieldsValue({
              direction: value.dir,
              angle: value.angle,
            });
            return value;
          }}
        >
          <AngleSelector />
        </Form.Item>

        {/* 扫描点 */}
        <Form.Item
          name={'scanCellId'}
          initialValue={workStation?.scanCellId}
          label={<FormattedMessage id="editor.cellType.scan" />}
        >
          <RichInput
            icon={<img alt={'scan_cell'} style={{ width: 25 }} src={'/scan_cell.png'} />}
            currentCellId={selectCellIds}
          />
        </Form.Item>

        {/* 缓冲点 */}
        <Form.Item
          name={'bufferCellId'}
          initialValue={workStation?.bufferCellId}
          label={formatMessage({ id: 'editor.cellType.buffer' })}
        >
          <RichInput
            currentCellId={selectCellIds}
            icon={
              <img alt={'buffer_cell'} style={{ width: 25 }} src={'/buffer_cell.png'} />
            }
          />
        </Form.Item>

        {/* 旋转点 */}
        <Form.Item
          name={'rotateCellIds'}
          initialValue={workStation?.rotateCellIds}
          label={formatMessage({ id: 'editor.cellType.rotation' })}
        >
          <SuperMultiSelect
            currentCellId={selectCellIds}
            icon={<img alt={'rotate'} style={{ width: 25 }} src={'/round.png'} />}
          />
        </Form.Item>

        {/* 分叉点 */}
        <Form.Item
          name={'branchPathCellIds'}
          initialValue={workStation?.branchPathCellIds}
          label={formatMessage({ id: 'editor.cellType.bifurcation' })}
        >
          <SuperMultiSelect
            currentCellId={selectCellIds}
            icon={
              <img alt={'bifurcation'} style={{ width: 25 }} src={'/bifurcation.png'} />
            }
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ editor }) => {
  const { currentMap, selectCells, mapContext } = editor;

  // 获取所有工作站点列表
  const allWorkstations = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const logicWorkstations = item.workstationList || [];
    allWorkstations.push(...logicWorkstations);
  });

  return { mapContext, selectCellIds: selectCells, allWorkstations };
})(memo(WorkStationForm));
