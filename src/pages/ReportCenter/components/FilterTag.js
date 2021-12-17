import React, { Component } from 'react';
import { Tag, Row, Col } from 'antd';

const { CheckableTag } = Tag;

export default class FilterTag extends Component {
  state = {
    filter: [],
    data: [],
  };
  componentDidMount() {
    const { filters } = this.props;
    if (filters && filters.length > 0) {
      //构造filter
      let data = {};
      for (let index = 0; index < filters.length; index++) {
        const element = filters[index];
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            const el = element[key];
            for (let index = 0; index < el.length; index++) {
              const u = el[index];
              const stringKey = key + '-' + u;
              data[stringKey] = true;
            }
          }
        }
      }
      this.setState({
        filters: filters,
        data: data,
      });
    }
  }

  onChange = (value, key, val) => {
    const { data } = this.state;
    const o = {};
    const _this = this;
    o[key + '-' + val] = value;
    this.setState(
      {
        data: {
          ...data,
          ...o,
        },
      },
      () => {
        _this.createFilters();
      },
    );
  };
  createFilters = () => {
    //产生新的filter
    const newFilter = [];
    const { filters, data } = this.state;
    for (let index = 0; index < filters.length; index++) {
      const element = filters[index];
      let newElement = {};
      for (const key in element) {
        const newEl = [];
        if (element.hasOwnProperty(key)) {
          const el = element[key];
          for (let index = 0; index < el.length; index++) {
            const u = el[index];
            const stringKey = key + '-' + u;
            if (data[stringKey]) {
              newEl.push(u);
            } else {
              continue;
            }
          }
        }
        newElement[key] = newEl;
      }
      newFilter.push(newElement);
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(newFilter);
    }
  };

  render() {
    const renderFilter = (filters) => {
      const { info } = this.props;
      const { data } = this.state;
      const filterNode = [];
      for (let k = 0; k < filters.length; k++) {
        const nodes = filters[k];
        const node = [];
        let keyString = '';
        for (const key in nodes) {
          if (nodes.hasOwnProperty(key)) {
            keyString = key;
            const el = nodes[key];
            for (let g = 0; g < el.length; g++) {
              const va = el[g];
              let status = false;
              if (data != null) {
                const keyString = key + '-' + va;
                status = data[keyString];
              }
              node.push(
                <span style={{ minWidth: 100, display: 'inline-block' }}>
                  <CheckableTag
                    checked={status}
                    onChange={(value) => {
                      this.onChange(value, key, va);
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    {va}
                  </CheckableTag>
                </span>,
              );
            }
          }
        }
        filterNode.push(
          <Row style={{ marginTop: k == 0 ? 0 : 10 }}>
            <Col span={6} style={{ width: 60, display: 'inline-block' }}>
              {info[keyString]}
            </Col>
            <Col span={18} style={{ marginLeft: 0 }}>
              {node}
            </Col>
          </Row>,
        );
      }

      return filterNode;
    };
    const { filters } = this.state;
    return filters ? renderFilter(filters) : null;
  }
}
