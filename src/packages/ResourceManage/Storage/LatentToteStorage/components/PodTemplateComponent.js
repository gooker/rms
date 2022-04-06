import React, { memo, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Row, Col, Switch, message } from 'antd';
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
import { addOrUpdateLatentTotePodType } from '@/services/latentTote';

const { formItemLayout } = getFormLayout(7, 16);

const LatentTotePodTemplate = (props) => {
  const { visible, onClose, updateRecord, onRefresh } = props;
  // 货架编码
  const [binData, setBinData] = useState(false);
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!isStrictNull(updateRecord)) {
      const {
        name,
        row,
        column,
        weight,
        width,
        height,
        depth,
        edgeWidth,
        binInterval,
        laminateHeight,
        bottomHeight,
      } = updateRecord;
      generatePodFace(updateRecord);
      formRef.setFieldsValue({
        name,
        row,
        column,
        weight,
        width,
        height,
        depth,
        edgeWidth,
        binInterval,
        laminateHeight,
        bottomHeight,
      });
    }
  }, []);

  // 编辑转换
  function generatePodFace(updateRecord) {
    const { podFaceList, ...params } = updateRecord;
    const { bins } = podFaceList[0] ?? [];
    setBinData({ bins: [...bins], ...params });
  }

  // 此方法大保存的时候 调用
  function dataTranslate(podParams) {
    const {
      row: rows,
      column: columns,
      width,
      height,
      depth,
      edgeWidth,
      binInterval,
      laminateHeight,
      bottomHeight,
      isCapping,
    } = podParams;
    // 计算储位宽度
    const binWidth = Math.floor((width - edgeWidth * 2 - binInterval * (columns + 1)) / columns);
    //储位高度
    const floorlength = isCapping ? rows : rows - 1;
    const binHeight = Math.floor((height - bottomHeight - floorlength * laminateHeight) / rows);
    const binDepth = depth;

    const binsA = [];
    const { bins } = binData;

    bins.forEach((rowBins, r) => {
      const currentArray = [];
      rowBins.forEach((currentCol, c) => {
        currentArray.push({
          ...currentCol,
          height: binHeight,
          width: binWidth,
          depth: binDepth,
          barycenterX: getBaryX(c + 1, binWidth, columns, binInterval),
          barycenterY: binDepth / 2,
          barycenterZ: getBaryZ(binHeight, laminateHeight, r),
        });
      });
      binsA.push(currentArray);
    });

    return { bins: binsA, ...podParams }; //setBinData({ bins: binsA, ...podParams });
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

  /*
   *新增生成预览
   *列变更 数据不需要保留(之前的重量清空)
   * */
  function onValuesChange(changedKey, allValues) {
    const { row: rows, column: columns, weight } = allValues;

    let currentBin = binData?.bins || [];
    if (changedKey.hasOwnProperty('column')) {
      currentBin = []; // 列变更重量不保留
    }
    if (!isStrictNull(rows) && !isStrictNull(columns) && !isStrictNull(weight)) {
      const binsA = [];
      for (let r = 0; r < rows; r++) {
        const currentRowArray = [];
        for (let c = 0; c < columns; c++) {
          const existItem = currentBin[r]?.[c] ?? {};
          currentRowArray.push({
            ...existItem,
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
    binData?.bins?.forEach((rowBins) => {
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
      barycenterX: 0,
      barycenterY: 0,
      barycenterZ: Math.floor(params.height / 2),
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
          bins: newBinsB,
        },
      ],
    };
    console.log(requsetBody);

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
      // footer={null}
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
                  label={formatMessage({ id: 'latentTote.podTemplateStorage.weight' })}
                  name="weight"
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'kg'} />
                </Form.Item>

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

              {/* 货架边宽 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.sideWidth' })}
                name="edgeWidth"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>

              {/* 货位间隔 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.storageSpace' })}
                name="binInterval"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>

              {/* 层板厚度 */}
              <Form.Item
                label={formatMessage({ id: 'latentTote.podTemplateStorage.rowSpace' })}
                name="laminateHeight"
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
                valuePropName={'checked'}
                rules={[{ required: true }]}
                initialValue={updateRecord?.isCapping ?? false}
              >
                <Switch />
              </Form.Item>
            </Form>
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
