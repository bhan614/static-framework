/*eslint camelcase: ["error", {properties: "never"}]*/
const menuConfig = {
  ApolloBMS_menu_Base: {
    key: 'Base',
    icon: 'database',
    name: '基础配置',
    sub: {
      ApolloBMS_menu_City: {
        key: 'City',
        name: '城市管理',
      },
      ApolloBMS_menu_Business: {
        key: 'Business',
        name: '业务线配置',
      },
      ApolloBMS_menu_Banner: {
        key: 'Banner',
        name: '轮播图管理',
      },
      ApolloBMS_menu_Product: {
        key: 'Product',
        name: '产品配置',
      },
      ApolloBMS_menu_Advert: {
        key: 'Advert',
        name: '广告配置',
      }
    }
  },
  ApolloBMS_menu_Content: {
    key: 'Content',
    icon: 'file-text',
    name: '内容管理',
    sub: {
      ApolloBMS_menu_Notice: {
        key: 'Notice',
        name: '资讯管理',
      },
      ApolloBMS_menu_Hot: {
        key: 'Hot',
        name: '热门推荐管理',
      },
      ApolloBMS_menu_Topic: {
        key: 'Topic',
        name: '专题管理',
      },
      ApolloBMS_menu_Feedback: {
        key: 'Feedback',
        name: '反馈管理',
      }
    }
  },
  ApolloBMS_menu_UserCenter: {
    key: 'UserCenter',
    icon: 'user',
    name: '用户中心',
    sub: {
      ApolloBMS_menu_User: {
        key: 'User',
        name: '用户管理',
      }
    }
  },
  ApolloBMS_menu_Website: {
    key: 'Website',
    icon: 'desktop',
    name: '官网管理',
    sub: {
      ApolloBMS_menu_WebBanner: {
        key: 'WebBanner',
        name: '轮播图管理',
      },
      ApolloBMS_menu_WebProduct: {
        key: 'WebProduct',
        name: '产品管理',
        sub: {
          ApolloBMS_menu_WebZuBei: {
            key: 'WebZuBei',
            name: '租贝配置',
          },
          ApolloBMS_menu_Decorate: {
            key: 'WebDecorate',
            name: '装贝配置',
          },
          ApolloBMS_menu_Live: {
            key: 'WebLive',
            name: '住贝配置',
          }
        }
      },
      ApolloBMS_menu_WebUser: {
        key: 'WebUser',
        name: '用户管理',
      },
      ApolloBMS_menu_Recruit: {
        key: 'Recruit',
        name: '招聘管理',
      },
      ApolloBMS_menu_News: {
        key: 'News',
        name: '新闻管理',
      }
    }
  }
};

const permissionListConfig = {
  menuList: ['ApolloBMS_menu_App', 'ApolloBMS_menu_Product', 'ApolloBMS_menu_Banner', 'ApolloBMS_menu_City', 'ApolloBMS_menu_Hot',
  'ApolloBMS_menu_Business', 'ApolloBMS_menu_Content', 'ApolloBMS_menu_Notice', 'ApolloBMS_menu_UserCenter', 'ApolloBMS_menu_User',
  'ApolloBMS_menu_Feedback', 'ApolloBMS_menu_Website', 'ApolloBMS_menu_WebBanner', 'ApolloBMS_menu_WebProduct', 'ApolloBMS_menu_WebZuBei',
  'ApolloBMS_menu_Decorate', 'ApolloBMS_menu_Live', 'ApolloBMS_menu_WebUser', 'ApolloBMS_menu_Topic', 'ApolloBMS_menu_Recruit', 'ApolloBMS_menu_News'],
  buttonList: [],
};

export {
  menuConfig,
  permissionListConfig
}
