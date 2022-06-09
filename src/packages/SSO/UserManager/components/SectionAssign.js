import React, { Component } from 'react';
import { Card, Button, Transfer, message } from 'antd';
import { fetchSelectSectionList, fetchAllSectionByUserId } from '@/services/SSOService';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { AdminTColor } from '../userManagerUtils';

export default class SectionAssign extends Component {
  state = {
    allSections: [],
    rightSource: [],
    name: null,
  };

  componentDidMount() {
    this.getSectionsList();
  }

  // 区域分配
  getSectionsList = () => {
    const { selectRow } = this.props;
    const userId = selectRow[0].id;
    // 获取所有section/当前section;
    Promise.all([fetchSelectSectionList(), fetchAllSectionByUserId({ userId: userId })])
      .then((response) => {
        const [allSections, currentSection] = response;
        if (dealResponse(allSections) || dealResponse(currentSection)) {
          message.error(formatMessage({ id: 'sso.user.getSectionsFailed' }));
          return;
        }
        const rightSource = currentSection.map(({ sectionId }) => sectionId);
        this.setState({ allSections, rightSource });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  handleChange = (targetKeys) => {
    this.setState({ rightSource: targetKeys });
  };
  submit = () => {
    const { rightSource } = this.state;
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(rightSource);
    }
  };

  render() {
    const { allSections, rightSource } = this.state;
    const { selectRow } = this.props;
    const type = selectRow ? selectRow[0].adminType || 'USER' : '';
    return (
      <div>
        <Card
          title={<span style={{ color: AdminTColor[type] }}>{selectRow[0].username}</span>}
          extra={
            <Button type="primary" onClick={this.submit}>
              <FormattedMessage id="app.button.submit" />
            </Button>
          }
        >
          <Transfer
            dataSource={allSections}
            targetKeys={rightSource}
            showSearch
            operations={[
              <FormattedMessage key={'add'} id="app.button.add" />,
              <FormattedMessage key={'delete'} id="app.button.delete" />,
            ]}
            titles={[
              <FormattedMessage key={'sectionUnassigned'} id="sso.user.tip.sectionUnassigned" />,
              <FormattedMessage key={'sectionAssigned'} id="sso.user.tip.sectionAssigned" />,
            ]}
            render={(item) => item.sectionName}
            rowKey={(record) => record.sectionId}
            onChange={this.handleChange}
            listStyle={{
              width: '44%',
              height: 400,
            }}
          />
        </Card>
      </div>
    );
  }
}
