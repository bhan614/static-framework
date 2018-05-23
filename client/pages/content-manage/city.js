import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import CityCard from './cityCard'
import '../../styles/common.less';

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class City extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      detailModalVisible: false,
      editId: -1
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getCityList({
        pageNum,
        pageSize
      })
    }).then((data) => {
      this.setState({
        pageNum: data.data.currentPage
      })
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  renderTitle() {
    return (
      <Row type="flex" align="middle" style={{ margin: '0 15px 15px 0' }}>
        <Col span={4}></Col>
        <Col span={16}></Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 新增</Button>
        </Col>
      </Row>
    )
  }

  renderRowKey(data) {
    return data.id;
  }

  addNewCard() {
    this.setState({modalVisible: true, editId: -1});
  }

  handleModalChange() {
    this.setState({modalVisible: false})
  }

  getChangedStatus(flag) {
    if (flag === 0) {
      return '1';
    }
    return '0';
  }

  getStatusValue(flag) {
    if (flag === 0) {
      return '生效'
    }
    if (flag === 1) {
      return '未生效'
    }
  }

  handleChangeState(cityCode, flag) {
    return () => {
      const { appActions, contentManageActions, contentManage } = this.props;
      const { pageSize, pageNum } = this.state;
      const changedStatus = this.getChangedStatus(flag);
      const statusValue = this.getStatusValue(flag);
      confirm({
        title: `确定更改该条城市的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeCityState({
              cityCode,
              flag: changedStatus
            })
            .then(() => {
              return contentManageActions.getCityList({
                pageNum,
                pageSize
               })
            }).then(() => {
              message.success('更改成功');
              appActions.loading(false);
            }).catch(err => {
              appActions.loading(false);
              message.error(err.msg);
            })
          })
        }
      });
    }
  }

  handlePaginationChange(page, pageSize) {
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getCityList({
        pageNum: page,
        pageSize
      })
    }).then((data) => {
      this.setState({
        pageNum: data.data.currentPage,
      })
      appActions.loading(false);
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const cityList = contentManage.get('cityList') && contentManage.get('cityList');
    const list = cityList && cityList.get('list') && cityList.get('list');
    const total = cityList && cityList.get('totalCount') && cityList.get('totalCount') || 0;
    const current = cityList && cityList.get('currentPage') && cityList.get('currentPage');
    const editData = cityList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '城市名称',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
    }, {
      title: '状态',
      dataIndex: 'flag',
      key: 'flag',
      width: 100,
      render: (flag) => {
        if (flag === 1) {
          return <span>生效</span>
        }
        if (flag === 0) {
          return <span>未生效</span>
        }
      }
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
      render: (createTime) => {
        return (
          <span>{formatDate({time: createTime, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      width: 100
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleChangeState(data.cityCode, data.flag)}>更改状态</a>
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <Layout className='content-common' >
        {
          this.renderTitle()
        }
        <Content className='table-content-wrap' >
          <Table columns={columns} dataSource={list} rowKey={this.renderRowKey} pagination={false} />
        </Content>
        <Row type="flex" align="middle" gutter={10} style={{marginTop: '30px'}}>
          <Col span={12}></Col>
          <Col span={10} style={{textAlign: 'right'}}>
            <Pagination showQuickJumper current={current} total={total} pageSize={this.state.pageSize} onChange={this.handlePaginationChange} />
          </Col>
          <Col span={2}>
            <span>共有{total}条</span>
          </Col>
        </Row>
        {
          this.state.modalVisible ?
            <CityCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              /> : null
        }
      </Layout>
    )
  }
}

City.propTypes = {
  form: PropTypes.object,
  contentManage: PropTypes.object,
  contentManageActions: PropTypes.object,
  appActions: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const contentManage = state.get( 'contentManage' );
  return {
    contentManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(City))
