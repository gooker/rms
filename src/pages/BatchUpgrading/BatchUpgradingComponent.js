import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Button, Modal } from 'antd';
import { RedoOutlined, HistoryOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchAgvFileStatusList,
  fetchUpdateFileTask,
  fetchMaintain,
  fetchUpgradeFirmwareFile,
  upgradeAGV,
} from '@/services/api';
import TableWidthPages from '@/components/TableWidthPages';
import UploadUtil from '@/components/UploadPanel';
import DownloadFirmwareModal from './DownloadFirmwareModal';
import { formatMessage, dealResponse } from '@/utils/utils';
import RmsConfirm from '@/components/RmsConfirm';
import TablePageWrapper from '@/components/TablePageWrapper';
import commonStyles from '@/common.module.less';
import { IconFont } from '@/components/IconFont';

@connect()
class BatchUpgradingComponent extends Component {
  state = {
    dataSource: [],
    selectedRow: [],
    selectedRowKeys: [],
    downloadFirmwareVisible: false,
    sectionId: window.localStorage.getItem('sectionId'),
    loading: false,
    uploadVisible: false, // 上传
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
    RmsConfirm({
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

  //
  analyzeFunction = async (evt) => {
    //  const data=  evt.target.result;
    const respones = ''; //  '/wcs/file/upload';

    if (!dealResponse(respones)) {
      this.setState({ uploadVisible: false }, this.getData);
    }
  };

  //强制重置
  forceSet = (record) => {
    const _this = this;
    const { agvType } = this.props;

    RmsConfirm({
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
    const { getColumn, maintainFlag, uploadFlag, upgradeFlag, agvType, uploadVisible } = this.props;
    return (
      <TablePageWrapper>
        <div className={commonStyles.tableToolLeft}>
          {maintainFlag && (
            <Button
              type="primary"
              onClick={this.maintainStatus}
              disabled={selectedRowKeys.length !== 1}
            >
              <IconFont type={'icon-houqiweihuweihuweihuguanli'} />{' '}
              <FormattedMessage id="app.activity.domaintain" />
            </Button>
          )}
          {upgradeFlag && (
            <Button onClick={this.upgradeAgv} disabled={selectedRowKeys.length !== 1}>
              <IconFont type={'icon-shengji'} /> <FormattedMessage id="app.activity.upgrade" />
            </Button>
          )}

          {uploadFlag && (
            <Button
              onClick={() => {
                this.setState({ uploadVisible: true });
              }}
            >
              <UploadOutlined /> <FormattedMessage id="app.activity.uploadFirmware" />
            </Button>
          )}

          <Button
            onClick={() => {
              this.setState({ downloadFirmwareVisible: true });
            }}
            disabled={selectedRowKeys.length !== 1}
          >
            <DownloadOutlined /> <FormattedMessage id="app.activity.downloadFirmware" />
          </Button>
          <Button onClick={this.update}>
            <HistoryOutlined /> <FormattedMessage id="app.taskDetail.taskHistory" />
          </Button>
          <Button onClick={this.getData}>
            <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </div>
        <TableWidthPages
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

        {/***************************上传固件*****************************/}
        <Modal
          footer={null}
          visible={uploadVisible}
          onCancel={() => {
            this.setState({
              uploadVisible: false,
            });
          }}
          destroyOnClose
        >
          <UploadUtil analyzeFunction={this.analyzeFunction} />
        </Modal>
      </TablePageWrapper>
    );
  }
}
export default BatchUpgradingComponent;
