import React from 'react'
import { render } from 'react-dom'
import {Route, IndexRoute, IndexRedirect} from 'react-router';

import {combineReducers} from 'redux-immutable';

const URL_CONTEXT = require('../../Config').context;
/**
 * 这里用来配置路由规则
 */
import App from './app';
import Carousel from './content-manage/carousel'
import Icon from './content-manage/icon'
import Product from './content-manage/product'
import User from './content-manage/user'
import City from './content-manage/city'
import ErrorPage from './app/errorPage';
import Notice from './content-manage/notice'
import Hot from './content-manage/hot'
import Business from './content-manage/business'
import Advert from './content-manage/advert'
import Feedback from './content-manage/feedback'
import Topic from './content-manage/topic'

import WebCarousel from './website-manage/carousel'
import WebProductZB from './website-manage/productZubei'
import WebProductDecorate from './website-manage/productDecorate'
import WebProductLive from './website-manage/productLive'
import WebUser from './website-manage/user'

import Recruit from './website-manage/Recruit'
import News from './website-manage/News'

const routes = (
  <Route path="/" breadcrumbName="主页" component={App}>
    <Route breadcrumbName="基础配置" path="Base">
      <IndexRedirect to='Banner' />
      <Route path="Banner" breadcrumbName="轮播图管理" component={Carousel} />
      <Route path="Product" breadcrumbName="产品配置" component={Product} />
      <Route path="City" breadcrumbName="城市管理" component={City} />
      <Route path="Business" breadcrumbName="业务线配置" component={Business} />
      <Route path="Advert" breadcrumbName="广告配置" component={Advert} />
    </Route>
    <Route breadcrumbName="内容管理" path="Content">
      <IndexRedirect to='Notice' />
      <Route path="Notice" breadcrumbName="资讯管理" component={Notice} />
      <Route path="Hot" breadcrumbName="热门推荐配置" component={Hot} />
      <Route path="Topic" breadcrumbName="专题管理" component={Topic} />
      <Route path="Feedback" breadcrumbName="反馈管理" component={Feedback} />
    </Route>
    <Route breadcrumbName="用户中心" path="UserCenter">
      <IndexRedirect to='User' />
      <Route path="User" breadcrumbName="用户管理" component={User} />
    </Route>
    <Route breadcrumbName="官网管理" path="Website">
      <IndexRedirect to='WebBanner' />
      <Route path="WebBanner" breadcrumbName="轮播图管理" component={WebCarousel} />
      <Route breadcrumbName="产品管理" path="WebProduct">
        <Route path="WebZuBei" breadcrumbName="租贝配置" component={WebProductZB} />
        <Route path="WebDecorate" breadcrumbName="装贝配置" component={WebProductDecorate} />
        <Route path="WebLive" breadcrumbName="住贝配置" component={WebProductLive} />
      </Route>
      <Route path="WebUser" breadcrumbName="用户管理" component={WebUser} />
      <Route path="Recruit" breadcrumbName="招聘管理" component={Recruit} />
      <Route path="News" breadcrumbName="新闻管理" component={News} />
    </Route>
    <Route path="no-permission" component={ErrorPage} type="no-permission"/>
    <Route path="no-server" component={ErrorPage} type="no-server"/>
    <Route path='*' component={ErrorPage}/>
  </Route>
);

/**
 * 这里用来load reducers
 */
import app from './app/reducers/index'; //app全局
import routing from './app/reducers/routing';
import contentManage from './content-manage/reducer'
import websiteManage from './website-manage/reducer'

const reducers = combineReducers({
  app,
  routing,
  contentManage,
  websiteManage
});

/**
 * render document
 */
import Root from '../Root'
render(
  <Root routes={routes} reducers={reducers} basename={`${URL_CONTEXT}`} />,
  document.getElementById('layout')
);
