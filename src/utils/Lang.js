import intl from 'react-intl-universal';

export const formatMessage = ({ id }, values) => {
  const content = intl.get(id, values);
  return content || id;
};

export function FormattedMessage(props) {
  const { id, values = {} } = props;
  return formatMessage({ id }, values);
}
