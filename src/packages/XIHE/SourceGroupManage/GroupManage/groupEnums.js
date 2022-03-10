import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { IconFont } from '@/components/IconFont';
import FormattedMessage from '@/components/FormattedMessage';

// 分组管理
export const GroupManageCategory = {
  SelectLogic: 'SelectLogic',
  StorageConfig: 'StorageConfig',
  ViewGroupConfig: 'ViewGroupConfig',
  Export: 'Export',
  Upload: 'Upload',
};

export const GroupManageRightTools = [
  {
    label: <FormattedMessage id={'app.map.logicArea'} />,
    value: GroupManageCategory.SelectLogic,
    icon: <IconFont type={'icon-luoji'} />,
  },
  {
    label: <FormattedMessage id={'groupManage.manage'} />,
    value: GroupManageCategory.StorageConfig,
    icon: <IconFont type={'icon-layout'} />,
  },
  {
    label: <FormattedMessage id={'groupManage.config.detail'} />,
    value: GroupManageCategory.ViewGroupConfig,
    icon: <ExclamationCircleOutlined />,
  },
  {
    label: <FormattedMessage id={'app.button.export'} />,
    value: GroupManageCategory.Export,
    icon: <IconFont type={'icon-download'} />,
    style: { paddingTop: '5px' },
  },
  // {
  //   label: <FormattedMessage id={'app.button.import'} />,
  //   value: GroupManageCategory.Upload,
  //   icon: <IconFont type={'icon-upload'} />,
  //   style: { paddingTop: '5px' },
  // },
];
