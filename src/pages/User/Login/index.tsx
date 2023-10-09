import { Footer } from '@/components';
import { listChartByPageUsingPOST } from '@/services/kaka/chartController';
import { getLoginUserUsingGET, userLoginUsingPOST } from '@/services/kaka/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, useIntl, useModel } from '@umijs/max';
import { Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'umi';
import Settings from '../../../../config/defaultSettings';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();
  useEffect(() => {
    listChartByPageUsingPOST({}).then((res) => {
      console.error('res', res);
    });
  });
  const fetchUserInfo = async () => {
    const userInfo = await getLoginUserUsingGET();
    if (userInfo) {
      flushSync(() => {
        // @ts-ignore
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo.data,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPOST(values);
      if (res.code === 0) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'login success',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        message.error(res.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'login fail, please try again',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: 'Login Page',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="AI-Driven InsightCraft"
          subTitle={'Developed by Kassaking7'}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: 'Login By Password',
                }),
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: 'Username',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="Please Enter Your Username"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: 'Password',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="Please Enter Your Password"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link to="/user/register">Sign Up</Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
