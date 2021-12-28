import React from 'react';
import { connect } from '@/utils/dva';
import ButtonInput from '@/components/ButtonInput/ButtonInput';

@connect(({ mapViewGroup }) => ({
  selectedCells: mapViewGroup.selectedCells,
}))
class ButtonMultiSelect extends React.PureComponent {
  render() {
    const { selectedCells, ...rest } = this.props;
    return <ButtonInput data={selectedCells}  multi={true} {...rest}/>;
  }
}
export default ButtonMultiSelect;
