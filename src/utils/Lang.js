import intl from 'react-intl-universal';

export const formatMessage = ({ id }, placeholder) => intl.get(id, placeholder);

export function FormattedMessage(props) {
  const { id, values = {}, defaultMessage } = props;
  return intl.get(id, values).defaultMessage(defaultMessage);
}
