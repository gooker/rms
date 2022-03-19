import React, { memo } from 'react';
import { Col, Divider } from 'antd';
import { connect } from '@/utils/RmsDva';
import { convertToUserTimezone } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import LabelColComponent from '@/components/LabelColComponent';
import FunctionListItem from '../../components/FunctionListItem';

const MapProperty = (props) => {
  const { currentMap } = props;

  function generateLogicData() {
    return currentMap.logicAreaList.map((item) => {
      const { id, name, rangeStart, rangeEnd } = item;
      return {
        name,
        fields: [
          {
            field: 'id',
            node: (
              <Col span={24}>
                <LabelColComponent labelCol={8} label={'ID'}>
                  {id}
                </LabelColComponent>
              </Col>
            ),
          },
          {
            field: 'rangeStart',
            node: (
              <Col span={24}>
                <LabelColComponent
                  labelCol={8}
                  label={<FormattedMessage id={'editor.logic.rangeStart'} />}
                >
                  {rangeStart}
                </LabelColComponent>
              </Col>
            ),
          },
          {
            field: 'rangeEnd',
            node: (
              <Col span={24}>
                <LabelColComponent
                  labelCol={8}
                  label={<FormattedMessage id={'editor.logic.rangeEnd'} />}
                >
                  {rangeEnd}
                </LabelColComponent>
              </Col>
            ),
          },
        ],
      };
    });
  }

  return (
    <>
      <div>
        <FormattedMessage id={'app.map.detail'} />
      </div>
      <div>
        <LabelColComponent label={<FormattedMessage id={'app.common.name'} />}>
          {currentMap.name}
        </LabelColComponent>
        <LabelColComponent label={'ID'}>{currentMap.id}</LabelColComponent>
        <LabelColComponent label={<FormattedMessage id={'app.common.description'} />}>
          {currentMap.desc}
        </LabelColComponent>
        <LabelColComponent label={<FormattedMessage id={'app.map.ever'} />}>
          {currentMap.ever}
        </LabelColComponent>
        <LabelColComponent label={<FormattedMessage id={'app.map.mver'} />}>
          {currentMap.mver}
        </LabelColComponent>
        <LabelColComponent label={<FormattedMessage id={'app.common.creationTime'} />}>
          {convertToUserTimezone(currentMap.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </LabelColComponent>
        <LabelColComponent label={<FormattedMessage id={'app.common.creator'} />}>
          {currentMap.createdByUser}
        </LabelColComponent>
        <LabelColComponent label={<FormattedMessage id={'app.common.updateTime'} />}>
          {convertToUserTimezone(currentMap.updateTime).format('YYYY-MM-DD HH:mm:ss')}
        </LabelColComponent>
        <LabelColComponent label={<FormattedMessage id={'app.common.updater'} />}>
          {currentMap.updatedByUser}
        </LabelColComponent>
        <Divider orientation={'left'} style={{ color: '#e8e8e8' }}>
          <FormattedMessage id={'app.map.logicArea'} />
        </Divider>

        {generateLogicData().map((item, index) => (
          <FunctionListItem key={index} data={item} />
        ))}
      </div>
    </>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
}))(memo(MapProperty));
