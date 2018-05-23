import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import websiteManageActions from './action'
import UserDetail from './userDetail';
import '../../styles/common.less';

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      detailModalVisible: false,
      editId: -1,
      title: '',
      phone: ''
    }
    this.handleDetailModalChange = this.handleDetailModalChange.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, websiteManageActions } = this.props;
    appActions.loading(true).then(() => {
      return websiteManageActions.getUserList({
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

  handleDetailModalChange() {
    this.setState({detailModalVisible: false})
  }

  handleView(id) {
    return () => {
      this.setState({
        detailModalVisible: true,
        editId: id
      });
    }
  }

  handlePaginationChange(page, pageSize) {
    const { appActions, websiteManageActions } = this.props;
    const { phone, title } = this.state;
    appActions.loading(true).then(() => {
      return websiteManageActions.getUserList({
        pageNum: page,
        pageSize,
        phone,
        title
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
    const { appActions, websiteManageActions, form, websiteManage } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if ( !err ) {
        appActions.loading(true).then(() => {
          return websiteManageActions.getUserList({
            pageNum: 1,
            pageSize,
            ...values
          })
        }).then((data) => {
          this.setState({
            pageNum: data.data.currentPage,
            title: values.title,
            phone: values.phone
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
    return () => document.getElementById('user-area')
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { websiteManage } = this.props;
    const userList = websiteManage.get('userList') && websiteManage.get('userList');
    const list = userList && userList.get('list') && userList.get('list');
    const total = userList && userList.get('totalCount') && userList.get('totalCount') || 0;
    const current = userList && userList.get('currentPage') && userList.get('currentPage');
    const editData = userList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      render: (name, data, index) => {
        if (name) {
          return <span>{name}</span>
        }
        return '---'
      }
    }, {
      title: '手机号',
      dataIndex: 'phoneHide',
      key: 'phoneHide',
      width: 120,
      render: (phoneHide, data, index) => {
        if (phoneHide) {
          return <span>{phoneHide}</span>
        }
        return '---'
      }
    }, {
      title: '咨询板块',
      dataIndex: 'productName',
      key: 'productName',
      width: 100
    }, {
      title: '咨询时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (createTime) => {
        return (
          <span>{formatDate({time: createTime, showYear: true, showHms: true})}</span>
        )
      }
    }, {
      title: '操作',
      key: 'action',
      width: 60,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleView(data.id)}>查看</a>
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <Layout className='content-common' id='user-area' >
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'姓名'}>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入姓名" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={'手机号'}>
                {getFieldDecorator('phone')(
                  <Input placeholder="请输入手机号" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                清空
              </Button>
            </Col>
          </Row>
        </Form>
        <Content className='table-content-wrap' >
          <div style={{ marginBottom: '5px' }}>共{total}个用户</div>
          <Table columns={columns} dataSource={list} rowKey={this.renderRowKey} pagination={false} />
        </Content>
        <Row type="flex" align="middle" gutter={10} style={{marginTop: '30px'}}>
          <Col span={2}></Col>
          <Col span={20} style={{textAlign: 'right'}}>
            <Pagination showQuickJumper current={current} total={total} pageSize={this.state.pageSize} onChange={this.handlePaginationChange} />
          </Col>
          <Col span={2}>
            <span>共有{total}条</span>
          </Col>
        </Row>
        {
          this.state.detailModalVisible ?
            <UserDetail
              modalVisible={this.state.detailModalVisible}
              modalChange={this.handleDetailModalChange}
              editData={editData}
              /> : null
        }
      </Layout>
    )
  }
}

User.propTypes = {
  form: PropTypes.object,
  websiteManage: PropTypes.object,
  websiteManageActions: PropTypes.object,
  appActions: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const websiteManage = state.get( 'websiteManage' );
  return {
    websiteManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    websiteManageActions: bindActionCreators(websiteManageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(User))
