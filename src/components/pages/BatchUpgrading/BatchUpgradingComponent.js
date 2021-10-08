import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Button, Modal } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import {
  fetchAgvFileStatusList,
  fetchUpdateFileTask,
  fetchMaintain,
  fetchUpgradeFirmwareFile,
  upgradeAGV,
} from '@/services/api';
import TablewidthPages from '@/components/TablewidthPages';
import DownloadFirmwareModal from './DownloadFirmwareModal';
import { dealResponse } from '@/utils/utils';
import RcsConfirm from '@/components/RcsConfirm';
import TablePageWrapper from '@/components/TablePageWrapper';
import commonStyles from '@/common.module.less';

@connect()
class BatchUpgradingComponent extends Component {
  state = {
    dataSource: [],
    selectedRow: [],
    selectedRowKeys: [],
    downloadFirmwareVisible: false,
    sectionId: window.localStorage.getItem('sectionId'),
    loading: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType } = this.props;
    this.setState({ loading: true });
    const response = await fetchAgvFileStatusList(agvType);

    if (!dealResponse(response)) {
      const dataSource = response.map((item) => ({ key: item.taskId, ...item }));
      this.setState({ dataSource });
    }
    this.setState({ loading: false });
  };

  onSelectChange = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeys, selectedRow });
  };

  // 取消维护
  maintainStatus = () => {
    const { agvType } = this.props;
    const { selectedRow, sectionId } = this.state;
    const _this = this;
    RcsConfirm({
      content: formatMessage({ id: 'app.activity.switchmaintenanceStatus' }),
      onOk: async () => {
        const resetRes = await fetchMaintain(agvType, {
          sectionId,
          agvId: selectedRow[0].robotId,
          disabled: !selectedRow[0].disabled,
        });
        if (!dealResponse(resetRes)) {
          _this.getData();
        }
      },
    });
  };

  // 下载固件--上传
  downloadFireware = async (value) => {
    const { selectedRow, sectionId } = this.state;
    const { agvType } = this.props;
    const submitRes = await fetchUpgradeFirmwareFile(agvType, {
      ...value,
      robotId: selectedRow[0].robotId,
      sectionId,
    });
    if (!dealResponse(submitRes)) {
      this.setState({ downloadFirmwareVisible: false }, this.getData);
    }
  };

  // 升级
  upgradeAgv = async () => {
    const { selectedRow, sectionId } = this.state;
    const { agvType } = this.props;
    const upgradeRes = await upgradeAGV(agvType, { sectionId, robotId: selectedRow[0].robotId });
    if (!dealResponse(upgradeRes)) {
      this.getData();
    }
  };

  //强制重置
  forceSet = (record) => {
    const _this = this;
    const { agvType } = this.props;

    RcsConfirm({
      content: (
        <div>
          {formatMessage({ id: 'app.agv.id' })}:{record.robotId}
        </div>
      ),
      onOk: async () => {
        const resetRes = await fetchUpdateFileTask(agvType, {
          ...record,
          fileStatus: 2,
        });
        if (!dealResponse(resetRes)) {
          _this.getData();
        }
      },
    });
  };

  render() {
    const { loading, selectedRowKeys, selectedRow, downloadFirmwareVisible } = this.state;
    const { getColumn, maintainFlag, uploadFlag, upgradeFlag, agvType } = this.props;
    return (
      <TablePageWrapper>
        <div>
          {maintainFlag && (
            <Button
              type="primary"
              onClick={this.maintainStatus}
              disabled={selectedRowKeys.length !== 1}
            >
              <FormattedMessage id="app.activity.domaintain" />
            </Button>
          )}
          {uploadFlag && (
            <Button
              onClick={() => {
                this.setState({ uploadVisible: true });
              }}
              className={commonStyles.ml10}
            >
              <FormattedMessage id="app.activity.uploadFirmware" />
            </Button>
          )}

          {upgradeFlag && (
            <Button
              onClick={this.upgradeAgv}
              className={commonStyles.ml10}
              disabled={selectedRowKeys.length !== 1}
            >
              <FormattedMessage id="app.activity.upgrade" />
            </Button>
          )}
          <Button
            onClick={() => {
              this.setState({ downloadFirmwareVisible: true });
            }}
            disabled={selectedRowKeys.length !== 1}
            className={commonStyles.ml10}
          >
            <FormattedMessage id="app.activity.downloadFirmware" />
          </Button>
          <Button onClick={this.update} className={commonStyles.ml10}>
            <FormattedMessage id="app.taskDetail.taskHistory" />
          </Button>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" ghost onClick={this.getData}>
              <RedoOutlined />
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </div>
        </div>
        <TablewidthPages
          loading={loading}
          columns={getColumn(this.forceSet)}
          dataSource={[]}
          rowKey={(record) => record.id}
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
        />

        <Modal
          visible={downloadFirmwareVisible}
          footer={null}
          title={formatMessage({ id: 'app.activity.sendFiles' })}
          onCancel={() => {
            this.setState({ downloadFirmwareVisible: false });
          }}
          destroyOnClose
        >
          <DownloadFirmwareModal
            selectedRow={selectedRow}
            agvType={agvType}
            downloadFireware={this.downloadFireware}
          />
        </Modal>
      </TablePageWrapper>
    );
  }
}
export default BatchUpgradingComponent;
