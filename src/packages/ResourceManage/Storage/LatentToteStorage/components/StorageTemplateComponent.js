import React, { memo, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Row, Col, message } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import {
  isNull,
  getFormLayout,
  formatMessage,
  getRandomString,
  isStrictNull,
  dealResponse,
} from '@/utils/util';
import StorageTemplateDetail from './StorageTemplateDetail';
import { addOrUpdateLatentTotePodType } from '@/services/latentTote';

const { formItemLayout } = getFormLayout(7, 16);

const LatentTotePodTemplate = (props) => {
  const { visible, onClose, updateRecord, onRefresh } = props;
  // 货架编码
  const [binData, setBinData] = useState(null);
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!isStrictNull(updateRecord)) {
      const { name, row, column, width, height, depth, laminateHeight } = updateRecord;
      generatePodFace(updateRecord);
      formRef.setFieldsValue({
        name,
        row,
        column,
        width,
        height,
        depth,
        laminateHeight,
      });
    }
  }, []);

  // 编辑转换
  function generatePodFace(updateRecord) {
    const { podFaceList } = updateRecord;
    const { bins } = podFaceList[0] ?? [];
    setBinData(bins);
  }

  // 此方法大保存的时候 调用
  function dataTranslate(podParams) {
    const { width, height, depth, laminateHeight, column } = podParams;
    const binDepth = depth;

    const binsA = [];
    const allWidth = width * column;

    binData.forEach((rowBins, r) => {
      const currentArray = [];
      const currentColumn = rowBins.length;
      rowBins.forEach((currentCol, c) => {
        currentArray.push({
          ...currentCol,
          height,
          width: allWidth / currentColumn,
          depth: binDepth,
          barycenterX: getBaryX(c + 1, width, currentColumn),
          barycenterY: binDepth / 2,
          barycenterZ: getBaryZ(height, laminateHeight, r),
        });
      });
      binsA.push(currentArray);
    });

    return { bins: binsA, ...podParams };
  }

  function getCharCode(i, c) {
    const charcode = String.fromCharCode(65 + i);
    const columNum = c >= 10 ? c : `0${c}`;
    return `${charcode}${columNum}`;
  }

  function getBaryX(columIndex, w, columns) {
    const ceilNum = Math.ceil(columns / 2);
    let barycenterx = '';
    if (columns % 2 === 0) {
      if (columIndex <= ceilNum) {
        barycenterx = (1 / 2) * w + (ceilNum - columIndex) * w;
      } else {
        barycenterx = (1 / 2) * w + (ceilNum - (columIndex - 1)) * w;
      }
    } else {
      if (columIndex === ceilNum) {
        barycenterx = 0;
      } else {
        barycenterx = (ceilNum - columIndex) * w;
      }
    }
    return barycenterx;
  }

  function getBaryZ(binHeight, floorSpace, currentNum) {
    const barycenterZ = (1 / 2) * binHeight + floorSpace * currentNum + currentNum * binHeight;
    return Number(barycenterZ);
  }

  function detailChange(data, newrows) {
    setBinData(data);
    if (!isStrictNull(newrows)) {
      formRef.setFieldsValue({
        row: newrows,
      });
    }
  }

  /*
   *新增生成预览
   * */
  function onValuesChange(changedKey, allValues) {
    const { row: rows, column: columns, height } = allValues;

    let currentBin = binData?.bins || [];
    if (changedKey.hasOwnProperty('column')) {
      currentBin = []; // 列变更重量不保留
    }
    if (!isStrictNull(rows) && !isStrictNull(columns) && !isStrictNull(height)) {
      const binsA = [];
      for (let r = 0; r < rows; r++) {
        const currentRowArray = [];
        for (let c = 0; c < columns; c++) {
          const existItem = currentBin[r]?.[c] ?? {};
          currentRowArray.push({
            ...existItem,
            code: `A${getCharCode(r, c + 1)}`,
            height: height,
            width: 0,
            depth: 0,
            barycenterX: 0,
            barycenterY: 0,
            barycenterZ: 0,
          });
        }
        binsA.push(currentRowArray);
      }

      setBinData(binsA);
    }
  }

  function onSubmit() {
    formRef
      .validateFields()
      .then((values) => {
        // // 判断层重不为空
        if (!validateWeight()) {
          message.error(formatMessage({ id: 'latentTote.podTemplateStorage.bearWeight.required' }));
          return;
        }
        sendRquset(values);
      })
      .catch(() => {});
  }

  function validateWeight() {
    const result = new Set();
    binData?.forEach((rowBins) => {
      rowBins.forEach((currentCol) => {
        if (isStrictNull(currentCol?.bearWeight) || currentCol?.bearWeight === 0) {
          result.add(1);
        }
      });
    });
    return !(result.size === 1);
  }

  // 调接口保存
  async function sendRquset(allValues) {
    const { bins, ...params } = dataTranslate(allValues);

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
    const id = !isStrictNull(updateRecord) ? updateRecord.id : null;
    const requsetBody = {
      ...podParams,
      id,
      podFaceList: [
        {
          name: 'A',
          angle: 0,
          bins,
        },
        {
          name: 'C',
          angle: 180,
          bins: newBinsB,
        },
      ],
    };

    const methodType = isStrictNull(updateRecord) ? 'POST' : 'PUT';
    const response = await addOrUpdateLatentTotePodType(methodType, requsetBody);
    if (!dealResponse(response, 1)) {
      onClose();
      onRefresh();
    }
  }

  return (
    <Modal
      destroyOnClose
      style={{ top: 30 }}
      onCancel={onClose}
      onOk={onSubmit}
      visible={visible}
      width={840}
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
          <Col span={10}>
            <Form labelWrap form={formRef} {...formItemLayout} onValuesChange={onValuesChange}>
              <Form.Item
                hidden
                name="code"
                initialValue={updateRecord?.code ?? `ltp_${getRandomString(8)}`}
              >
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
                  label={formatMessage({ id: 'editor.batchAddCell.rows' })}
                  name="row"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label={formatMessage({ id: 'editor.batchAddCell.columns' })}
                  name="column"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  label={formatMessage({ id: 'app.common.height' })}
                  name="height"
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'mm'} />
                </Form.Item>
              </div>
              <Form.Item
                label={formatMessage({ id: 'app.common.width' })}
                name="width"
                rules={[{ required: true }]}
              >
                <InputNumber addonAfter={'mm'} />
              </Form.Item>

              <Form.Item
                label={formatMessage({ id: 'app.common.depth' })}
                name="depth"
                rules={[{ required: true }]}
              >
                <InputNumber addonAfter={'mm'} />
              </Form.Item>

              {/* 层板厚度 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.rowSpace' })}
                name="laminateHeight"
                rules={[{ required: true }]}
              >
                <InputNumber addonAfter={'mm'} />
              </Form.Item>
            </Form>
          </Col>
          <Col span={13}>
            <div style={{ height: '100%', borderLeft: '1px solid #efefef' }}>
              {binData && <StorageTemplateDetail binData={binData} detailChange={detailChange} />}
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
export default memo(LatentTotePodTemplate);
