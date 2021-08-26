import intl from 'react-intl-universal';

export const formatMessage = ({ id }, values) => {
  if (id) {
    const content = intl.get(id, values);
    return content || id;
  }
  return '###';
};

export function FormattedMessage(props) {
  const { id, values = {} } = props;
  return formatMessage({ id }, values);
}

//@ 即将废弃
