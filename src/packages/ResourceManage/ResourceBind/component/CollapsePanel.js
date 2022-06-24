import React, { memo } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { Card, Col, Empty, Row, Tag } from 'antd';
import { GridResponsive } from '@/config/consts';

const CollapsePanel = (props) => {
  const { dataSource } = props;
  const group = groupBy(dataSource, 'bindCode');

  function getInnerCardDataSource(data) {
    if (Array.isArray(data)) {
      return Object.values(groupBy(data, 'resourceType'));
    }
    return [];
  }

  if (isEmpty(group)) {
    return <Empty />;
  }
  return Object.values(group).map((item, index) => {
    const { bindName, bindCode } = item[0];
    return (
      <Card key={index} title={`${bindName} (${bindCode})`}>
        <Row {...GridResponsive} gutter={[16, 16]}>
          {getInnerCardDataSource(item).map((item2) => {
            const { resourceTypeName, resourceType } = item2[0];
            return (
              <Col key={resourceType}>
                <Card type={'inner'} title={resourceTypeName}>
                  {item2.map(({ resourceName }, index) => (
                    <Tag key={index}>{resourceName}</Tag>
                  ))}
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
    );
  });
};
export default memo(CollapsePanel);
