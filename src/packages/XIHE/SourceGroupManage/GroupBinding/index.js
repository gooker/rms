import React, { Component } from 'react';
import find from 'lodash/find';
import { Form, Select, Switch, Row, Col, message, Empty, Button, Spin } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getCustomGroup, getUnBindGroupData, fechSaveUnBind ,fetchActiveMap} from '@/services/api';
import commonStyles from '@/common.module.less';
import styles from '../sideToolBar.module.less';

const { Option } = Select;

const FormItem = Form.Item;

class GroupBinding extends Component {
  formRef = React.createRef();

  fetching = false;

  state = {
    mapId: null,
    xOptions: null, // select的options x
    yOptions: null, // select的options y 正常和x轴一样 但是搜索的时候就不一样 (正常的values是type 搜索的values是key)
    xData: null, // 根据选择下拉框的类型拿到该类型下的所有组
    yData: null,
    bindUnData: [], // 展示的是未绑定的
    groupConfigData: [], // 所有的组
    currentXvalue: null,
    currentYvalue: null,
  };

  async componentDidMount() {
    const originalMapData = await fetchActiveMap();
    if (originalMapData) {
      const payload = { mapId: originalMapData.id };

      // 根据mapId 获取所有分组信息--
      const response = await getCustomGroup(payload);
      if (!dealResponse(response)) {
        // group数据
        this.getXtype(originalMapData.id, response);

        // 获取分组之间是否绑定信息
        this.getUnBindData(payload);
      } else {
        message.error(formatMessage({ id: 'customTasks.groupManage.fetchFailed' }));
      }
    } else {
      message.error(formatMessage({ id: 'customTasks.map.fetchFailed' }));
    }
  }

  // 获取所有的未绑定
  getUnBindData = async (params) => {
    // 获取未绑定分组
    const result = await getUnBindGroupData(params);
    if (!dealResponse(result)) {
      this.setState({
        bindUnData: [...result],
      });
    }
  };

  groupXTypeChange = (values) => {
    // 如果和y相同 return
    const {
      current: { getFieldValue, setFieldsValue },
    } = this.formRef;
    const yTypeValues = getFieldValue('yType');
    if (Array.isArray(yTypeValues) && yTypeValues.includes(values)) {
      const { currentXvalue } = this.state;
      setFieldsValue({ xType: currentXvalue });
      message.info('不能和纵轴重复');
      return;
    }
    // 根据类型去拿所有的分组
    const { groupConfigData } = this.state;
    const currentXConfig = groupConfigData.filter(({ groupType }) => groupType === values);
    this.setState({
      xData: [...currentXConfig],
      currentXvalue: values,
    });
  };

  groupYTypeChange = (values) => {
    // 根据类型去拿所有的分组
    const { groupConfigData } = this.state;
    const xTypeValues = this.formRef.current.getFieldValue('xType');
    let newyData = [];
    // 如果和x相同 return
    if (Array.isArray(values) && values.includes(xTypeValues)) {
      const index = values.findIndex((item) => item === xTypeValues);
      message.info(formatMessage({ id: 'customTasks.groupBinding.repeat.horizeontalaxis' }));
      values.splice(index, 1);
      this.setState({ currentYvalue: values });
      return;
    }

    values.map((item) => {
      const currentXConfig = groupConfigData.filter(({ groupType }) => groupType === item);
      newyData = newyData.concat(currentXConfig);
    });

    this.setState({
      yData: newyData,
      currentYvalue: values,
    });
  };

  // search 输入内容 searchOptions 已经存在 return
  searchTexttoOption = (text) => {
    const { yOptions } = this.state;
    const currentSearchOptions = yOptions.filter(({ search }) => search === 'true') || [];
    const isExistOption = currentSearchOptions.some((record) => {
      return record.groupName === text;
    });
    return isExistOption;
  };

  // 默认开关与否
  switchIsChecked = (x, y) => {
    const bindKeys = [x, y];
    const { bindUnData } = this.state;
    if (bindUnData.length === 0) {
      return true;
    }

    const findUndata = find(bindUnData, (item) => {
      return bindKeys.includes(item.firstUnBindKey) && bindKeys.includes(item.secondUnBindKey);
    });
    return findUndata == null;
  };

