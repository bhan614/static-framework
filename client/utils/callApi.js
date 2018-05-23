import 'isomorphic-fetch';
import 'fetch-ie8';
import {context} from '../../Config';
import perfect from './perfect';
// 定义 fetch 默认选项， 看 https://github.com/github/fetch
const defaultOptions = {
  credentials: 'include', //设置该属性可以把 cookie 信息传到后台
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
};

// 检查请求是否成功
function checkStatus(response) {
  const {status} = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.errorCode = status;
  throw error;
}

/**
 * 封装 fetch
 * 根据业务需求，还可以在出错的地方处理相应的功能
 * @param url
 * @param body //往后台传递的 json 参数
 * @param method // 请求 type  get post delete header put
 * @param options // 可选参数项
 * @returns {Promise.<TResult>}
 */
function post(url, body = {}, module = 'apollo', method = 'post', options = {}) {
  if (!url) {
    const error = new Error('请传入 url');
    error.errorCode = 0;
    return Promise.reject(error);
  }

  const fullUrl = '/query';
  const _options = {method: 'post', ...defaultOptions, ...options};
  Object.keys(body).forEach((item) => {
    if (body[item] === null || body[item] === '') {
      delete body[item];
    }
  });
  const obj = {
    module,
    path: url,
    filter: body
  }
  _options.body = perfect.stringifyJSON(obj);

  return fetch(fullUrl, _options)
    .then(checkStatus)
    .then(response =>
      response.json().then(json => ({json, response}))
    ).then(({json, response}) => {
      //错误代码需根据项目实际情况进行定义
      if (json.code === 601 || json.code === 512) {
        window.GlobalModal.show(json.code);
        return Promise.reject(json);
      }
      if (!response.ok || json.status !== 200) {
        console.error('返回的code不等于200 || response.ok无效');
        return Promise.reject(json);
      }
      return json;
    }).catch((error) => {
      console.error('请求错误');
      return Promise.reject(error);
    });
}

const callApi = {
  post
}

export default callApi;
