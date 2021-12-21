import React, { memo, useState } from 'react';
import { Tree, Form } from 'antd';
import styles from '../customTask.less';
import {formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull } from '@/utils/utils';

const TaskBodyModal = (props) => {
  const { data } = props;

  const [exampleData, setExampleData] = useState(null);

  function loadTreeNodeDetail(payload) {
    setExampleData(payload);
  }

  function getTreeData() {
    const rootNode = { title: data.name, key: 'root-node', children: [] };
    const _treeData = [rootNode];

    // 生成JSON树结构
    rootNode.children.push({
      title: (
        <span>
          code{' '}
          <span style={{ color: 'red' }}>
            (<FormattedMessage id="app.customTask.cannotEdit" />)
          </span>
        </span>
      ),
      key: data.code,
    });
    rootNode.children.push({
      title: (
        <span
          onClick={() => {
            loadTreeNodeDetail({
              label: formatMessage({ id: 'app.customTask.form.dependencies' }), // 字段名
              field: 'dependencies', // 字段
              default: [], // 默认值
              required: false, // 是否必须
            });
          }}
        >
          dependencies{' '}
          <span className={styles.treeNodeLabel}>
            <FormattedMessage id={'app.customTask.form.dependencies'} />
          </span>
        </span>
      ),
      key: 'dependencies',
    });

    // 任务开始 & 任务结束
    ['customStart', 'customEnd'].forEach((taskTypeCode) => {
      if (isNull(data[taskTypeCode])) return;
      const stepTaskContent = { title: taskTypeCode, key: taskTypeCode, children: [] };
      rootNode.children.push(stepTaskContent);
      Object.keys(data[taskTypeCode]).forEach((key) => {
        if (key !== 'code') {
          stepTaskContent.children.push({
            title: (
              <span
                onClick={() => {
                  loadTreeNodeDetail({
                    label: formatMessage({ id: `app.customTask.form.${key}` }), // 字段名
                    field: key, // 字段
                    default: data[taskTypeCode][key], // 默认值
                    required: false, // 是否必须
                  });
                }}
              >
                {key}{' '}
                {key !== 'customType' ? (
                  <span className={styles.treeNodeLabel}>
                    <FormattedMessage id={`app.customTask.form.${key}`} />
                  </span>
                ) : (
                  <span style={{ color: 'red' }}>
                    (<FormattedMessage id="app.customTask.cannotEdit" />)
                  </span>
                )}
              </span>
            ),
            key: `${taskTypeCode}-${key}`,
          });
        }
      });
    });

    // 中间任务
    ['customActions', 'customEvents', 'customWaits'].forEach((taskTypeCode) => {
      if (isNull(data[taskTypeCode])) return;
      const stepTaskContent = { title: taskTypeCode, key: taskTypeCode, children: [] };
      rootNode.children.push(stepTaskContent);
      Object.keys(data[taskTypeCode]).forEach((subTaskCode) => {
        const subTaskNode1 = { title: subTaskCode, key: subTaskCode, children: [] };
        stepTaskContent.children.push(subTaskNode1);
        Object.keys(data[taskTypeCode][subTaskCode]).forEach((key) => {
          if (key !== 'code') {
            // customActions 中的 targetAction 和 lockTime 存在嵌套，需要再嵌套一层树节点
            if (taskTypeCode === 'customActions' && ['targetAction', 'lockTime'].includes(key)) {
              // 太难命名了, 就用数字吧
              const subTaskNode2 = { title: key, key, children: [] };
              subTaskNode1.children.push(subTaskNode2);
              Object.keys(data[taskTypeCode][subTaskCode][key]).forEach((key2) => {
                subTaskNode2.children.push({
                  title: (
                    <span
                      onClick={() => {
                        loadTreeNodeDetail({
                          label: formatMessage({ id: `app.customTask.form.${key2}` }), // 字段名
                          field: key2, // 字段
                          default: data[taskTypeCode][subTaskCode][key][key2], // 默认值
                          required: key2 === 'target', // 是否必须
                        });
                      }}
                    >
                      {/* 只有 targetAction/target 字段是必填的 */}
                      {key2}{' '}
                      <span className={styles.treeNodeLabel}>
                        <FormattedMessage id={`app.customTask.form.${key2}`} />
                      </span>{' '}
                      {key === 'targetAction' && key2 === 'target' ? (
                        <span style={{ color: 'red' }}>
                          (<FormattedMessage id="app.customTask.example.isRequired" />)
                        </span>
                      ) : null}
                    </span>
                  ),
                  key: `${taskTypeCode}-${subTaskCode}-${key}-${key2}`,
                });
              });
            } else {
              subTaskNode1.children.push({
                title: (
                  <span
                    onClick={() => {
                      loadTreeNodeDetail({
                        label: formatMessage({ id: `app.customTask.form.${key}` }), // 字段名
                        field: key, // 字段
                        default: data[taskTypeCode][subTaskCode][key], // 默认值
                        required: false, // 是否必须
                      });
                    }}
                  >
                    {key}{' '}
                    {key !== 'customType' ? (
                      <span className={styles.treeNodeLabel}>
                        <FormattedMessage id={`app.customTask.form.${key}`} />
                      </span>
                    ) : (
                      <span>
                        <span style={{ color: 'red' }}>
                          (<FormattedMessage id="app.customTask.cannotEdit" />)
                        </span>
                      </span>
                    )}
                  </span>
                ),
                key: `${taskTypeCode}-${subTaskCode}-${key}`,
              });
            }
          }
        });
      });
    });

    return _treeData;
  }

  // JSON结构
  const json = data ? { ...data } : {};
  delete json.name;
  return (
    <div className={styles.taskBodyModal}>
      <div style={{ flex: 1, marginRight: 5 }}>
        <div className={styles.modalColumn}>
          <div style={{ flex: 4, overflow: 'auto' }}>
            <Tree showLine defaultExpandedKeys={['root-node']} treeData={getTreeData()} />
          </div>
          {exampleData && (
            <div className={styles.treeNodeDetail}>
              <Form.Item label={formatMessage({ id: 'app.customTask.example.label' })}>
                {exampleData.label}
              </Form.Item>
              <Form.Item label={formatMessage({ id: 'app.customTask.example.field' })}>
                {exampleData.field}
              </Form.Item>
              <Form.Item label={formatMessage({ id: 'app.customTask.example.default' })}>
                {JSON.stringify(exampleData.default, null, 4)}
              </Form.Item>
              <Form.Item label={formatMessage({ id: 'app.customTask.example.isRequired' })}>
                {<FormattedMessage id={`app.taskDetail.${exampleData.required}`} />}
              </Form.Item>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, marginLeft: 5 }}>
        <div className={styles.modalColumn}>
          <pre>{JSON.stringify(json, null, 4)} </pre>
        </div>
      </div>
    </div>
  );
};
export default memo(TaskBodyModal);
