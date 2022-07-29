import React, { memo, useState } from 'react';
import { Progress, Table, Typography } from 'antd';
import { InfoOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import style from '../upgradeOnline.module.less';
import { UpgradeBackup } from '@/mockData';
import { formatMessage, isNull } from '@/utils/util';
import { useMap } from 'ahooks';

const { Text } = Typography;

const BackupPanel = () => {
  const [, { set, get, remove }] = useMap([]); // {id:70}
  const [datasource, setDatasource] = useState([...UpgradeBackup]);

  const columns = [
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'upgradeOnline.lastModifyTime' }),
      dataIndex: 'lastModifyTime',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      render: (text, record) => {
        if (record.type === 'file') {
          const progress = get(record.id);
          if (!isNull(progress)) {
            return <Progress type='circle' percent={progress} width={40} />;
          } else {
            return (
              <Typography.Link>
                <FormattedMessage id={'app.button.download'} />
              </Typography.Link>
            );
          }
        } else {
          return (
            <Typography.Link>
              <FormattedMessage id={'app.button.delete'} />
            </Typography.Link>
          );
        }
      },
    },
  ];

  function refresh() {
    //
  }

  return (
    <div className={style.backupList}>
      <div>
        <Text type='danger'>
          <InfoOutlined />
          <FormattedMessage id={'upgradeOnline.backup.tip'} />
        </Text>
        <Typography.Link onClick={refresh}>
          <FormattedMessage id={'app.button.refresh'} />
        </Typography.Link>
      </div>
      <Table columns={columns} dataSource={datasource} pagination={false} rowKey={({ id }) => id} />
    </div>
  );
};
export default memo(BackupPanel);
