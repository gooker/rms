import { Row, Col} from 'antd';
import styles from './pages/AgvRealTime/index.module.less';

const LabelColComponent = (props) => {
  const { label, children} = props;
  return (
    <Row style={{marginBottom:15}}>
      <Col span={7}  className={styles.textRight}>
         <span >{label}:</span>
      </Col>
      <Col span={17} >
      <div style={{ flex: 1, marginLeft: 10 }}>{children}</div>
      </Col>

    </Row>
  );
};
export default LabelColComponent;
