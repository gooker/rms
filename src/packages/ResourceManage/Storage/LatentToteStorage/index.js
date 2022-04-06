import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Button, Card, Spin } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchLatentTotePodTypes, deleteLatentTotePodTypes } from '@/services/latentTote';
import LatentTotePodTemplate from './components/PodTemplateComponent';
import commonStyles from '@/common.module.less';
import { dealResponse, getSuffix, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';

const colResponsive = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  xxl:6,
};
const DescriptionItem = ({ span = 12, label, content }) => (
  <Col span={span} style={{ margin: '5px 0' }}>
    <span style={{ marginRight: 10 }}>{label}:</span>
    {content}
  </Col>
);

const LatentToteStorage = () => {
  const [addVisible, setAddVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [podTypesList, setPodTypesList] = useState([]);

  useEffect(() => {
    async function init() {
      getData();
    }
    init();
  }, []);

  async function getData() {
    setLoading(true);
    const response = await fetchLatentTotePodTypes();
    if (!dealResponse(response)) {
      setPodTypesList(response);
    }
    setLoading(false);
  }

  async function deletePodType(data) {
    const { id } = data;
    RmsConfirm({
      content: formatMessage({ id: 'app.message.delete.confirm' }),
      onOk: async () => {
        const deleteRes = await deleteLatentTotePodTypes(id);
        if (!dealResponse(deleteRes, 1)) {
          getData();
        }
      },
    });
  }

  function updatePodType(data) {
    setAddVisible(true);
    setEditRecord({ ...data });
  }

  return (
    <TablePageWrapper>
      <Row>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          {/* 新增 */}
          <Button
            type="primary"
            onClick={() => {
              setAddVisible(true);
              setEditRecord(null);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="app.button.add" />
          </Button>

          <Button onClick={getData}>
            <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      <div className={commonStyles.tableWrapper}>
        <Spin spinning={loading}>
          <Row>
            {podTypesList?.map((podType, index) => {
              return (
                <Col {...colResponsive} key={index}>
                  <Card
                    style={{ margin: 10 }}
                    title={`${podType.name}`}
                    actions={[
                      <Button
                        key="a"
                        type={'link'}
                        onClick={() => {
                          deletePodType(podType);
                        }}
                      >
                        <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
                      </Button>,
                      <Button
                        key="a"
                        type={'link'}
                        onClick={() => {
                          updatePodType(podType);
                        }}
                      >
                        <EditOutlined /> <FormattedMessage id="app.button.edit" />
                      </Button>,
                    ]}
                  >
                    <Row>
                      <DescriptionItem
                        label={formatMessage({ id: 'editor.batchAddCell.rows' })}
                        content={podType?.row}
                      />
                      <DescriptionItem
                        label={formatMessage({ id: 'editor.batchAddCell.columns' })}
                        content={podType?.column}
                      />
                      <DescriptionItem
                        label={formatMessage({ id: 'latentTote.podTemplateStorage.weight' })}
                        content={getSuffix(podType?.weight || 0, 'kg')}
                      />
                      <DescriptionItem
                        label={<FormattedMessage id={'app.common.width'} />}
                        content={getSuffix(podType?.width || 0, 'mm')}
                      />

                      <DescriptionItem
                        label={<FormattedMessage id={'app.common.height'} />}
                        content={getSuffix(podType?.height || 0, 'mm')}
                      />
                      <DescriptionItem
                        label={<FormattedMessage id={'app.common.depth'} />}
                        content={getSuffix(podType?.depth || 0, 'mm')}
                      />

                      <DescriptionItem
                        label={<FormattedMessage id={'latentTote.podTemplateStorage.sideWidth'} />}
                        content={getSuffix(podType?.edgeWidth || 0, 'mm')}
                      />

                      <DescriptionItem
                        label={
                          <FormattedMessage id={'latentTote.podTemplateStorage.storageSpace'} />
                        }
                        content={getSuffix(podType?.binInterval || 0, 'mm')}
                      />
                      <DescriptionItem
                        label={<FormattedMessage id={'latentTote.podTemplateStorage.rowSpace'} />}
                        content={getSuffix(podType?.laminateHeight || 0, 'mm')}
                      />

                      <DescriptionItem
                        label={<FormattedMessage id={'latentTote.podTemplateStorage.isCapping'} />}
                        content={
                          podType.isCapping ? (
                            <FormattedMessage id="app.common.true" />
                          ) : (
                            <FormattedMessage id="app.common.false" />
                          )
                        }
                      />
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Spin>
      </div>

      {addVisible && (
        <LatentTotePodTemplate
          visible={addVisible}
          updateRecord={editRecord}
          onClose={() => {
            setAddVisible(false);
            setEditRecord(null);
          }}
          onRefresh={getData}
        />
      )}
    </TablePageWrapper>
  );
};
export default memo(LatentToteStorage);