  // 绑定与否-单个操作
  switchChange = (x, y) => {
    return async (checked) => {
      // false 放入 保存未绑定的分组关系
      const { bindUnData, mapId } = this.state;
      const currentUnBindData = [...bindUnData];
      if (!checked) {
        const currentBindStatus = {
          mapId,
          firstUnBindKey: x,
          secondUnBindKey: y,
        };
        this.setState({
          bindUnData: [...bindUnData, currentBindStatus],
        });
      } else {
        // true 移除  删除未绑定
        const bindKeys = [x, y];
        let index = null;
        Object.values(currentUnBindData).map(async (item, key) => {
          if (bindKeys.includes(item.firstUnBindKey) && bindKeys.includes(item.secondUnBindKey)) {
            index = key;
          }
        });
        currentUnBindData.splice(index, 1);
        this.setState({
          bindUnData: [...currentUnBindData],
        });
      }
    };
  };

  // 头部批量操作 展示开关
  theadIsChecked = (xfirst) => {
    // 全部未绑定（开）-》开
    // 全部绑定-》关  否则就是开
    const { bindUnData, yData } = this.state;
    if (bindUnData.length === 0) {
      return true;
    }

    const xyUnbindData = bindUnData.filter((record) => {
      return (
        record.firstUnBindKey === xfirst &&
        find(yData, (o) => {
          return o.key === record.secondUnBindKey;
        })
      );
    });

    if (xyUnbindData && xyUnbindData.length === yData.length) {
      return false;
    }
    return true;
  };

  // 绑定与否-批量
  switchXtoYChange = (x, checked) => {
    const { bindUnData, yData, mapId } = this.state;
    // false 放入 保存未绑定的分组关系
    if (!checked) {
      const newUnbindData = [];
      yData.map((item) => {
        newUnbindData.push({
          mapId,
          firstUnBindKey: x,
          secondUnBindKey: item.key,
        });
      });
      const currentData = [...bindUnData, ...newUnbindData];
      const newCurrentData = currentData.reduce((pre, cur) => {
        if (
          find(pre, (o) => {
            return (
              o.firstUnBindKey === cur.firstUnBindKey && o.secondUnBindKey === cur.secondUnBindKey
            );
          })
        ) {
          return pre;
        }
        return pre.concat(cur);
      }, []);

      this.setState({
        bindUnData: [...newCurrentData],
      });
    } else {
      // true 移除  删除未绑定
      const currentUnBindData = [...bindUnData];
      yData.forEach((yitem) => {
        const bindKeys = [x, yitem.key];
        currentUnBindData.map((item, key) => {
          if (bindKeys.includes(item.firstUnBindKey) && bindKeys.includes(item.secondUnBindKey)) {
            currentUnBindData.splice(key, 1);
          }
        });
      });
      this.setState({
        bindUnData: [...currentUnBindData],
      });
    }
  };

  // 大保存
  submitSave = async () => {
    const { bindUnData } = this.state;
    const currentUnBindData = [...bindUnData];
    const saveResult = await fechSaveUnBind(currentUnBindData);
    if (!dealResponse(saveResult)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      this.setState({
        bindUnData: [...saveResult],
      });
    } else {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    }
  };

  // 去重
  removalRepeat = (arr, uniqueKey) => {
    const map = new Map();
    arr.forEach((record) => {
      if (!map.has(record[uniqueKey])) {
        map.set(record[uniqueKey], record);
      }
    });

    arr = [...map.values()];
    return arr;
  };

  // 初始化调用
  getXtype = (mapId, data) => {
    const groupBindingConfigData = data;
    const currentConfig = this.removalRepeat(
      groupBindingConfigData.map(({ groupType, typeName, key }) => ({ groupType, typeName, key })),
      'groupType',
    );
    const currentType = [];
    currentConfig.map((item) => {
      currentType.push({ label: item.typeName, value: item.groupType, type: item.groupType });
    });

    this.setState({
      xOptions: currentType,
      yOptions: currentType,
      mapId,
      groupConfigData: [...groupBindingConfigData],
    });
  };

