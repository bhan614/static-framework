import React from 'react';
import { Modal } from 'antd';

const port = location.port ? ':8888' : '';

class GlobalModal {
  content = (code) => {
    if (code === 512) {
      return (
        <div>
          <p>当前账号正在另一地点登录，您已被迫下线。</p>
          <p>如非本人操作，那么您的密码很可能已泄露。建议前往<a href={''}>变更密码</a>。</p>
        </div>
      )
    }
    return <span>登录失效, 请点击去登录</span>
  }

  show = (code) => {
    if (window.loginModalRef) return;
    window.loginModalRef = Modal.warning({
      title: '提示',
      content: this.content(code),
      okText: code === 512 ? '知道了' : '去登录',
      onOk() {
        window.loginModalRef.destroy();
        window.loginModalRef = null;
        const returnUrl = encodeURIComponent(location.href);
        window.location.href = '';
      }
    });
  }
}
export default GlobalModal;
