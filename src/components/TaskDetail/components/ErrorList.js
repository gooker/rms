import React, { memo } from 'react';
import { Col, List, Row } from 'antd';
import { convertToUserTimezone, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ErrorCodeFault from './ErrorCodeFault';
import styles from '../taskDetail.module.less';
import commonStyles from '@/common.module.less';

const DescriptionItem = ({ title, content, style }) => (
  <div className={commonStyles.descriptionItem} style={{ ...style }}>
    <div className={commonStyles.itemTitle}>{title}:</div>
    {content}
  </div>
);

const ErrorList = (props) => {
  const { vehicleErrorList } = props;

  function renderDescription(record) {
    const { onDetail, errorCodes } = props;
    const keyName = {};
    const extraData = () => {
      if (record.vehicleErrorType === 'SOFTWARE_ERR0R') {
        return null;
      }
      if (errorCodes != null && record.errorCode != null && errorCodes[record.errorCode] != null) {
        keyName.preData = errorCodes[record.errorCode].preDataDefinition;
        keyName.curData = errorCodes[record.errorCode].curDataDefinition;
      }
      return (
        <>
          <Col span={12}>
            <DescriptionItem
              title={keyName.preData || formatMessage({ id: 'app.taskDetail.Additional1' })}
              content={record.preData}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title={keyName.curData || formatMessage({ id: 'app.taskDetail.Additional2' })}
              content={record.curData}
            />
          </Col>
        </>
      );
    };
    return (
      <Row key={record.uniqueKey}>
        <Col span={12}>
          {onDetail ? (
            <DescriptionItem
              title={
                <span>
                  <FormattedMessage id="app.task.id" />
                </span>
              }
              content={
                <span
                  onClick={() => {
                    onDetail(record.taskId);
                  }}
                  className={styles.tableBarDouble}
                >
                  {record.taskId}
                </span>
              }
            />
          ) : null}
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={<span>{formatMessage({ id: 'app.taskDetail.firstTime' })}</span>}
            content={
              <span>{convertToUserTimezone(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={<span>{formatMessage({ id: 'app.taskDetail.reports' })}</span>}
            content={
              <span>
                {record.count}
                {formatMessage({ id: 'app.taskDetail.number' })}
              </span>
            }
          />
        </Col>

        {extraData()}

        {/* 软件错误 */}
        {record.vehicleErrorType === 'SOFTWARE_ERR0R' && (
          <Col span={24}>
            <DescriptionItem
              title={<span>{formatMessage({ id: 'app.taskDetail.errorMessage' })}</span>}
              content={<span>{record.errorContent}</span>}
            />
          </Col>
        )}
      </Row>
    );
  }

  // 错误名称
  function renderErrorName(content) {
    if (content.vehicleErrorType === 'SOFTWARE_ERR0R') {
      return content.errorCodeName;
    }
    if (content) {
      return <ErrorCodeFault record={content} />;
    }
    return null;
  }

  return (
    <div style={{ width: '100%' }}>
      <List
        dataSource={vehicleErrorList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row key={item.uniqueKey}>
                  <Col span={12}>
                    {convertToUserTimezone(item.updateTime).format('MM-DD HH:mm:ss')}
                  </Col>
                  <Col span={12}>{renderErrorName(item)}</Col>
                </Row>
              }
              description={renderDescription(item)}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default memo(ErrorList);
