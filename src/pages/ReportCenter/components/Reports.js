import React, { Component } from 'react';
import { orderBy } from 'lodash';
import MatchReportsComponents from './MatchReportsComponents';

export default class Reports extends Component {
  renderForm = (groupReports) => {
    const { agvType } = this.props;
    const result = [];
    const { remove, deletable, filterDateOnChange } = this.props;
    if (groupReports && groupReports.length > 0) {
      for (let index = groupReports.length - 1; index > -1; index--) {
        const element = groupReports[index];
        const { descriptionKeys } = element.description;
        let data = [];
        if (descriptionKeys.length === 1) {
          data = orderBy(element.data, (record) => record[descriptionKeys[0]]);
        } else {
          data = orderBy(element.data, [descriptionKeys[0], descriptionKeys[1]]);
        }

        result.push(
          <MatchReportsComponents
            agvType={agvType}
            remove={() => {
              remove({ ...element });
            }}
            data={data}
            extra={element.extra}
            description={element.description}
            type={element.description.type}
            deletable={deletable}
            filterDateOnChange={(value) => {
              filterDateOnChange({ origin: element, value });
            }}
          />,
        );
      }
      return result;
    } else {
      return null;
    }
  };

  render() {
    const { groupReports } = this.props;
    return this.renderForm(groupReports);
  }
}
