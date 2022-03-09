import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';

const GroupManagement = () => {};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
}))(memo(GroupManagement));
