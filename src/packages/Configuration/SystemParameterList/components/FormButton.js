import { Button } from 'antd';

export default function FormButton({ value, options = {} }) {
  return <Button params={options}>{value}</Button>;
}
