import { formatMessage } from '@/utils/utils';
export function UserTColor() {
  return {
    USER: '#2db7f5',
    APP: '#008080',
  };
}

export function AdminTColor() {
  return {
    USER: '#DF7401',
    ADMIN: '#BDB76B',
    MANAGER: '#3CB371',
    SUPERMANAGER: '#0174DF',
  };
}

export function AdminTLabelMap() {
  return {
    ADMIN: 'Admin', // Lv3
    SUPERMANAGER: formatMessage({ id: 'sso.user.account.type.superManager'  }), // Lv2
    MANAGER: formatMessage({ id: 'sso.user.account.type.manager' }), // Lv1
    USER: formatMessage({ id: 'sso.user.account.type.user' }),
  };
}

export function generateAdminTypeOptions(adminType) {
  const options = [];
  const superManagerOption = {
    label: formatMessage({ id: 'sso.user.account.type.superManager' }),
    value: 'SUPERMANAGER',
  };
  const managerOption = {
    label: formatMessage({ id: 'sso.user.account.type.manager' }),
    value: 'MANAGER',
  };
  const userOption = { label: formatMessage({ id: 'sso.user.account.type.user' }), value: 'USER' };
  if (adminType === 'ADMIN') {
    options.push(superManagerOption);
    options.push(managerOption);
    options.push(userOption);
  }

  if (adminType === 'SUPERMANAGER') {
    options.push(managerOption);
    options.push(userOption);
  }

  if (adminType === 'MANAGER') {
    options.push(userOption);
  }

  return options;
}

export function generateLevelOptions(adminType) {
  const options = [];
  const adminOption = { label: formatMessage({ id: 'sso.common.adminVisible' }), value: 3 };
  const superManagerOption = {
    label: formatMessage({ id: 'sso.common.superManagerVisible' }),
    value: 2,
  };
  const managerOption = { label: formatMessage({ id: 'sso.common.managerVisible' }), value: 1 };
  if (adminType === 'ADMIN') {
    options.push(adminOption);
    options.push(superManagerOption);
    options.push(managerOption);
  }

  if (adminType === 'SUPERMANAGER') {
    options.push(superManagerOption);
    options.push(managerOption);
  }

  if (adminType === 'MANAGER') {
    options.push(managerOption);
  }

  return options;
}