  // 一个类型出现的次数
  statisticalTypeNumber = (arr) => {
    return arr.reduce((prev, next) => {
      const typeName = next.typeName;
      prev[typeName] = prev[typeName] + 1 || 1;
      return prev;
    }, {});
  };

  render() {
    const { xOptions, yOptions, xData, yData } = this.state;
    let typeGroupNumber = null;
    if (yData) {
      typeGroupNumber = this.statisticalTypeNumber(yData);
    }

    return (
      <div className={commonStyles.commonPageStyle}>
        {/* 搜索 */}
        <div>
          <Form ref={this.formRef}>
            <Row>
              <Col span={8}>
                <FormItem
                  label={<FormattedMessage id="customTasks.groupBinding.horizontalaxis" />}
                  name="xType"
                >
                  <Select
                    style={{ width: '100%' }}
                    // showSearch
                    onChange={this.groupXTypeChange}
                    options={xOptions}
                  ></Select>
                </FormItem>
              </Col>
              <Col span={8} style={{ padding: '0 12px' }}>
                <FormItem
                  label={<FormattedMessage id="customTasks.groupBinding.verticalaxis" />}
                  name="yType"
                >
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    // showSearch
                    filterOption={false}
                    onChange={this.groupYTypeChange}
                    notFoundContent={this.fetching ? <Spin size="small" /> : null}
                    mode="multiple"
                    maxTagCount={5}
                  >
                    {yOptions &&
                      yOptions.map(({ label, value }, index) => (
                        <Option key={index} value={value}>
                          {label}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>

              <Col offset={3}>
                <Button type={'primary'} onClick={this.submitSave}>
                  <FormattedMessage id={'app.button.save'} />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* 内容区 */}
        <div className={styles.tableWeapper} style={{ overflow: 'auto hidden' }}>
          {xData && yData && yData.length > 0 ? (
            <Row style={{ marginTop: 20 }}>
              <Col span={24}>
                <table
                  style={{
                    width: '96%',
                    border: '1px solid #efefef',
                    textAlign: 'center',
                    borderCollapse: 'collapse',
                    borderSpacing: 0,
                    tableLayout: 'fixed',
                  }}
                >
                  <thead
                    className={styles.fixColumn}
                    style={{ position: 'sticky', top: 0, left: 0, zIndex: 100 }}
                  >
                    <tr className={styles.body}>
                      <th className={styles.tdBorder} colSpan="2">
                        {' '}
                      </th>
                      {xData &&
                        xData.map((item) => {
                          return (
                            <th key={item.id} className={styles.tdBorder}>
                              {item.groupName}

                              <Switch
                                checked={this.theadIsChecked(item.key)}
                                style={{ marginLeft: '10px' }}
                                size="small"
                                onClick={(checked) => {
                                  this.switchXtoYChange(item.key, checked);
                                }}
                              />
                            </th>
                          );
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {yData &&
                      yData.map((y) => {
                        return (
                          <tr key={y.id} className={styles.thbodyHeight}>
                            {Object.keys(typeGroupNumber).map((i) => {
                              if (i === y.typeName) {
                                const rowslength = typeGroupNumber[i];
                                delete typeGroupNumber[i];
                                return (
                                  <th
                                    key={y.key}
                                    rowSpan={rowslength}
                                    className={styles.contentBorder}
                                  >
                                    {y.typeName}
                                  </th>
                                );
                              }
                            })}

                            <th
                              className={styles.tdBorder}
                              style={{ position: 'sticky', top: 0, left: 0, zIndex: 100 }}
                            >
                              {y.groupName}
                            </th>

                            {/* 下面td的长度 应该用xData遍历 */}
                            {xData &&
                              xData.map((x) => {
                                return (
                                  <th key={x.id} className={styles.contentBorder}>
                                    <Switch
                                      size="small"
                                      checked={this.switchIsChecked(x.key, y.key)}
                                      data-x={x.key}
                                      data-y={y.key}
                                      onChange={this.switchChange(x.key, y.key)}
                                    />
                                  </th>
                                );
                              })}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Col>
            </Row>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingTop: 100 }} />
          )}
        </div>
      </div>
    );
  }
}

export default GroupBinding;
