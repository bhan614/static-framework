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
  if (action.type === 'get_zuBei_list') {
    return state.set('zuBeiList', Map(action.data));
  }
  if (action.type === 'get_decorate_list') {
    return state.set('decorateList', Map(action.data));
  }
  if (action.type === 'get_live_list') {
    return state.set('liveList', Map(action.data));
  }
  if (action.type === 'get_live_sort') {
    return state.set('liveSort', List(action.data));
  }
  if (action.type === 'get_user_list') {
    return state.set('userList', Map(action.data));
  }
  if (action.type === 'RECRUITLIST') {
    return state.set('recruitList1', Map(action.data));
  }
  if (action.type === 'JOBNAME_LIST') {
    return state.set('jobNameList', List(action.jobNameList));
  }
  if (action.type === 'NEWSLIST') {
    return state.set('newsList', Map(action.data));
  }

  return state;
};
