import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMap } from 'ahooks';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { formatMessage, generateWebHookTestParam, getRandomString, isNull } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import CommonModal from '@/components/CommonModal';
import FormattedMessage from '@/components/FormattedMessage';
import { testWebHook } from '@/services/commonService';

const Colors = Dictionary().color;
const TestState = {
  loading: 'Loading',
  success: 'success',
  failed: 'failed',
};

const WebHookBatchTestModal = (props) => {
  const { data, onCancel, allQueue } = props;

  const [, { set, reset, get }] = useMap([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (!isNull(data)) {
      // 生成基础数据: 包含随机ID和队列名称
      const { urlMappingRelation, ...rest } = data;
      const _topics = urlMappingRelation.map((item) => {
        const target = find(allQueue, { webHookTopic: item.topic });
        if (target) {
          return {
            id: getRandomString(6),
            ...rest,
            urlMappingRelation: item,
            webHookTopicDTO: target,
            name: target.name,
          };
        }
      });
      setTopics(_topics);
      for (const topic of _topics) {
        const loopId = topic.id;
        set(loopId, TestState.loading);
        const requestBody = generateWebHookTestParam(topic);
        testWebHook(requestBody).then((response) => {
          if (response[0].code === '0') {
            set(loopId, TestState.success);
          } else {
            set(loopId, TestState.failed);
          }
        });
      }
    }
  }, [data]);

  function cancelAndClose() {
    RmsConfirm({
      content: formatMessage('webHook.button.cancel.tip'),
      onOk: () => {
        onCancel();
      },
    });
  }

  function getTestState(id) {
    const state = get(id);
    switch (state) {
      case TestState.loading:
        return <LoadingOutlined />;
      case TestState.success:
        return <CheckOutlined style={{ color: Colors.green }} />;
      default:
        return <CloseOutlined style={{ color: Colors.red }} />;
    }
  }

  return (
    <CommonModal
      title={formatMessage({ id: 'webHook.batchTest' })}
      visible={!isNull(data)}
      footer={[
        <Button key={'cancel'} type={'primary'} onClick={cancelAndClose}>
          <FormattedMessage id={'webHook.button.cancel'} />
        </Button>,
      ]}
    >
      <ul>
        {topics.map((item, index) => (
          <li key={item.id} style={{ height: 30 }}>
            <Row gutter={8}>
              <Col>{`(${index + 1})`}</Col>
              <Col>{item.name}</Col>
              <Col>{getTestState(item.id)}</Col>
            </Row>
          </li>
        ))}
      </ul>
    </CommonModal>
  );
};
export default connect(({ global }) => ({
  allQueue: global.allQueue,
}))(memo(WebHookBatchTestModal));
