import callApi from '../../utils/callApi';
import localCallApi from '../../utils/localCallApi';
import api from '../../api';
import {uploadData} from '../../utils/uploadData';

 /**
  * 获取轮播图管理列表
  */
 const getCarouselList = ( { pageNum, pageSize, title, cityCode, flag, business, businessId } ) => {
   return ( dispatch ) => {
     const requestUrl = api.carouselList;
     const options = {
       pageNum,
       pageSize
     }
     options.title = title || '';
     options.cityCode = cityCode || '';
     options.flag = flag || '';
     options.business = business || '';
     options.businessId = businessId || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_carousel_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加和修改轮播图
  */
 const addCarousel = ( { id, title, url, iconUrl, weight, flag, cityCode, isShare, shareTitle, shareUrl, business, businessId, cityName } ) => {
   return ( dispatch ) => {
     const requestUrl = api.addCarousel;
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.title = title || '';
     options.url = url || '';
     options.iconUrl = iconUrl || '';
     options.weight = weight || '';
     options.flag = flag || '';
     options.cityCode = cityCode || '';
     options.cityName = cityName || '';
     options.isShare = isShare || '';
     options.shareTitle = shareTitle || '';
     options.shareUrl = shareUrl || '';
     options.business = business || '';
     options.businessId = businessId || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

/**
 * 修改轮播图状态
 */
 const changeCarouselState = ({ id, flag, weight, cityCode }) => {
   return ( dispatch ) => {
     const requestUrl = api.addCarousel;
     const options = weight !== null ? { weight } : {};
     options.id = id;
     options.flag = flag;
     options.cityCode = cityCode;
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 新闻banner序号
  */
 const getBannerNumber = () => {
   return ( dispatch ) => {
     const requestUrl = api.getBannerNumber;
     return callApi.post(requestUrl, {
     }).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_banner_sort',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 获取icon管理列表
  */
 const getIconList = ( { pageNum, pageSize, cityCode, status, name } ) => {
   return ( dispatch ) => {
     const requestUrl = api.iconList;
     const options = {
       pageNum,
       pageSize
     }
     if (name) {
       options.name = name;
     }
     if (cityCode) {
       options.cityCode = cityCode;
     }
     if (status) {
       options.status = status;
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_icon_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加和修改icon
  */
 const addIcon = ( { id, name, url, imgUrl, weight, status, cityCode } ) => {
   return ( dispatch ) => {
     const requestUrl = api.addIcon;
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.name = name || '';
     options.url = url || '';
     options.iconUrl = imgUrl || '';
     options.weight = weight || '';
     options.status = status || '';
     options.cityCode = cityCode || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

/**
 * 修改icon状态
 */
 const changeIconState = ({ id, status, weight, cityCode }) => {
   return ( dispatch ) => {
     const requestUrl = api.addIcon;
     const options = weight !== null ? { weight } : {};
     options.id = id;
     options.status = status;
     options.cityCode = cityCode;
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 新闻icon序号
  */
 const getIconNumber = () => {
   return ( dispatch ) => {
     const requestUrl = api.getIconNumber;
     return callApi.post(requestUrl, {
     }).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_icon_sort',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 获取产品列表
  */
 const getProductList = ( { pageNum, pageSize, name, cityCode, status, flag, business, businessId } ) => {
   return ( dispatch ) => {
     const requestUrl = api.productList;
     const options = {
       pageNum,
       pageSize
     }
     options.name = name || '';
     options.cityCode = cityCode || '';
     options.status = status || '';
     options.flag = flag || '';
     options.business = business || '';
     options.businessId = businessId || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_product_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加和修改产品
  */
 const addProduct = (formData) => {
   return ( dispatch ) => {
     const requestUrl = api.addProduct;
     return callApi.post(requestUrl, formData).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

/**
 * 修改产品状态
 */
 const changeProductState = ({ id, status, weight, cityCode }) => {
   return ( dispatch ) => {
     const requestUrl = api.addProduct;
     const options = weight !== null ? { weight } : {};
     options.id = id;
     options.status = status;
     options.cityCode = cityCode;
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 新闻产品序号
  */
 const getProductNumber = () => {
   return ( dispatch ) => {
     const requestUrl = api.getProductNumber;
     return callApi.post(requestUrl, {
     }).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_product_sort',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 获取用户列表
  */
 const getUserList = ( { pageNum, pageSize, name, phone, isReal } ) => {
   return ( dispatch ) => {
     const requestUrl = api.userList;
     const options = {
       pageNum,
       pageSize
     }
     if (name) {
       options.name = name
     }
     if (phone) {
       options.phone = phone
     }
     if (isReal) {
       options.isReal = isReal
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_user_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 获取用户列表
  */
 const getCityList = ( { pageNum, pageSize } ) => {
   return ( dispatch ) => {
     const requestUrl = api.cityList;
     const options = {
       pageNum,
       pageSize
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_city_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 修改城市状态
  */
  const changeCityState = ({ cityCode, flag }) => {
    return ( dispatch ) => {
      const requestUrl = api.changeCityState;
      const options = {};
      options.cityCode = cityCode;
      options.flag = flag;
      return callApi.post(requestUrl, options).then(res => {
        if (res.status === 200) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      });
    }
  }

  /**
   * 添加城市
   */
  const addCity = ( { cityCode, cityName } ) => {
    return ( dispatch ) => {
      const requestUrl = api.addCity;
      const options = {};
      options.cityName = cityName || '';
      options.cityCode = cityCode || '';
      return callApi.post(requestUrl, options).then(res => {
        if (res.status === 200) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      });
    }
  }
  /**
   * 获取城市下拉
   */
 const getCitySelectList = () => {
   return ( dispatch ) => {
     const requestUrl = api.citySelectList;
     return callApi.post(requestUrl).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_city_select_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 获取添加的城市列表
  */
const getCityAddedSelectList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.cityAddedSelectList;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'get_city_added_select_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取广告的城市列表
 */
const getAdvertCitySelectList = () => {
 return ( dispatch ) => {
   const requestUrl = api.cityAddedSelectList;
   return callApi.post(requestUrl).then(res => {
     if (res.status === 200) {
       return Promise.resolve(dispatch({
         type: 'get_advert_city_select_list',
         data: res.data
       }))
     }
     return Promise.reject(res)
   });
 }
}

/**
  * 获取公告管理列表
  */
 const getNoticeList = ( { pageNum, pageSize, cityCode, title, flag, columns } ) => {
   return ( dispatch ) => {
     const requestUrl = api.noticeList;
     const options = {
       pageNum,
       pageSize
     }
     if (cityCode) {
       options.cityCode = cityCode
     }
     if (title) {
       options.title = title
     }
     if (flag) {
       options.flag = flag
     }
     if (columns) {
       options.columns = columns
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_notice_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

  /**
   * 修改公告状态
   */
 const changeNoticeState = ({ id, flag, cityCode, isHeadlines }) => {
   return ( dispatch ) => {
     const requestUrl = api.addNotice;
     return callApi.post(requestUrl, {
       id,
       flag,
       cityCode,
       isHeadlines
     }).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 /**
  * 添加公告
  */
 const addNotice = ( { id, cityName, cityCode, flag, imgUrl, content, isHeadlines, title, weight, source, columns, subtitle, summary } ) => {
   return ( dispatch ) => {
     const requestUrl = api.addNotice;
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.flag = flag || '';
     options.title = title || '';
     options.content = content || '';
     options.imgUrl = imgUrl || '';
     options.isHeadlines = isHeadlines || '';
     options.weight = weight || '';
     options.source = source || '';
     options.columns = columns || '';
     options.subtitle = subtitle || '';
     options.summary = summary || '';
     if (cityName) {
       options.cityName = cityName
       options.cityCode = cityCode
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 const getNoticeNumber = () => {
   return ( dispatch ) => {
     const requestUrl = api.getNoticeNumber;
     return callApi.post(requestUrl, {
     }).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_notice_sort',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 const getHotList = ( { pageNum, pageSize, title, cityCode, flag, business, businessId } ) => {
   return ( dispatch ) => {
     const requestUrl = api.hotList;
     const options = {
       pageNum,
       pageSize
     }
     options.title = title || '';
     options.cityCode = cityCode || '';
     options.flag = flag || '';
     options.business = business || '';
     options.businessId = businessId || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_hot_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 const addHot = ( { id, title, hotUrl, imgUrl, weight, flag, cityCode, subtitle, business, businessId, cityName, content, type, source } ) => {
   return ( dispatch ) => {
     const requestUrl = api.addHot;
     const options = id !== null ? { id } : {};  //id存在更新 不存在新增
     options.title = title || '';
     options.imgUrl = imgUrl || '';
     options.weight = weight || '';
     options.flag = flag || '';
     options.cityCode = cityCode || '';
     options.cityName = cityName || '';
     options.subtitle = subtitle || '';
     options.business = business || '';
     options.businessId = businessId || '';
     options.type = type || '';
     if (type === '1') {
       options.content = content || '';
       options.source = source || '';
      } else {
       options.hotUrl = hotUrl || '';
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 const changeHotState = ({ id, flag, weight, cityCode }) => {
   return ( dispatch ) => {
     const requestUrl = api.addHot;
     const options = weight !== null ? { weight } : {};
     options.id = id;
     options.flag = flag;
     options.cityCode = cityCode;
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 const getHotNumber = () => {
   return ( dispatch ) => {
     const requestUrl = api.getHotNumber;
     return callApi.post(requestUrl, {
     }).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_hot_sort',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 const getTagList = ( { pageNum, pageSize, tag, cityCode } ) => {
   return ( dispatch ) => {
     const requestUrl = api.hotList;
     const options = {
       pageNum,
       pageSize
     }
     if (tag) {
       options.tag = tag;
     }
     if (cityCode) {
       options.cityCode = cityCode;
     }
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'get_tag_list',
           data: res.data
         }))
       }
       return Promise.reject(res)
     });
   }
 }

 const addTag = ( { cityCode, cityName, tag } ) => {
   return ( dispatch ) => {
     const requestUrl = api.addCity;
     const options = {};
     options.cityName = cityName || '';
     options.cityCode = cityCode || '';
     options.tag = tag || '';
     return callApi.post(requestUrl, options).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }

 const uploadFiles = (formData) => {
   return ( dispatch ) => {
     const requestUrl = uploadData.url;
     return localCallApi.postForm(requestUrl, formData).then(res => {
       if (res.code === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
  }

  const getBusinessList = ( { pageNum, pageSize, business } ) => {
    return ( dispatch ) => {
      const requestUrl = api.businessList;
      const options = {
        pageNum,
        pageSize
      }
      if (business) {
        options.business = business
      }
      return callApi.post(requestUrl, options).then(res => {
        if (res.status === 200) {
          return Promise.resolve(dispatch({
            type: 'get_business_list',
            data: res.data
          }))
        }
        return Promise.reject(res)
      });
    }
  }

  const addBusiness = ( { business, id } ) => {
    return ( dispatch ) => {
      const requestUrl = api.addBusiness;
      const options = id !== null ? { businessId: id } : {};
      options.business = business || '';
      return callApi.post(requestUrl, options).then(res => {
        if (res.status === 200) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      });
    }
  }

  const getBusinessSelectList = () => {
    return ( dispatch ) => {
      const requestUrl = api.businessSelectList;
      const options = {};
      return callApi.post(requestUrl, options).then(res => {
        if (res.status === 200) {
          return Promise.resolve(dispatch({
            type: 'get_business_select_list',
            data: res.data
          }))
        }
        return Promise.reject(res)
      });
    }
  }

  const changeBusinessState = ({ id, flag }) => {
    return ( dispatch ) => {
      const requestUrl = api.addBusiness;
      const options = {};
      options.businessId = id;
      options.flag = flag;
      return callApi.post(requestUrl, options).then(res => {
        if (res.status === 200) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      });
    }
  }

  /**
 * 获取广告管理列表
 */
const getAdvertList = ( { pageNum, pageSize } ) => {
  return ( dispatch ) => {
    const requestUrl = api.advertList;
    return callApi.post(requestUrl, {
      pageNum,
      pageSize
    }).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'get_advert_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 添加和修改广告
 */
const addAdvert = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.addAdvert;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 删除广告管理列表
 */
 const deleteAdvert = ({ id }) => {
   return ( dispatch ) => {
     const requestUrl = api.deleteAdvert;
     return callApi.post(requestUrl, {
       id
     }).then(res => {
       if (res.status === 200) {
         return Promise.resolve(res)
       }
       return Promise.reject(res)
     });
   }
 }
/**
* 修改广告状态
*/
const changeAdvertState = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.addAdvert;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
* 获取反馈列表
*/
const getFeedbackList = (formData) => {
return ( dispatch ) => {
  const requestUrl = api.feedbackList;
  return callApi.post(requestUrl, formData).then(res => {
    if (res.status === 200) {
      return Promise.resolve(dispatch({
        type: 'get_feedback_list',
        data: res.data
      }))
    }
    return Promise.reject(res)
  });
}
}

/**
* 添加反馈
*/
const addFeedback = (formData) => {
return ( dispatch ) => {
  const requestUrl = api.addFeedback;
  return callApi.post(requestUrl, formData).then(res => {
    if (res.status === 200) {
      return Promise.resolve(res)
    }
    return Promise.reject(res)
  });
}
}

/**
* 咨询栏目下拉
*/

const getColumnSelectList = (formData) => {
 return ( dispatch ) => {
   const requestUrl = api.columnSelectList;
   return callApi.post(requestUrl, formData).then(res => {
     if (res.status === 200) {
       return Promise.resolve(dispatch({
         type: 'get_column_select_list',
         data: res.data
       }))
     }
     return Promise.reject(res)
   });
 }
}

const getTopicList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.topicList;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'get_topic_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

const queryTopicCity = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.queryTopicCity;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'query_topic_city',
          data: {topicCode: res.data}
        }))
      }
      return Promise.reject(res)
    });
  }
}

const addTopic = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.addTopic;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

export default {
  getCarouselList,
  addCarousel,
  changeCarouselState,
  getBannerNumber,
  getIconList,
  addIcon,
  changeIconState,
  getIconNumber,
  getProductList,
  addProduct,
  changeProductState,
  getProductNumber,
  getUserList,
  getCityList,
  changeCityState,
  getCitySelectList,
  getCityAddedSelectList,
  addCity,
  getNoticeList,
  changeNoticeState,
  addNotice,
  uploadFiles,
  getNoticeNumber,
  addHot,
  getHotList,
  getHotNumber,
  changeHotState,
  getTagList,
  addTag,
  getBusinessList,
  addBusiness,
  getBusinessSelectList,
  changeBusinessState,
  getAdvertList,
  addAdvert,
  deleteAdvert,
  changeAdvertState,
  getAdvertCitySelectList,
  getFeedbackList,
  addFeedback,
  getColumnSelectList,
  getTopicList,
  addTopic,
  queryTopicCity
}
