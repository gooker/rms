import TablePageHOC from '@/components/TablePageHOC';
import commonStyles from '@/common.module.less';

const TablePageWrapper = (props) => {
  const { children, pageHeight } = props;
  const [tool, table, ...restChildren] = children;
  return (
    <div className={commonStyles.tablePageWrapper} style={{ height: pageHeight }}>
      <div style={{ marginBottom: 20 }}>{tool}</div>
      <div className={commonStyles.tableWrapper}>{table}</div>
      <div>{restChildren}</div>
    </div>
  );
};
export default TablePageHOC(TablePageWrapper);
