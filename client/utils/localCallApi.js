import 'isomorphic-fetch';
import 'fetch-ie8';
import {context} from '../../Config';
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
function callApiFn(url, body = {}, method = 'get', options = {}) {
  if (!url) {
    const error = new Error('请传入 url');
    error.errorCode = 0;
    return Promise.reject(error);
  }

  let fullUrl = url;
  if (context) {
    fullUrl = `${context}/${url}`;
  }

  let _options = {method, ...defaultOptions, ...options};

  if (method !== 'get' && method !== 'head' && method !== 'form') {
    //数据为 null 不要传到后台
    Object.keys(body).forEach((item) => {
      if (body[item] === null || body[item] === '') {
        delete body[item];
      }
    });
    _options.body = JSON.stringify(body);
  }
  if (method === 'form') {
    _options = {
      method: 'post',
      body
    }
  }

  return fetch(fullUrl, _options)
    .then(checkStatus)
    .then(response =>
      response.json().then(json => ({json, response}))
    ).then(({json, response}) => {
      if (!response.ok) {
        // 根据后台实际返回数据来定义错误格式
        const error = new Error(json.message || '获取数据出错');
        error.errorCode = json.errorCode;
        return Promise.reject(error, json);
      }
      return json;
    }).catch((error) => {
      return Promise.reject(error);
    });
}

function get(url = '', body = {}) {
  return callApiFn(url, body, 'get')
}

function post(url = '', body = {}) {
  return callApiFn(url, body, 'post')
}

function postForm(url = '', body = {}) {
  return callApiFn(url, body, 'form')
}

const localCallApi = {
  get,
  post,
  postForm
}

export default localCallApi;
