import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'antd';

const ErrorPage = ({ route }) => {
  const des = () => {
    const type = route.type;
    if (type === 'no-permission') {
      return <span>您没有权限访问该页面</span>
    }

    if (type === 'no-server') {
      return <span>网络出错，无法加载用户权限，请稍后再试</span>
    }
    return <span>该页面没找到，您可能需要<a href="/">去主页</a></span>;
  }
  return (
    <Alert
        message={des()}
        type="warning"
        showIcon
    />
  )
}

ErrorPage.propTypes = {
  route: PropTypes.object
}

export default ErrorPage;
