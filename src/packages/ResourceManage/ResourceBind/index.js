import React, { memo, useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { dealResponse } from '@/utils/util';
import { fetchBindableResourceMapping } from '@/services/resourceManageAPI';
import CascadeBindSelector from './component/CascadeBindSelector';
import commonStyle from '@/common.module.less';
import { ResourceBindData } from '@/mockData';
import CollapsePanel from '@/packages/ResourceManage/ResourceBind/component/CollapsePanel';
import { groupBy } from 'lodash';

const ResourceBind = () => {
  const [dataSource, setDataSource] = useState([...ResourceBindData]);
  const [resource, setResource] = useState([]);

  useEffect(() => {
    fetchBindableResourceMapping().then((response) => {
      if (!dealResponse(response)) {
        setResource(response);
      }
    });
  }, []);

  function onAdd(result) {
    const _dataSource = [...dataSource];
    _dataSource.push(...result);
    setDataSource(_dataSource);
  }

  function getListData(type) {
    return dataSource.filter((item) => item.bindType === type);
  }

  function getTypePayloadLength(data) {
    return Object.keys(groupBy(data, 'resourceType')).length;
  }

  return (
    <div className={commonStyle.commonPageStyle}>
      <CascadeBindSelector datasource={resource} onAdd={onAdd} />
      <Collapse accordion style={{ marginTop: 24 }}>
        {resource.map(({ name, resourceType }) => {
          const data = getListData(resourceType);
          const length = getTypePayloadLength(data);
          return (
            <Collapse.Panel header={`${name} (${length})`} key={resourceType}>
              <CollapsePanel dataSource={data} />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </div>
  );
};
export default memo(ResourceBind);
