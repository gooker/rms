import React, { memo, useState } from 'react';
import { Card, Col, Empty, Row, Tag } from 'antd';
import { groupBy, isEmpty } from 'lodash';
import { formatMessage } from '@/utils/util';
import { GridResponsive } from '@/config/consts';
import RmsConfirm from '@/components/RmsConfirm';

const CollapsePanel = (props) => {
  const { dataSource } = props;
  const group = groupBy(dataSource, 'bindCode');

  const [deleteLoading, setDeleteLoading] = useState(false);

  function getInnerCardDataSource(data) {
    if (Array.isArray(data)) {
      return Object.values(groupBy(data, 'resourceType'));
    }
    return [];
  }

  function deleteItem(bindType, bindCode, resourceType, resourceCode) {
    console.log(bindType, bindCode, resourceType, resourceCode);
    RmsConfirm({
      content: formatMessage({ id: 'app.message.delete.confirm' }),
      onOk: () => {
        //
      },
      okButtonProps: { loading: deleteLoading },
    });
  }

  if (isEmpty(group)) {
    return <Empty />;
  }
  return Object.values(group).map((item, index) => {
    const { bindName } = item[0];
    return (
      <Card key={index} title={bindName}>
        <Row {...GridResponsive} gutter={[16, 16]}>
          {getInnerCardDataSource(item).map((item2) => {
            const { bindType, bindCode, resourceType, resourceCode, resourceTypeName } = item2[0];
            return (
              <Col key={resourceType}>
                <Card type={'inner'} title={resourceTypeName}>
                  {item2.map(({ resourceName }, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        deleteItem(bindType, bindCode, resourceType, resourceCode);
                      }}
                    >
                      {resourceName}
                    </Tag>
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
