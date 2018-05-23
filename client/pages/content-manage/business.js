import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import '../../styles/common.less';
import BusinessCard from './businessCard'

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class Business extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      editId: -1
    }
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getBusinessList({
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

  renderRowKey(data) {
    return data.id;
  }

  handlePaginationChange(page, pageSize) {
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getBusinessList({
        pageNum: page,
        pageSize,
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

  handleReset() {
    this.props.form.resetFields();
  }

  handleSearch(e) {
    e.preventDefault();
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions, form, contentManage } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if ( !err ) {
        appActions.loading(true).then(() => {
          return contentManageActions.getBusinessList({
            pageNum: 1,
            pageSize,
            ...values
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
    });
  }

  getArea() {
    return () => document.getElementById('business-area')
  }

  renderTitle() {
    return (
      <Row type="flex" align="middle" style={{ margin: '0 15px 15px 15px' }}>
        <Col span={4}></Col>
        <Col span={16}></Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 新增</Button>
        </Col>
      </Row>
    )
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

  handleChangeState(id, status) {
    return (e) => {
      e.preventDefault();
      const { appActions, contentManageActions, contentManage } = this.props;
      const { pageSize, pageNum } = this.state;
      const changedStatus = this.getChangedStatus(status);
      const statusValue = this.getStatusValue(status);
      confirm({
        title: `确定更改该条轮播图的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeBusinessState({
              id,
              flag: changedStatus,
            })
            .then(() => {
              return contentManageActions.getBusinessList({
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

  handleEdit(businessId) {
    return (e) => {
      e.preventDefault();
      this.setState({
        modalVisible: true,
        editId: businessId
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const businessList = contentManage.get('businessList') && contentManage.get('businessList');
    const list = businessList && businessList.get('list') && businessList.get('list');
    const total = businessList && businessList.get('totalCount') && businessList.get('totalCount') || 0;
    const current = businessList && businessList.get('currentPage') && businessList.get('currentPage');
    const editData = businessList && list.find(v => v.businessId === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '业务线',
      dataIndex: 'business',
      key: 'business',
      width: 100
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (createTime) => {
        return (
          <span>{formatDate({time: createTime, showYear: true, showHms: true})}</span>
        )
      }
    }, {
      title: '创建人',
      dataIndex: 'createname',
      key: 'createname',
      width: 80
    }, {
      title: '状态',
      dataIndex: 'flag',
      key: 'flag',
      width: 80,
      render: (flag) => {
        if (flag === 1) {
          return <span>生效</span>
        }
        if (flag === 0) {
          return <span>未生效</span>
        }
      }
    }, {
      title: '操作',
      key: 'action',
      width: 80,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.businessId)}>修改</a>
          <a style={{ marginLeft: '5px' }} onClick={this.handleChangeState(data.businessId, data.flag)}>修改状态</a>
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <Layout className='content-common' id='business-area' >
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
            <BusinessCard
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

Business.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Business))
