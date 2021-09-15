import React, { Component } from 'react';
import { Button, Table, Col, Row } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { saveAs } from 'file-saver';
import IconFont from '@/utils/ExtraIcon';
import { dateFormat, dealResponse } from '@/utils/utils';
import { fetchAllRoleList } from '@/services/user';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';

export default class index extends Component {
  state = {
    selectedRowKeys: [],
    selectedRow: [],
    roleList: [],
    loading: false,
  };

  componentDidMount() {
    this.getRoleList();
  }

  getRoleList = async () => {
    this.setState({ loading: true });
    const roleList = await fetchAllRoleList();
    if (!dealResponse(roleList)) {
      this.setState({ roleList });
    }
    this.setState({ loading: false });
  };

  columns = [
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: <FormattedMessage id="rolemanager.code" />,
      dataIndex: 'code',
      align: 'center',
    },

    {
      title: <FormattedMessage id="rolemanager.description" />,
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.taskDetail.createTime" />,
      dataIndex: 'createDate',
      align: 'center',
      render: (text) => {
        return text && dateFormat(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: <FormattedMessage id="rolemanager.updateTime" />,
      dataIndex: 'updateDate',
      align: 'center',
      render: (text) => {
        return text && dateFormat(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  export = () => {
    const { selectedRow, roleList } = this.state;
    const exportData = selectedRow.length === 0 ? roleList : selectedRow;
    const blob = new Blob(['\uFEFF' + JSON.stringify(exportData, null, 4)], {
      type: 'text/plain;charset=utf-8;',
    });
    saveAs(blob, 'Role_Info.json');
  };

  render() {
    const { selectedRowKeys, roleList, loading } = this.state;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Row className={commonStyles.mb20}>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button icon={<PlusOutlined />}>
              <FormattedMessage id="app.button.add" />
            </Button>
            <Button icon={<EditOutlined />} disabled={selectedRowKeys.length !== 1}>
              <FormattedMessage id="sso.user.edit" />
            </Button>
            <Button
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
              onClick={() => {
                this.deleteRole();
              }}
            >
              <FormattedMessage id="app.button.delete" />
            </Button>
            <Button disabled={selectedRowKeys.length !== 1}>
              <IconFont type="icon-fenpei" />
              <FormattedMessage id="rolemanager.authAssign" />
            </Button>
            <Button
              disabled={roleList.length === 0}
              icon={<ExportOutlined />}
              onClick={this.export}
            >
              <FormattedMessage id="app.button.export" />
            </Button>
            <Button icon={<ImportOutlined />}>
              <FormattedMessage id="app.button.import" />
            </Button>
          </Col>

          <Col>
            <Button type="primary" icon={<ReloadOutlined />}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>

        <div className={commonStyles.divContent}>
          <Table
            bordered
            columns={this.columns}
            dataSource={roleList}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRow) => {
                this.setState({ selectedRowKeys, selectedRow });
              },
            }}
          />
        </div>
      </div>
    );
  }
}
