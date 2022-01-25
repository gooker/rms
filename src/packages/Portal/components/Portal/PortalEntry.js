import React, { memo } from 'react';
import { Badge } from 'antd';
import classNames from 'classnames';
import { GlobalOutlined, UserOutlined } from '@ant-design/icons';
import styles from './Portal.module.less';

const XIHE = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          onClick={() => {
            checkoutApp(name);
          }}
          style={{
            width,
            height,
            borderRadius: size === 'normal' ? `4px` : 0,
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
            backgroundImage: 'linear-gradient(rgb(80, 198, 236),rgb(35, 185, 136))',
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
        >
          <img
            style={{
              height: '72%',
              width: '90%',
              display: 'block',
              verticalAlign: 'middle',
            }}
            src={require('@/../public/images/xihe.png').default}
          />
        </span>
      </Badge>
    </div>
  );
};

const Mixrobot = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          style={{
            width,
            height,
            borderRadius: size === 'normal' ? `4px` : 0,
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
            background: 'linear-gradient(rgb(80, 198, 236),rgb(35, 185, 136))',
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
          onClick={() => {
            checkoutApp(name);
          }}
        >
          M
        </span>
      </Badge>
    </div>
  );
};

const LatentLifting = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          onClick={() => {
            checkoutApp(name);
          }}
          style={{
            width,
            height,
            borderRadius: size === 'normal' ? `4px` : 0,
            backgroundImage: 'linear-gradient(#33CC33, #006633)',
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
        >
          <img
            style={{
              height: '70%',
              display: 'block',
              verticalAlign: 'middle',
              margin: '8px auto',
            }}
            src={require('@/../public/images/agv_latent.png').default}
          />
        </span>
      </Badge>
    </div>
  );
};

const Tote = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          onClick={() => {
            checkoutApp(name);
          }}
          style={{
            width,
            height,
            borderRadius: size === 'normal' ? `4px` : 0,
            backgroundImage: 'linear-gradient(rgb(228, 148, 92), rgba(181, 22, 22, 0.93))',
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
        >
          <img
            style={{
              height: '100%',
              display: 'block',
              verticalAlign: 'middle',
              margin: '0 auto',
            }}
            src={require('@/../public/images/agv_tote.png').default}
          />
        </span>
      </Badge>
    </div>
  );
};

const Sorter = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          onClick={() => {
            checkoutApp(name);
          }}
          style={{
            width,
            height,
            borderRadius: size === 'normal' ? `4px` : 0,
            backgroundImage: 'linear-gradient(rgb(80, 198, 236),rgb(35, 185, 136))',
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
        >
          <img
            style={{
              height: '100%',
              display: 'block',
              verticalAlign: 'middle',
            }}
            src={require('@/../public/images/agv_sorter.png').default}
          />
        </span>
      </Badge>
    </div>
  );
};

const ForkLifting = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          onClick={() => {
            checkoutApp(name);
          }}
          style={{
            width,
            height,
            borderRadius: size === 'normal' ? `4px` : 0,
            backgroundImage: 'linear-gradient(#CCCC33, #CCCC66)',
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
        >
          <img
            style={{
              height: '100%',
              display: 'block',
              verticalAlign: 'middle',
            }}
            src={require('@/../public/images/agv_forklift.png').default}
          />
        </span>
      </Badge>
    </div>
  );
};

const SSO = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          style={{
            width,
            height,
            background: '#993366',
            borderRadius: size === 'normal' ? '4px' : 0,
            fontSize: size === 'normal' ? '30px' : '13px',
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
          onClick={() => {
            checkoutApp(name);
          }}
        >
          <UserOutlined />
        </span>
      </Badge>
    </div>
  );
};

const I18N = (props) => {
  const { name, width, height, size = 'normal', currentApp, checkoutApp } = props;
  return (
    <div key={name} className={styles.portalItem} style={size === 'normal' ? { height: 48 } : {}}>
      <Badge dot={currentApp && currentApp ? currentApp === name : false}>
        <span
          style={{
            width,
            height,
            background: '#0099FF',
            borderRadius: size === 'normal' ? `4px` : 0,
            fontSize: size === 'normal' ? '30px' : '13px',
            filter: `brightness(${currentApp === name ? 1 : 0.5})`,
          }}
          className={classNames(styles.portalItemIconContainer, styles.selectApp)}
          onClick={() => {
            checkoutApp(name);
          }}
        >
          <GlobalOutlined />
        </span>
      </Badge>
    </div>
  );
};

export default {
  XIHE: memo(XIHE),
  Mixrobot: memo(Mixrobot),
  LatentLifting: memo(LatentLifting),
  Tote: memo(Tote),
  Sorter: memo(Sorter),
  ForkLifting: memo(ForkLifting),
  SSO: memo(SSO),
  I18N: memo(I18N),
};
