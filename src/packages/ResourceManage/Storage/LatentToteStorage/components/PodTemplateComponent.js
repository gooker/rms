import React, { memo, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Row, Col, Switch, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import {
  isNull,
  getFormLayout,
  formatMessage,
  getRandomString,
  isStrictNull,
  dealResponse,
} from '@/utils/util';
import LatentTotePodTemplateDetail from './PodTemplateDetail';
import { addLatentTotePodType } from '@/services/latentTote';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(7, 16);

const LatentTotePodTemplate = (props) => {
  const { visible, onClose, updateRecord, onRefresh } = props;
  // 货架编码
  const [code, setCode] = useState(`ltp_${getRandomString(8)}`);
  const [isCapping, setIsCapping] = useState(false);
  const [binData, setBinData] = useState(null);
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!isStrictNull(updateRecord)) {
      setCode(updateRecord.code);
      setIsCapping(updateRecord.isCapping);
    }
  }, []);

  // 此方法大保存的时候 调用
  function dataTranslate(podParams) {
    const {
      rows,
      columns,
      width,
      height,
      depth,
      sideWidth,
      storageSpace,
      floorSpace,
      bottomHeight,
      isCapping,
    } = podParams;
    // 计算储位宽度
    const binWidth = Math.floor((width - sideWidth * 2 - storageSpace * (columns + 1)) / columns);
    //储位高度
    const floorlength = isCapping ? rows : rows - 1;
    const binHeight = Math.floor((height - bottomHeight - floorlength * floorSpace) / rows);
    const binDepth = depth;

    const binsA = [];
    for (let r = 0; r < rows; r++) {
      const currentRowArray = [];
      for (let c = 0; c < columns; c++) {
        currentRowArray.push({
          code: `A${getCharCode(r, c + 1)}`,
          height: binHeight,
          width: binWidth,
          depth: binDepth,
          barycenterX: getBaryX(c + 1, binWidth, columns, storageSpace),
          barycenterY: binDepth / 2,
          barycenterZ: getBaryZ(binHeight, floorSpace, r),
        });
      }
      binsA.push(currentRowArray);
    }

    setBinData({ bins: binsA, ...podParams });
  }

  function getCharCode(i, c) {
    const charcode = String.fromCharCode(65 + i);
    const columNum = c >= 10 ? c : `0${c}`;
    return `${charcode}${columNum}`;
  }

  function getBaryX(columIndex, w, columns, storageSpace) {
    const ceilNum = Math.ceil(columns / 2);
    let barycenterx = '';
    if (columns % 2 === 0) {
      if (columIndex <= ceilNum) {
        barycenterx =
          (ceilNum - columIndex) * storageSpace + (1 / 2) * w + (ceilNum - columIndex) * w;
      } else {
        barycenterx =
          (ceilNum - (columIndex - 1)) * storageSpace +
          (1 / 2) * w +
          (ceilNum - (columIndex - 1)) * w;
      }
    } else {
      if (columIndex === ceilNum) {
        barycenterx = 0;
      } else {
        barycenterx = (ceilNum - columIndex) * storageSpace + (ceilNum - columIndex) * w;
      }
    }
    return barycenterx;
  }

  function getBaryZ(binHeight, floorSpace, currentNum) {
    const barycenterZ = (1 / 2) * binHeight + floorSpace * currentNum + currentNum * binHeight;
    return Number(barycenterZ);
  }

  function detailChange(data) {
    setBinData(data);
  }

  function onExecuting() {
    formRef
      .validateFields()
      .then((values) => {
        dataTranslate(values);
      })
      .catch(() => {});
  }

  // 生成预览
  function onValuesChange(_, allValues) {
    const { rows, columns, weight } = allValues;
    if (!isStrictNull(rows) && !isStrictNull(columns) && !isStrictNull(weight)) {
      const binsA = [];
      for (let r = 0; r < rows; r++) {
        const currentRowArray = [];
        for (let c = 0; c < columns; c++) {
          currentRowArray.push({
            code: `A${getCharCode(r, c + 1)}`,
            height: 0,
            width: 0,
            depth: 0,
            barycenterX: 0,
            barycenterY: 0,
            barycenterZ: 0,
          });
        }
        binsA.push(currentRowArray);
      }

      setBinData({ bins: binsA, ...allValues });
    }
  }

  async function onSave() {
    const { bins, ...params } = binData;
    // 判断层重不为空
    let binsB = [...bins];
    let newBinsB = [];
    binsB.forEach((rowBins) => {
      const currentArray = [];
      rowBins.forEach((currentCol) => {
        currentArray.push({
          ...currentCol,
          code: currentCol.code.replace('A', 'C'),
          barycenterY: -currentCol.barycenterY,
        });
      });
      newBinsB.push(currentArray);
    });

    const podParams = { ...params };
    delete podParams.bottomHeight;
    const requsetBody = {
      ...podParams,
      podFaceList: [
        {
          bottomHeight: params.bottomHeight,
          name: 'A',
          angle: 0,
          bins,
        },
        {
          bottomHeight: params.bottomHeight,
          name: 'C',
          angle: 180,
          newBinsB,
        },
      ],
    };

    const response = await addLatentTotePodType(requsetBody);
    if (!dealResponse(response)) {
      onClose();
      onRefresh();
    }
  }

  return (
    <Modal
      destroyOnClose
      style={{ top: 30 }}
      // footer={null}
      onCancel={onClose}
      onOk={onSave}
      visible={visible}
      width={800}
      cancelText={formatMessage({ id: 'app.button.close' })}
      title={
        <>
          {isNull(updateRecord) ? (
            <FormattedMessage id="app.button.add" />
          ) : (
            <FormattedMessage id="app.button.edit" />
          )}
          <FormattedMessage id="latentTote.podTemplateStorage" />
        </>
      }
      bodyStyle={{ height: `500px`, overflow: 'auto' }}
    >
      <div style={{ marginTop: 10 }}>
        <Row>
          <Col span={11}>
            <Form labelWrap form={formRef} {...formItemLayout} onValuesChange={onValuesChange}>
              <Form.Item hidden name="code" initialValue={code}>
                <Input />
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'app.common.name' })}
                name="name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <div
                style={{
                  border: '1px solid #ededed',
                  borderRadius: 6,
                  padding: 10,
                  margin: '0px 10px 10px 0px',
                }}
              >
                <Form.Item
                  label={formatMessage({ id: 'latentTote.podTemplateStorage.weight' })}
                  name="weight"
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'kg'} />
                </Form.Item>

                <Form.Item
                  label={formatMessage({ id: 'editor.batchAddCell.rows' })}
                  name="rows"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label={formatMessage({ id: 'editor.batchAddCell.columns' })}
                  name="columns"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </div>

              <Form.Item
                label={formatMessage({ id: 'app.common.width' })}
                name="width"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'app.common.height' })}
                name="height"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'app.common.depth' })}
                name="depth"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>

              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.sideWidth' })}
                name="sideWidth"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
              {/* 储位间隔 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.storageSpace' })}
                name="storageSpace"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>

              {/* 层板间隔 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.rowSpace' })}
                name="floorSpace"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>

              {/* 货架底部高度 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.bottomHeight' })}
                name="bottomHeight"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>

              {/* 是否封顶 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.isCapping' })}
                name="isCapping"
                rules={[{ required: true }]}
                initialValue={isCapping}
              >
                <Switch />
              </Form.Item>
            </Form>

            {/* <Form.Item {...formItemLayoutNoLabel}>
              <Button onClick={onExecuting}>
                <FormattedMessage id={'app.button.execute'} />
              </Button>
            </Form.Item> */}
          </Col>
          <Col span={13}>
            <div style={{ height: '100%', borderLeft: '1px solid #efefef' }}>
              {binData && (
                <LatentTotePodTemplateDetail binData={binData} detailChange={detailChange} />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
export default memo(LatentTotePodTemplate);
