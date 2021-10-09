import React, { useEffect } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { isEqual } from 'lodash';
import { useSelections } from '@umijs/hooks';

const CheckBoxFun = (props) => {
  const defaultChecked = props.checked || [];
  const { dataSource, height = 80, button } = props;
  const { selected, allSelected, isSelected, toggle, toggleAll, partiallySelected, setSelected } =
    useSelections(
      dataSource.map(({ key }) => {
        return key;
      }),
      defaultChecked,
    );

  useEffect(() => {
    if (!isEqual(defaultChecked, selected)) {
      setSelected(props.checked || []);
    }
  }, [defaultChecked]);

  useEffect(() => {
    const { onChange, onSelect } = props;
    if (onChange) {
      onChange(selected);
    }
    if (onSelect) {
      onSelect(selected);
    }
  }, [selected]);

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        height,
        justifyContent: 'space-between',
      }}
    >
      <Checkbox checked={allSelected} onClick={toggleAll} indeterminate={partiallySelected}>
        ALL
      </Checkbox>
      <Row>
        {dataSource.map(({ key: o, label }) => {
          return (
            <Col
              span={Math.floor(24 / dataSource.length)}
              key={o}
              {...props.col}
              style={{ marginBottom: 5 }}
            >
              <Checkbox checked={isSelected(o)} onClick={() => toggle(o)}>
                {label}
              </Checkbox>
            </Col>
          );
        })}
      </Row>
      {button && <Row>{button}</Row>}
    </div>
  );
};
export default CheckBoxFun;
