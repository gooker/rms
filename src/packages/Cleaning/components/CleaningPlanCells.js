import React, { Component } from 'react';
import { Row, Col, Popover, Divider, Button, Icon, Spin } from 'antd';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import find from 'lodash/find';
import { fetchCleaningPlan } from '@/services/api';
import styles from '../index.module.less';
export function getSacleNum(value) {
  if (!isNull(value)) {
    const _value = JSON.stringify(value);
    const length = _value.length;
    if (length > 3 && length < 6) {
      return 0.7;
    }
    if (length >= 7 && length < 9) {
      return 0.5;
    }
    if (length >= 9) {
      return 0.3;
    }
    return 1;
  }
  return 1;
}

const bgColor = {
  Executing: '#34bf49',
  Waiting: '#fbb034',
  Finished: '#808080',
};

export default class CleaningPlanCells extends Component {
  state = {
    originalRecord: {},
    planCellList: [],
    loading: false,
  };
  componentDidMount() {
    const { data } = this.props;
    this.setState({ originalRecord: data, planCellList: data?.planCellList || [] });
  }

  freshData = async () => {
    const { originalRecord } = this.state;
    this.setState({ loading: true });
    const currentRes = await fetchCleaningPlan();
    if (!dealResponse(currentRes)) {
      const allPlanData = [...currentRes];
      const currentRecord = find(allPlanData, (record) => {
        return record?.area.sort().toString() == originalRecord?.area.sort().toString();
      });
      this.setState({
        originalRecord: currentRecord,
        planCellList: currentRecord?.planCellList || [],
      });
    }
    this.setState({ loading: false });
  };

  content = (item) => {
    const {
      originalRecord: { cumulativeCycle },
    } = this.state;
    const { skipTimes, successTimes, isMissCode, allocationedAgv } = item;
    return (
      <Row>
        {!isNull(skipTimes) && (
          <Col span={24} className={styles.mb10}>
            <div className={[styles.tips, styles.tips_circle, styles.skipcolor].join(' ')}>
              {skipTimes}
            </div>
            <div className={styles.tips}>
              {formatMessage(
                { id: 'cleaningCenter.skip.tips' },
                { day: cumulativeCycle, num: skipTimes },
              )}
            </div>
          </Col>
        )}
        {!isNull(successTimes) && (
          <Col span={24} className={styles.mb10}>
            <div className={[styles.tips, styles.tips_circle, styles.successcolor].join(' ')}>
              {successTimes}
            </div>
            <div className={styles.tips}>
              {formatMessage(
                { id: 'cleaningCenter.success.tips' },
                { day: cumulativeCycle, num: successTimes },
              )}
            </div>
          </Col>
        )}

        {isMissCode && (
          <Col span={24} className={styles.mb10}>
            <div className={[styles.tips, styles.tips_circle, styles.skipcolor].join(' ')}>E</div>
            <div className={styles.tips}>
              {formatMessage({ id: 'cleaningCenter.throwcode.tips' })}
            </div>
          </Col>
        )}
        {!isNull(allocationedAgv) && (
          <Col span={24} className={styles.mb10}>
            <div className={[styles.tips, styles.tips_rect, styles.allotcolor].join(' ')}>
              {allocationedAgv}
            </div>
            <div className={styles.tips}>
              {formatMessage({ id: 'cleaningCenter.allot.tips' }, { value: allocationedAgv })}
            </div>
          </Col>
        )}
      </Row>
    );
  };
  render() {
    const { planCellList, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: '100%', display: 'flex', flexFlow: 'column nowrap' }}>
          <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <div>
              <span className={styles.span} style={{ background: bgColor['Executing'] }} />{' '}
              <FormattedMessage id="cleaningCenter.executing" />
            </div>
            <div style={{ margin: '0 20px' }}>
              <span className={styles.span} style={{ background: bgColor['Waiting'] }} />{' '}
              <FormattedMessage id="cleaningCenter.waiting" />
            </div>
            <div>
              <span className={styles.span} style={{ background: bgColor['Finished'] }} />{' '}
              <FormattedMessage id="cleaningCenter.complete" />
            </div>
            <div style={{ flex: 1, textAlign: 'end' }}>
              <Button
                onClick={() => {
                  this.freshData();
                }}
              >
                <Icon type="reload" /> <FormattedMessage id="form.flash" />
              </Button>
            </div>
          </div>
          <Divider />
          <Row style={{ marginBottom: 30, display: 'flex', flexFlow: 'row wrap' }}>
            {planCellList?.map((item) => {
              return (
                <>
                  <Popover
                    content={<Col style={{ minHeight: 260, width: 280 }}>{this.content(item)}</Col>}
                    title={item?.cellId}
                  >
                    <div
                      style={{
                        display: 'flex',
                        margin: '7px 25px',
                        height: 40,
                        width: 40,
                      }}
                      key={item?.cellId}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          background: 'green',
                          borderRadius: '15%',
                          border: '1px solid #716f6f',
                          padding: '5px 8px',
                          backgroundColor: `${bgColor[item.cellStatus]}`,
                        }}
                        key={item?.cellId}
                      >
                        {item?.cellId}
                        {!isNull(item?.skipTimes) && (
                          <div
                            className={`${styles.commonStyle} ${styles.circle} ${styles.skipcolor}`}
                            style={{ left: '-15px', top: '-15px' }}
                          >
                            <div>{item.skipTimes}</div>
                          </div>
                        )}
                        {!isNull(item?.successTimes) && (
                          <div
                            className={[
                              styles.commonStyle,
                              styles.circle,
                              styles.successcolor,
                            ].join(' ')}
                            style={{
                              right: '-15px',
                              top: '-15px',
                            }}
                          >
                            <div>{item.successTimes}</div>
                          </div>
                        )}
                        {!isNull(item?.allocationedAgv) && (
                          <div
                            className={[styles.commonStyle, styles.rect, styles.allotcolor].join(
                              ' ',
                            )}
                            style={{
                              left: '-25px',
                              bottom: '-16px',
                            }}
                          >
                            <div
                              style={{
                                transform: `scale(${getSacleNum(item?.allocationedAgv)})`,
                                textAlign: 'center',
                              }}
                            >
                              {item.allocationedAgv}
                            </div>
                          </div>
                        )}
                        {item?.isMissCode && (
                          <div
                            className={[styles.commonStyle, styles.circle, styles.skipcolor].join(
                              ' ',
                            )}
                            style={{
                              right: '-15px',
                              bottom: '-15px',
                            }}
                          >
                            <div>E</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popover>
                </>
              );
            })}
          </Row>
        </div>
      </Spin>
    );
  }
}
