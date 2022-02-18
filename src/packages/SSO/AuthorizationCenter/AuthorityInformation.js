import React, { memo, useState } from 'react';
import { Descriptions, Badge, Tag, Button, Modal } from 'antd';
import { saveAs } from 'file-saver';
import UploadCert from './UploadCert';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const AuthorityInformation = (props) => {
  const { data, reAuth, updateAuth } = props;
  const [uploadCertVisible, setUploadCertVisible] = useState(null);

  const isExpired = data.lastDay * 1000 <= new Date().valueOf();

  function subString(content) {
    return (
      <span>
        {`${content.substring(0, 100)}.....`}
        <Button type="link" onClick={() => downloadApplyToken(content)}>
          <FormattedMessage id={'app.authCenter.download'} />
        </Button>
      </span>
    );
  }

  function downloadApplyToken(applyToken) {
    const blob = new Blob([applyToken], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, 'auth_apply_token.txt');
  }

  function renderAuthState() {
    return (
      <Badge
        status={isExpired ? 'error' : 'processing'}
        text={
          <span style={{ color: isExpired ? '#F5222D' : '#1890FF', fontSize: 15, fontWeight: 600 }}>
            {formatMessage({ id: `app.authCenter.authState.${isExpired ? 'expired' : 'normal'}` })}
          </span>
        }
      />
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'end', height: 40 }}>
        <Button
          type="primary"
          onClick={() => {
            setUploadCertVisible(true);
          }}
        >
          <FormattedMessage id={'app.authCenter.updateAuth'} />
        </Button>
        <Button type="link" onClick={reAuth}>
          <FormattedMessage id={'app.authCenter.reAuth'} />
        </Button>
      </div>
      <Descriptions bordered>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.authState' })} span={3}>
          {renderAuthState()}
        </Descriptions.Item>
        <Descriptions.Item
          span={3}
          label={formatMessage({ id: 'app.authCenter.field.applyToken' })}
        >
          {subString(data.applyToken)}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.authorizedNo' })}>
          {data.authorizedNo}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.type' })}>
          {formatMessage({ id: `app.authCenter.field.type.${data.type}` })}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.companyName' })}>
          {data.companyName}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.authorizedTime' })}>
          {new Date(data.authorizedTime).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.lastDay' })}>
          {new Date(data.lastDay * 1000).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.authorizedCompany' })}>
          {data.authorizedCompany}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.authorizedBy' })}>
          {data.authorizedBy}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.version' })}>
          {data.version}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.virtualAgvLimit' })}>
          {data.virtualAgvLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.realAgvLimit' })}>
          {data.realAgvLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.totalAgvLimit' })}>
          {data.totalAgvLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.sectionLimit' })}>
          {data.sectionLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.mapLimit' })}>
          {data.mapLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.logicPerMapLimit' })}>
          {data.logicPerMapLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.scopePerLogicLimit' })}>
          {data.scopePerLogicLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.cellsPerLogicLimit' })}>
          {data.cellsPerLogicLimit}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.adminType' })}>
          {formatMessage({ id: `app.authCenter.field.adminType.${data.adminType}` })}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.supportScenes' })}>
          {data.supportScenes.map((type) => (
            <Tag color="#1890FF" key={type}>
              {formatMessage({ id: `app.module.${type}` })}
            </Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.authCenter.field.highAvailable' })}>
          {formatMessage({ id: `app.common.${data.isHighAvailable}` })}
        </Descriptions.Item>
      </Descriptions>

      <Modal
        title={formatMessage({ id: 'app.authCenter.updateAuth.tip' })}
        footer={null}
        visible={uploadCertVisible}
        onCancel={() => {
          setUploadCertVisible(false);
        }}
      >
        <UploadCert
          afterUpload={() => {
            setUploadCertVisible(false);
            updateAuth();
          }}
        />
      </Modal>
    </div>
  );
};
export default memo(AuthorityInformation);
