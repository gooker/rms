import React, { memo } from 'react';
import { Col, Row, Slider, Menu, Dropdown } from 'antd';
import { DownOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import commonStyle from '@/common.module.less';
import styles from './mapRatioSlider.module.less';

const MapRatioSlider = (props) => {
  const { onChange, mapMinRatio, mapRatio } = props;

  // viewport scale 值转换成百分比
  function inputValue() {
    const value = Math.ceil(((mapRatio - mapMinRatio) / (1 - mapMinRatio)) * 100);
    if (Number.isNaN(value)) {
      return 0;
    }
    return value;
  }

  // 百分比转换成viewport scale 值
  function outputValue(value) {
    onChange(mapMinRatio + (1 - mapMinRatio) * (value / 100));
  }

  function onDecrease() {
    let currentSliderValue = inputValue() - 10;
    if (currentSliderValue < 0) {
      currentSliderValue = 0;
    }
    outputValue(currentSliderValue);
  }

  function onIncrease() {
    let currentSliderValue = inputValue() + 10;
    if (currentSliderValue > 100) {
      currentSliderValue = 100;
    }
    outputValue(currentSliderValue);
  }

  function onMenuChange({ key }) {
    outputValue(key);
  }

  const menu = (
    <Menu onClick={onMenuChange}>
      <Menu.Item key={0}>0%</Menu.Item>
      <Menu.Item key={25}>25%</Menu.Item>
      <Menu.Item key={50}>50%</Menu.Item>
      <Menu.Item key={75}>75%</Menu.Item>
      <Menu.Item key={100}>100%</Menu.Item>
    </Menu>
  );

  return (
    <Row className={styles.mapRatioSlider} gutter={10}>
      <Col className={commonStyle.flexCenter}>
        <MinusOutlined onClick={onDecrease} style={{ color: '#e8e8e8' }} />
      </Col>
      <Col flex={1}>
        <Slider
          min={0}
          max={100}
          step={1}
          tooltipVisible={false}
          value={inputValue()}
          onChange={outputValue}
        />
      </Col>
      <Col className={commonStyle.flexCenter}>
        <PlusOutlined onClick={onIncrease} style={{ color: '#e8e8e8' }} />
      </Col>
      <Col className={commonStyle.flexCenter}>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {`${inputValue()}%`} <DownOutlined />
          </a>
        </Dropdown>
      </Col>
    </Row>
  );
};
export default memo(MapRatioSlider);
