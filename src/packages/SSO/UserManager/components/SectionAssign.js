import React, { Component } from 'react';
import { Card, Button, Transfer } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { AdminTColor } from '../userManagerUtils';
const AdminTypeColor = AdminTColor();

export default class SectionAssign extends Component {
  state = {
    rightSource: [],
    name: null,
  };

  componentDidMount() {
    const { currentSection } = this.props;
    const rightSource = currentSection.map(({ sectionId }) => sectionId);
    this.setState({ rightSource });
  }

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
    const { rightSource } = this.state;
    const { selectRow, allSections } = this.props;
    const type = selectRow ? selectRow[0].adminType || 'USER' : '';
    return (
      <div>
        <Card
          title={
            <span>
              <FormattedMessage id="sso.user.tip.sectionAssign" />
              {selectRow ? (
                <span style={{ marginLeft: 10, fontSize: 13, color: AdminTypeColor[type] }}>
                  {`( ${selectRow[0].username} )`}
                </span>
              ) : (
                ''
              )}
            </span>
          }
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
              <FormattedMessage id="sso.user.action.add" />,
              <FormattedMessage id="sso.user.action.remove" />,
            ]}
            render={(item) => item.sectionName}
            rowKey={(record) => record.sectionId}
            onChange={this.handleChange}
            listStyle={{
              width: '42%',
              height: 400,
            }}
          />
        </Card>
      </div>
    );
  }
}
