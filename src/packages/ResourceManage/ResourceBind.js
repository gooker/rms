import React, { memo, useEffect, useState } from 'react';
import { find, debounce } from 'lodash';
import { Form, Select, Switch, Card, Row, Col, message, Empty, Button, Spin } from 'antd';
import { formatMessage, dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './resourceBind.module.less';

const ResourceBind = (props) => {
  const {} = props;
  const [formRef] = Form.useForm();
  const [mapId, setMapId] = useState(null);
  const [xOptions, setXOptions] = useState(null); //select的options x
  const [yOptions, setYOptions] = useState(null); //select的options y 正常和x轴一样 但是搜索的时候就不一样 (正常的values是type 搜索的values是key)
  const [xData, setXData] = useState(null); // 根据选择下拉框的类型拿到该类型下的所有组
  const [yData, setYData] = useState(null);
  const [bindUnData, setBindUnData] = useState(null);
  const [groupConfigData, setGroupConfigData] = useState(null);
  const [currentXvalue, setCurrentXvalue] = useState(null);
  const [currentYvalue, setCurrentYvalue] = useState(null);

  useEffect(() => {
    async function init() {
      const originalMapData = await fetchGetActiveMap();
      if (originalMapData) {
        const payload = { mapId: originalMapData.id };
        // 根据mapId 获取所有分组信息
        const response = await getCustomGroup(payload);
        if (!dealResponse(response, 1)) {
          setMapId(originalMapData.id);
          getXtype(response); // group数据
          getUnBindData(payload); // 获取分组之间是否绑定信息
        }
      } else {
        message.error(formatMessage({ id: 'app.message.fetchMapFail' }));
      }
    }

    init();
  }, []);

  // 获取所有的未绑定分组
  async function getUnBindData(params) {
    const result = await getUnBindGroupData(params);
    if (!dealResponse(result, 1)) {
      setBindUnData([...result]);
    }
  }

  function getXtype(data) {
    const groupBindingConfigData = [...data];
    const currentConfig = removalRepeat(
      groupBindingConfigData.map(({ groupType, typeName, key }) => ({ groupType, typeName, key })),
      'groupType',
    );
    const currentType = [];
    currentConfig.map(({ typeName, groupType }) => {
      currentType.push({ label: typeName, value: groupType, type: groupType });
    });

    setXOptions(currentType);
    setYOptions(currentType);
    setGroupConfigData(groupBindingConfigData);
  }

  function groupXTypeChange(values) {
    // 如果和y相同 return
    const yValues = formRef.getFieldValue('yType');
    if (yValues?.includes(values)) {
      formRef.setFieldsValue({ xType: currentXvalue });
      message.info('不能和纵轴重复');
      return;
    }

    // 根据类型去拿所有的分组
    const currentXConfig = groupConfigData.filter(({ groupType }) => groupType === values);
    setXData([...currentXConfig]);
    setCurrentXvalue(values);
  }

  function groupYTypeChange(values) {
    // 根据类型去拿所有的分组
    const xValues = formRef.getFieldValue('xType');
    let newyData = [];
    // 如果和x相同 return
    if (values?.includes(xValues)) {
      const index = values.findIndex((item) => {
        return item === xValues;
      });
      message.info('不能和横轴重复');
      values.splice(index, 1);
      setCurrentYvalue(values);
      return;
    }

    values.map((item) => {
      const currentXConfig = groupConfigData.filter(({ groupType }) => groupType === item);
      newyData = newyData.concat(currentXConfig);
    });

    setYData([...newyData]);
    setCurrentYvalue(values);
  }

  // 一个类型出现的次数
  function statisticalTypeTimes(arr) {
    return arr.reduce((prev, next) => {
      const typeName = next.typeName;
      prev[typeName] = prev[typeName] + 1 || 1;
      return prev;
    }, {});
  }

  const removalRepeat = (arr, uniqueKey) => {
    const map = new Map();
    arr?.forEach((record) => {
      if (!map.has(record[uniqueKey])) {
        map.set(record[uniqueKey], record);
      }
    });

    arr = [...map.values()];
    return arr;
  };

  /*
   *头部批量操作 是否选中
   *  全部未绑定（开）->开
   *  全部绑定->关  否则就是开
   * */
  function theadIsChecked(key) {
    if (bindUnData?.length === 0) {
      return true;
    }
    const xyUnbindData = bindUnData.filter((record) => {
      return record.firstUnBindKey === key;
    });
    return !(xyUnbindData?.length === yData?.length);
  }

  // 绑定与否-批量
  function switchXtoYChange(x, checked) {
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

      setBindUnData([...newCurrentData]);
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
      setBindUnData(currentUnBindData);
    }
  }

  // 默认开关与否
  function switchChecked(x, y) {
    const bindKeys = [x, y];
    if (bindUnData?.length === 0) {
      return true;
    }

    const findUndata = find(bindUnData, (item) => {
      return bindKeys.includes(item.firstUnBindKey) && bindKeys.includes(item.secondUnBindKey);
    });
    return findUndata == null;
  }

  // 绑定与否-单个操作
  function switchChange(x, y) {
    return async (checked) => {
      // false 放入 保存未绑定的分组关系
      const currentUnBindData = [...bindUnData];
      if (!checked) {
        const currentBindStatus = {
          mapId,
          firstUnBindKey: x,
          secondUnBindKey: y,
        };

        currentUnBindData.push(currentBindStatus);
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
      }
      setBindUnData([...currentUnBindData]);
    };
  }

  // 大保存
  async function submitSave() {
    const saveResult = await fechSaveUnBind(bindUnData);
    if (!dealResponse(saveResult, true)) {
      setBindUnData([...saveResult]);
    }
  }

  return (
    <div>
      <div>
        <Card bordered={false} style={{ margin: '0px 10px' }}>
          {/* 搜索 */}
          <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <div style={{ flex: 10, display: 'flex' }}>
              <Form form={formRef}>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label={formatMessage({ id: 'app.groupBinding.horizontalaxis' })}
                      name="xType"
                    >
                      <Select
                        placeholder={formatMessage({ id: 'app.groupManage.pleaseSelect' })}
                        style={{ width: '100%' }}
                        showSearch
                        onChange={groupXTypeChange}
                        options={xOptions}
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ padding: '0 12px' }}>
                    <Form.Item
                      label={formatMessage({ id: 'app.groupBinding.verticalaxis' })}
                      name="yType"
                    >
                      <Select
                        allowClear
                        placeholder={formatMessage({ id: 'app.groupManage.pleaseSelect' })}
                        style={{ width: '100%' }}
                        // showSearch
                        filterOption={false}
                        onChange={groupYTypeChange}
                        mode="multiple"
                        maxTagCount={5}
                      >
                        {yOptions &&
                          yOptions.map(({ label, value }, index) => (
                            <Select.Option key={index} value={value}>
                              {label}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col offset={3}>
                    <Button type={'primary'} onClick={submitSave}>
                      <FormattedMessage id={'app.storageManage.save'} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          {/* 内容区 */}
          <div className={styles.tableWeapper} style={{ overflow: 'auto hidden' }}>
            {xData && yData?.length > 0 ? (
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
                                  checked={() => {
                                    theadIsChecked(item.key);
                                  }}
                                  style={{ marginLeft: '10px' }}
                                  size="small"
                                  onClick={(checked) => {
                                    switchXtoYChange(item.key, checked);
                                  }}
                                />
                              </th>
                            );
                          })}
                      </tr>
                    </thead>
                    <tbody>
                      {yData?.map((y) => {
                        let typeTimes = statisticalTypeTimes(yData);
                        return (
                          <tr key={y.id} className={styles.thbodyHeight}>
                            {Object.keys(typeTimes)?.map((i) => {
                              if (i === y.typeName) {
                                const rowslength = typeTimes[i];
                                delete typeTimes[i];
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
                            {xData?.map((x) => {
                              return (
                                <th key={x.id} className={styles.contentBorder}>
                                  <Switch
                                    size="small"
                                    checked={switchChecked(x.key, y.key)}
                                    data-x={x.key}
                                    data-y={y.key}
                                    onChange={switchChange(x.key, y.key)}
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
        </Card>
      </div>
    </div>
  );
};
export default memo(ResourceBind);
