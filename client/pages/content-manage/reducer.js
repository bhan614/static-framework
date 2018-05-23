import {Map, List, fromJS} from 'immutable';

const initialState = fromJS({
  loading: false
});

export default (state = initialState, action) => {

  if (action.type === 'get_carousel_list') {
    return state.set('carouselList', Map(action.data));
  }
  if (action.type === 'get_banner_sort') {
    return state.set('bannerSort', List(action.data));
  }
  if (action.type === 'get_icon_list') {
    return state.set('iconList', Map(action.data));
  }
  if (action.type === 'get_icon_sort') {
    return state.set('iconSort', List(action.data));
  }
  if (action.type === 'get_product_list') {
    return state.set('productList', Map(action.data));
  }
  if (action.type === 'get_product_sort') {
    return state.set('productSort', List(action.data));
  }
  if (action.type === 'get_city_select_list') {
    return state.set('citySelectList', List(action.data));
  }
  if (action.type === 'get_city_added_select_list') {
    return state.set('cityAddedSelectList', List(action.data));
  }
  if (action.type === 'get_user_list') {
    return state.set('userList', Map(action.data));
  }
  if (action.type === 'get_city_list') {
    return state.set('cityList', Map(action.data));
  }
  if (action.type === 'get_hot_product_list') {
    return state.set('hotProductList', List(action.data));
  }
  if (action.type === 'get_notice_list') {
    return state.set('noticeList', Map(action.data));
  }
  if (action.type === 'get_notice_sort') {
    return state.set('noticeSort', List(action.data));
  }
  if (action.type === 'get_hot_list') {
    return state.set('hotList', Map(action.data));
  }
  if (action.type === 'get_hot_sort') {
    return state.set('hotSort', List(action.data));
  }
  if (action.type === 'get_tag_list') {
    return state.set('tagList', Map(action.data));
  }
  if (action.type === 'get_business_list') {
    return state.set('businessList', Map(action.data));
  }
  if (action.type === 'get_business_select_list') {
    return state.set('businessSelectList', List(action.data));
  }
  if (action.type === 'get_advert_list') {
    return state.set('advertList', Map(action.data));
  }
  if (action.type === 'get_advert_city_select_list') {
    const list = List(action.data);
    const result = list.filter(v => v.cityName !== '全国');
    return state.set('advertCityList', result);
  }
  if (action.type === 'get_feedback_list') {
    return state.set('feedbackList', Map(action.data));
  }
  if (action.type === 'get_column_select_list') {
    return state.set('columnSelectList', List(action.data));
  }
  if (action.type === 'get_topic_list') {
    return state.set('topicList', Map(action.data));
  }
  if (action.type === 'query_topic_city') {
    return state.set('topicCityStatus', Map(action.data));
  }
  return state;
};
