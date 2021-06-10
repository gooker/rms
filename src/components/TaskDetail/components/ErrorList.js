import React from 'react';
import { List, Col, Row } from 'antd';
import { formatMessage } from '@/utils/Lang';
import ErrorCodeFault from './ErrorCodeFault';
import { dateFormat } from '@/utils/Utils';
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
    const { errorCodes } = props;
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
          <DescriptionItem
            title={<span>{formatMessage({ id: 'app.taskDetail.firstTime' })}</span>}
            content={<span>{dateFormat(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
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
    <div className={styles.element}>
      <List
        dataSource={agvErrorList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row key={item.uniqueKey}>
                  <Col span={12}>{dateFormat(item.updateTime).format('MM-DD HH:mm:ss')}</Col>
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
