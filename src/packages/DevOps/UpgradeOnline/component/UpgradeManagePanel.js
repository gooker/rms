import React, { memo, useEffect, useState } from 'react';
import { Progress, Table, Typography } from 'antd';
import { useMap } from 'ahooks';
import axios from 'axios';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import UpgradeUploader from './UpgradeUploader';
import style from '../upgradeOnline.module.less';

const UpgradeManagePanel = (props) => {
  const { type } = props;

  const [packages, setPackages] = useState([]);
  const [, { set, get, remove }] = useMap([]); // {id:70}

  const columns = [
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'upgradeOnline.upload.lastModifyTime' }),
      dataIndex: 'lastModifyTime',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      render: (text, record) => {
        const progress = get(record.id);
        if (!isNull(progress)) {
          return <Progress type='circle' percent={progress} width={40} />;
        } else {
          return (
            <Typography.Link
              onClick={() => {
                downloadPackage(record);
              }}
            >
              <FormattedMessage id={'app.button.download'} />
            </Typography.Link>
          );
        }
      },
    },
  ];

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    axios.get('http://localhost:5000/list').then((response) => {
      const result = response.data.map((name) => ({ id: getRandomString(6), name }));
      setPackages(result);
    });
  }

  function downloadPackage({ id, name }) {
    axios
      .get(`http://localhost:5000/download?fileName=${name}`, {
        responseType: 'blob', //TIPS: important
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const currentProgress = Math.round((loaded * 100) / total);
          set(id, currentProgress);
        },
      })
      .then((response) => {
        const blobURL = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = blobURL;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        remove(id);

        // 释放资源
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobURL);
      });
  }

  return (
    <>
      <UpgradeUploader onFinish={refresh} />
      <div className={style.packsList}>
        <div>
          <Typography.Link onClick={refresh}>
            <FormattedMessage id={'app.button.refresh'} />
          </Typography.Link>
        </div>
        <Table columns={columns} dataSource={packages} pagination={false} />
      </div>
    </>
  );
};
export default memo(UpgradeManagePanel);
