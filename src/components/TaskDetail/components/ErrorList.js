import React from 'react';
import { List, Col, Row } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { GMT2UserTimeZone, formatMessage } from '@/utils/util';
import ErrorCodeFault from './ErrorCodeFault';
import commonStyles from '@/common.module.less';
import styles from '../CenterOs.module.less';

const DescriptionItem = ({ title, content, style }) => (
  <div className={commonStyles.descriptionItem} style={{ ...style }}>
    <div className={commonStyles.itemTitle}>{title}:</div>
    {content}
  </div>
);

const ErrorList = React.memo((props) => {
  const { agvErrorList } = props;
  const renderDescription = (record) => {
    const { onDetail, errorCodes } = props;
    const keyName = {};
    const extraData = () => {
      if (record.agvErrorType === 'SOFTWARE_ERR0R') {
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
              <span>{GMT2UserTimeZone(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
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
        {record.agvErrorType === 'SOFTWARE_ERR0R' && (
          <Col span={24}>
            <DescriptionItem
              title={<span>{formatMessage({ id: 'app.taskDetail.errorMessage' })}</span>}
              content={<span>{record.errorContent}</span>}
            />
          </Col>
        )}
      </Row>
    );
  };

  // 错误名称
  const renderErrorName = (content) => {
    if (content.agvErrorType === 'SOFTWARE_ERR0R') {
      return content.errorCodeName;
    }
    if (content) {
      return <ErrorCodeFault record={content} />;
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      <List
        dataSource={agvErrorList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row key={item.uniqueKey}>
                  <Col span={12}>{GMT2UserTimeZone(item.updateTime).format('MM-DD HH:mm:ss')}</Col>
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
});
export default ErrorList;
