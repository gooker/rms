import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Modal } from 'antd';
import { DownloadOutlined, HistoryOutlined, RedoOutlined, UploadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchMaintain,
  fetchUpdateFileTask,
  fetchUpgradeFirmwareFile,
  fetchVehicleFileStatusList,
  upgradeVehicle,
} from '@/services/api';
import TableWithPages from '@/components/TableWithPages';
import UploadUtil from '@/components/UploadPanel';
import DownloadFirmwareModal from './DownloadFirmwareModal';
import { dealResponse, formatMessage } from '@/utils/util';
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
    const { vehicleType } = this.props;
    this.setState({ loading: true });
    const response = await fetchVehicleFileStatusList(vehicleType);

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
    const { vehicleType } = this.props;
    const { selectedRow, sectionId } = this.state;
    const _this = this;
    RmsConfirm({
      content: formatMessage({ id: 'app.activity.switchmaintenanceStatus' }),
      onOk: async () => {
        const resetRes = await fetchMaintain(vehicleType, {
          sectionId,
          vehicleId: selectedRow[0].vehicleId,
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
    const { vehicleType } = this.props;
    const submitRes = await fetchUpgradeFirmwareFile(vehicleType, {
      ...value,
      vehicleId: selectedRow[0].vehicleId,
      sectionId,
    });
    if (!dealResponse(submitRes)) {
      this.setState({ downloadFirmwareVisible: false }, this.getData);
    }
  };

  // 升级
  upgradeVehicle = async () => {
    const { selectedRow, sectionId } = this.state;
    const { vehicleType } = this.props;
    const upgradeRes = await upgradeVehicle(vehicleType, { sectionId, vehicleId: selectedRow[0].vehicleId });
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
    const { vehicleType } = this.props;

    RmsConfirm({
      content: (
        <div>
          {formatMessage({ id: 'vehicle.id' })}:{record.vehicleId}
        </div>
      ),
      onOk: async () => {
        const resetRes = await fetchUpdateFileTask(vehicleType, {
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
    const { getColumn, maintainFlag, uploadFlag, upgradeFlag, vehicleType, uploadVisible } = this.props;
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
            <Button onClick={this.upgradeVehicle} disabled={selectedRowKeys.length !== 1}>
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
        <TableWithPages
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
            vehicleType={vehicleType}
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
