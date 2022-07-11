import React, { memo, useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { groupBy } from 'lodash';
import { dealResponse } from '@/utils/util';
import { fetchAllResourceBindMapping, fetchBindableResourceMapping } from '@/services/resourceService';
import CascadeBindSelector from './component/CascadeBindSelector';
import CollapsePanel from '@/packages/ResourceManage/ResourceBind/component/CollapsePanel';
import commonStyle from '@/common.module.less';

const ResourceBind = () => {
  const [resource, setResource] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchAllResourceBindMapping(), fetchBindableResourceMapping()]).then(
      ([allBindMapping, bindableResource]) => {
        if (!dealResponse(allBindMapping)) {
          setDataSource(allBindMapping);
        }
        if (!dealResponse(bindableResource)) {
          setResource(bindableResource);
        }
      },
    );
  }, []);

  function refreshList() {
    fetchAllResourceBindMapping().then((response) => {
      if (!dealResponse(response)) {
        setDataSource(response);
      }
    });
  }

  function getListData(type) {
    return dataSource.filter((item) => item.bindType === type);
  }

  function getTypePayloadLength(data) {
    return Object.keys(groupBy(data, 'resourceType')).length;
  }

  return (
    <div className={commonStyle.commonPageStyle}>
      <CascadeBindSelector datasource={resource} refresh={refreshList} />
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
