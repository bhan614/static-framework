/**
 * 配置二级目录和入口文件
 * @type {{context: string, entry: {panel: string[]}}}
 */

const moduleName = '';//todo:静态资源目录名称,需要修改

module.exports = {
  title: '', //todo:需要修改
  context: '', //todo:二级目录
  moduleName,
  pathInMappingJson: `//statics.com/${moduleName}/`,
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-immutable',
      'immutable',
      'isomorphic-fetch',
      'fetch-ie8',
      'antd'
    ],
    [`${moduleName}`]: ['./client/pages/index.js']
  },
  html: [{
    filename: `${moduleName}.html`,
    template: './client/template/template.hbs',
    chunks: ['vendor', `${moduleName}`]
  }]
};
