import React, { Component } from 'react';
import { Row, Button, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  fetchSelectSectionList,
  fetchAddSection,
  updateSection,
  deleteSectionById,
} from '@/services/user';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import styles from './sectionManager.module.less';
import { dealResponse } from '@/utils/utils';

export default class SectionManager extends Component {
  state = {
    selectRowKey: [],
    sectionsList: [],
    loading: false,
  };
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    this.setState({ loading: true });
    const response = await fetchSelectSectionList();
    if (!dealResponse(response)) {
      this.setState({ sectionsList: response });
    }
    this.setState({ loading: false });
  };
  getColumn = () => {
    return [
      {
        title: <FormattedMessage id="translator.languageManage.langname" />,
        dataIndex: 'sectionName',
        align: 'center',
        fixed: 'left',
      },
      {
        title: <FormattedMessage id="app.common.sectionId" />,
        dataIndex: 'sectionId',
        align: 'center',
      },
      {
        title: <FormattedMessage id="sso.user.type.username" />,
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: <FormattedMessage id="sso.user.account.password" />,
        dataIndex: 'password',
        align: 'center',
      },
    ];
  };
  render() {
    const { selectRowKey, sectionsList, loading } = this.state;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Row style={{ display: 'flex', padding: '20px 0'}}>
          <Button
            className={commonStyles.mr20}
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              this.setState({
                addUserVisible: true,
              });
            }}
          >
            <FormattedMessage id="app.button.add" />
          </Button>
          <Button
            className={commonStyles.mr20}
            icon={<EditOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({
                addUserVisible: true,
                updateUserFlag: true,
              });
            }}
          >
            {' '}
            <FormattedMessage id="app.button.edit" />
          </Button>

          <Button
            className={commonStyles.mr20}
            icon={<DeleteOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={this.deleteUser}
          >
            <FormattedMessage id="app.button.delete" />
          </Button>
        </Row>
        <div className={styles.sectionManagerTable}>
          <Table
            bordered
            pagination={false}
            columns={this.getColumn()}
            rowKey="id"
            dataSource={sectionsList}
            scroll={{ x: 'max-content' }}
            loading={loading}
            rowSelection={{
              selectedRowKeys: selectRowKey,
              onChange: (selectRowKey, selectRow) => {
                this.setState({ selectRowKey, selectRow });
              },
            }}
          />
        </div>
      </div>
    );
  }
}
