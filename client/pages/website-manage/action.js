import callApi from '../../utils/callApi';
import localCallApi from '../../utils/localCallApi';
import api from '../../api';
import {uploadData} from '../../utils/uploadData';
import { message } from 'antd'

/**
 * 获取轮播图管理列表
 */
const getCarouselList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.webCarouselList;
    return callApi.post(requestUrl, formData).then(res => {
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
const addCarousel = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.webAddCarousel;
    return callApi.post(requestUrl, formData).then(res => {
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
const changeCarouselState = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.webAddCarousel;
    return callApi.post(requestUrl, formData).then(res => {
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
    const requestUrl = api.webGetBannerNumber;
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
 * 获取租贝列表
 */
const getZuBeiList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.zuBeiList;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'get_zuBei_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 添加和修改租贝
 */
const addZuBei = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.addZuBei;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取装贝列表
 */
const getDecorateList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.decorateList;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'get_decorate_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 添加和修改租贝
 */
const addDecorate = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.addDecorate;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 获取住贝列表
 */
const getLiveList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.liveList;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'get_live_list',
          data: res.data
        }))
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 添加和修改住贝
 */
const addLive = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.addLive;
    return callApi.post(requestUrl, formData).then(res => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    });
  }
}

/**
 * 住贝产品序号
 */
const getLiveNumber = () => {
  return ( dispatch ) => {
    const requestUrl = api.getLiveNumber;
    return callApi.post(requestUrl, {
    }).then(res => {
      if (res.status === 200) {
        return Promise.resolve(dispatch({
          type: 'get_live_sort',
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
const getUserList = (formData) => {
  return ( dispatch ) => {
    const requestUrl = api.webUserList;
    return callApi.post(requestUrl, formData).then(res => {
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
 * --------------------------------------------------------------------------------------------
 */

/**
 * 获取招聘信息列表
 */

 const getRecruitmentList = (formdata) => {
   return (dispatch) => {
     const requestUrl = api.recruitList
     return callApi.post(requestUrl, formdata).then( res => {
       if (res.status === 200) {
         return Promise.resolve(dispatch({
           type: 'RECRUITLIST',
           data: res.data
         }))
       }
       return Promise.reject(res)
     })
   }
 }

 /**
   * 删除招聘信息列表
   */

  const postRecruitDelete = (formdata) => {
    return (dispatch) => {
      const requestUrl = api.deleteRecruit
      return callApi.post(requestUrl, formdata).then(res => { 
        if (res.status === 200) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      })
    }
 }

 /**
  * 获取岗位名称列表
  */
 const getJobName = (formdata) => {
   return (dispatch) => {
     const requestUrl = api.jobList
     return callApi.post(requestUrl, formdata).then(res => {
       return Promise.resolve(dispatch({
         type: 'JOBNAME_LIST',
         jobNameList: res.data
       })).catch((err) => {
         message.error('获取岗位名称列表失败')
       })
     })
   }
 }

 /**
  * 添加岗位信息
  */

  const postAddRecruit = (formdata) => {
    return (dispatch) => {
      const requestUrl = api.addRecruit
      return callApi.post(requestUrl, formdata).then(res => {
        if (res.status === 200) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      })
    }
  }

 /**
  * 获取新闻信息列表
  */

  const getNewsList = (formdata) => {
    return (dispatch) => {
      const requestUrl = api.newsList
      return callApi.post(requestUrl, formdata).then( res => {
        if (res.status === 200) {
          return Promise.resolve(dispatch({
            type: 'NEWSLIST',
            data: res.data
          }))
        }
        return Promise.reject(res)
      })
    }
  }

  /**
   * 删除新闻信息
   */

   const postDeleteNews = (formdata) => {
      return (dispatch) => {
        const requestUrl = api.deleteNews
        return callApi.post(requestUrl, formdata).then(res => { 
          if (res.status === 200) {
            return Promise.resolve(res)
          }
          return Promise.reject(res)
        })
      }
   }

   /**
    * 新增新闻信息接口
    */

    const postAddNews = (formdata) => {
      return (dispatch) => {
        const requestUrl = api.addNews
        return  callApi.post(requestUrl, formdata).then(res => {
          if (res.status === 200) {
            return Promise.resolve(res)
          }
          return Promise.reject(res)
        })
      }
    }

export default {
  getCarouselList,
  addCarousel,
  changeCarouselState,
  getBannerNumber,
  getZuBeiList,
  addZuBei,
  getDecorateList,
  addDecorate,
  getLiveList,
  addLive,
  getLiveNumber,
  getUserList,
  getRecruitmentList,
  getNewsList,
  postDeleteNews,
  postRecruitDelete,
  getJobName,
  postAddNews,
  postAddRecruit
}
