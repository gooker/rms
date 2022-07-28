import React, { memo, useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import TitleCard from '@/components/TitleCard';
import UpgradeUploader from './component/UpgradeUploader';
import commonStyle from '@/common.module.less';
import style from './upgradeOnline.module.less';
import axios from 'axios';

const UpgradeOnline = (props) => {
  const {} = props;

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifyTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Typography.Link
            onClick={() => {
              download(record.name);
            }}
          >
            下载
          </Typography.Link>
        );
      },
    },
  ];

  const [fePacks, setFePacks] = useState([]);
  const [downloading, setDownLoading] = useState([]);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    axios.get('http://localhost:5000/list').then((response) => {
      const result = response.data.map((name) => ({ name }));
      setFePacks(result);
    });
  }

  function download(fileName) {
    axios.get(`http://localhost:5000/download?fileName=${fileName}`).then((response) => {
      console.log(response);
    });
  }

  return (
    <div className={commonStyle.commonPageStyle}>
      <TitleCard title={'前端'}>
        <UpgradeUploader onFinish={refresh} />
        <div className={style.packsList}>
          <div>
            <Typography.Link onClick={refresh}>刷新</Typography.Link>
          </div>
          <Table size={'small'} columns={columns} dataSource={fePacks} pagination={false} />
        </div>
      </TitleCard>
      <TitleCard title={'中台'}>1111</TitleCard>
      <TitleCard title={'历史备份'}>1111</TitleCard>
    </div>
  );
};
export default memo(UpgradeOnline);
