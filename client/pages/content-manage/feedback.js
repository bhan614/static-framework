import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import FeedbackCard from './feedbackCard'
import FeedbackDetail from './feedbackDetail'
import '../../styles/common.less';
import { feedbackTypeData, feedbackData } from './dataConfig'

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      detailModalVisible: false,
      editId: -1,
      type: '',
      resulttype: ''
    }
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleDedailModalChange = this.handleDedailModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize, cityCode } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getFeedbackList({
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

  handleModalChange() {
    this.setState({modalVisible: false})
  }

  handleDedailModalChange() {
    this.setState({detailModalVisible: false})
  }

  handleEdit(id) {
    return () => {
      this.setState({
        modalVisible: true,
        editId: id
      });
    }
  }

  handleView(id) {
    return () => {
      this.setState({
        detailModalVisible: true,
        editId: id
      });
    }
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
          return contentManageActions.getFeedbackList({
            pageNum: 1,
            pageSize,
            ...values
          })
        }).then((data) => {
          this.setState({
            pageNum: data.data.currentPage,
            cityCode: values.cityCode,
            type: values.type,
            resulttype: values.resulttype
          })
          appActions.loading(false)
        }).catch(err => {
          appActions.loading(false)
          message.error(err.msg);
        })
      }
    });
  }

  handlePaginationChange(page, pageSize) {
    const { resulttype, type } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getFeedbackList({
        pageNum: page,
        pageSize,
        type,
        resulttype
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

  getArea() {
    return () => document.getElementById('feedback-area')
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const feedbackList = contentManage.get('feedbackList') && contentManage.get('feedbackList');
    const list = feedbackList && feedbackList.get('list') && feedbackList.get('list');
    const total = feedbackList && feedbackList.get('totalCount') && feedbackList.get('totalCount') || 0;
    const current = feedbackList && feedbackList.get('currentPage') && feedbackList.get('currentPage');
    const editData = feedbackList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '反馈类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        return feedbackTypeData.map(v => {
          if (type && type === Number(v.type)) {
            return v.name
          }
          return ''
        })
      }
    }, {
      title: '反馈内容',
      dataIndex: 'content',
      key: 'content',
      width: 180,
      render: (content) => {
        return (
          <div className="text-ellipsis">
            {content}
          </div>
        )
      }
    }, {
      title: '联系方式',
      dataIndex: 'contactway',
      key: 'contactway',
      width: 100,
      render: (contactway) => {
        if (contactway) {
          return <span>{contactway}</span>
        }
        return '---'
      }
    }, {
      title: '反馈时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 70,
      render: (createTime) => {
        return (
          <span>{formatDate({time: createTime, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '处理结果',
      dataIndex: 'resulttype',
      key: 'resulttype',
      width: 100,
      render: (resulttype) => {
        return feedbackData.map(v => {
          if (resulttype && resulttype === Number(v.type)) {
            return v.name
          }
          return ''
        })
      }
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleView(data.id)}>查看</a>
          {
            data.resulttype === 1 ? <a style={{marginLeft: '5px'}} onClick={this.handleEdit(data.id)}>处理反馈</a> : null
          }
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };
    return (
      <Layout className='content-common' id="feedback-area" >
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={6}>
              <FormItem {...formItemLayout} label='反馈类型'>
                { getFieldDecorator( 'type', {initialValue: this.state.type})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option key='全部' value=''>全部</Option>
                    {
                      feedbackTypeData.map((v, k) => (
                        <Option key={v.type} value={v.type}>{v.name}</Option>
                      ))
                    }
                  </Select>
                ) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label='处理结果'>
                { getFieldDecorator( 'resulttype', {initialValue: this.state.resulttype})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option key='全部' value=''>全部</Option>
                    {
                      feedbackData.map((v, k) => (
                        <Option key={v.type} value={v.type}>{v.name}</Option>
                      ))
                    }
                  </Select>
                ) }
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
            <FeedbackCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              type={this.state.type}
              resulttype={this.state.resulttype}
              /> : null
        }
        {
          this.state.detailModalVisible ?
            <FeedbackDetail
              modalVisible={this.state.detailModalVisible}
              modalChange={this.handleDedailModalChange}
              editData={editData}
              type={this.state.type}
              resulttype={this.state.resulttype}
              /> : null
        }
      </Layout>
    )
  }
}

Feedback.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Feedback))
