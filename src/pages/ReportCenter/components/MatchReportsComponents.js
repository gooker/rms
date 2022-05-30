import React, { memo, useState } from 'react';
import { Col, Modal } from 'antd';
import FormTable from './FormTable';
import Pie from './Pie';
import Line from './Line';
import Bar3d from './Bar3d';

const MatchReportsComponents = (props) => {
  const { type, description, data, remove, extra, deletable, filterDateOnChange, vehicleType } = props;

  const [toggle, setToggle] = useState(false);

  const charts = () => {
    if (type === 'pie') {
      return (
        <Col span={12} style={{ marginBottom: 0, padding: '10px' }}>
          <FormTable
            vehicleType={vehicleType}
            onShow={() => {
              setToggle(true);
            }}
            filterDateOnChange={filterDateOnChange}
            description={description}
            data={data}
            remove={remove}
            deletable={deletable}
            info={extra}
          >
            <Pie
              style={{ height: 400 }}
              data={data}
              title={description.title}
              subtext={description.subtext}
              description={description}
              info={extra}
              vehicleType={vehicleType}
            />
          </FormTable>
        </Col>
      );
    } else if (['line', 'bar'].includes(type)) {
      return (
        <Col span={24} style={{ marginBottom: 0, padding: '10px' }}>
          <FormTable
            onShow={() => {
              setToggle(true);
            }}
            filterDateOnChange={filterDateOnChange}
            description={description}
            data={data}
            remove={remove}
            deletable={deletable}
            info={extra}
          >
            <Line
              info={extra}
              style={{ height: 400 }}
              data={data}
              title={description.title}
              subtext={description.subtext}
              description={description}
              type={type}
              vehicleType={vehicleType}
            />
          </FormTable>
        </Col>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {charts()}
      <Modal
        title={description.title}
        footer={null}
        width={1200}
        visible={toggle}
        style={{ minHeight: 700, top: 30 }}
        onCancel={() => {
          setToggle(false);
        }}
      >
        <Bar3d
          info={extra}
          style={{ height: 800 }}
          data={data}
          title={description.title}
          subtext={description.subtext}
          description={description}
          type={type}
        />
      </Modal>
    </>
  );
};
export default memo(MatchReportsComponents);
