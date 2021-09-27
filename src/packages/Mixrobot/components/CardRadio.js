import React from 'react';
import { Row, Col } from 'antd';

const SelectedStyle = {
  background: '#c4dff6',
};
const ItemStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};

/**
 * type 标记该组件是用于配置工作站还是通用站点
 */
class CardRadio extends React.PureComponent {
  render() {
    const { type = 'workStation', value, onChange } = this.props;
    return (
      <Row type="flex" style={{ height: '100%' }}>
        {/* 常规工作站 */}
        {type === 'workStation' && (
          <>
            <Col span={12}>
              <div
                style={value === 'work_station' ? { ...SelectedStyle, ...ItemStyle } : ItemStyle}
                onClick={() => {
                  onChange('work_station');
                }}
              >
                <img
                  alt={''}
                  style={{ width: '80%', height: '80%' }}
                  src={require('@/../public/webView/work_station.png')}
                />
              </div>
            </Col>
            <Col span={12}>
              <div
                style={value === 'work_station_3' ? { ...SelectedStyle, ...ItemStyle } : ItemStyle}
                onClick={() => {
                  onChange('work_station_3');
                }}
              >
                <img
                  alt={''}
                  style={{ width: '80%', height: '80%' }}
                  src={require('@/../public/webView/work_station_3.png')}
                />
              </div>
            </Col>
          </>
        )}

        {/* 通用站点 */}
        {type === 'common' && (
          <Col span={12}>
            <div
              style={value === 'common' ? { ...SelectedStyle, ...ItemStyle } : ItemStyle}
              onClick={() => {
                onChange('common');
              }}
            >
              <img
                alt={''}
                style={{ width: '80%', height: '80%' }}
                src={require('@/../public/webView/common.png')}
              />
            </div>
          </Col>
        )}
        {type === 'common' &&
          Array(8)
            .fill()
            .map((_, index) => (
              <Col key={index} span={12} style={{ height: 120 }}>
                <div
                  style={
                    value === `work_station_${index + 1}`
                      ? { ...SelectedStyle, ...ItemStyle }
                      : ItemStyle
                  }
                  onClick={() => {
                    onChange(`work_station_${index + 1}`);
                  }}
                >
                  <img
                    alt={''}
                    style={{ width: '80%', height: index + 1 === 8 ? '65%' : '80%' }}
                    src={require(`@/../public/webView/work_station_${index + 1}.png`)}
                  />
                </div>
              </Col>
            ))}
      </Row>
    );
  }
}
export default CardRadio;
