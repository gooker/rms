import React, { memo } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage } from '@/utils/util';
import commonStyles from '@/common.module.less';
import { deleteChargingStrategyById } from '@/services/resourceService';
import RmsConfirm from '@/components/RmsConfirm';

const SearchComponent = (props) => {
  const { selectedRowKeys, addStrategy, getData } = props;

  async function deleteStrategy() {
    const id = selectedRowKeys[0];
    RmsConfirm({
      content: formatMessage({ id: 'app.message.delete.confirm' }),
      onOk: async () => {
        const response = await deleteChargingStrategyById({ Id: id });
        if (!dealResponse(response, 1)) {
          getData();
        }
      },
    });
  }

  return (
    <div className={commonStyles.tableToolLeft}>
      <Button type='primary' onClick={addStrategy}>
        <PlusOutlined /> <FormattedMessage id='app.button.add' />
      </Button>
      <Button danger disabled={selectedRowKeys.length !== 1} onClick={deleteStrategy}>
        <DeleteOutlined /> <FormattedMessage id='app.button.delete' />
      </Button>
      <Button onClick={getData}>
        <RedoOutlined /> <FormattedMessage id='app.button.refresh' />
      </Button>
    </div>
  );
};
export default memo(SearchComponent);
