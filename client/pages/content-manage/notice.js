import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import NoticeCard from './noticeCard'
import '../../styles/common.less';

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      editId: -1,
      cityCode: '', //北京
      flag: '',
      title: '',
      columns: ''
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }
  componentDidMount() {
    const { pageNum, pageSize, cityCode } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        contentManageActions.getNoticeList({
          pageNum,
          pageSize,
          cityCode
        }),
        contentManageActions.getNoticeNumber(),
        contentManageActions.getCityAddedSelectList(),
        contentManageActions.getColumnSelectList({ type: 1 })
      ])
    }).then((data) => {
      this.setState({
        pageNum: data[0].data.currentPage
      })
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  renderTitle() {
    return (
      <Row type="flex" align="middle" style={{ margin: '0 15px' }}>
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

  handleEdit(id) {
    return () => {
      this.setState({
        modalVisible: true,
        editId: id
      });
    }
  }

  getChangedStatus(status) {
    if (status === 0) {
      return '1';
    }
    return '0';
  }

  getStatusValue(status) {
    if (status === 0) {
      return '生效'
    }
    if (status === 1) {
      return '未生效'
    }
  }

  handleChangeState(id, status, code, isHeadlines) {
    return () => {
      const { appActions, contentManageActions, contentManage } = this.props;
      const { pageSize, pageNum, cityCode, flag, title, columns } = this.state;
      const changedStatus = this.getChangedStatus(status);
      const statusValue = this.getStatusValue(status);
      confirm({
        title: `确定更改该条文章的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeNoticeState({
              id,
              flag: changedStatus,
              cityCode: code,
              isHeadlines
            })
            .then(() => {
               return Promise.all([
                 contentManageActions.getNoticeList({
                   pageNum,
                   pageSize,
                   cityCode,
                   flag,
                   title,
                   columns
                 }),
                 contentManageActions.getNoticeNumber()
               ])
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

  handleReset() {
    this.props.form.resetFields();
  }

  handleSearch(e) {
    e.preventDefault();
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions, form, contentManage } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if ( !err ) {
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        if (values.cityName && values.cityName === '') {
          values.cityCode = ''
        } else if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        appActions.loading(true).then(() => {
          return Promise.all([
            contentManageActions.getNoticeList({
              pageNum: 1,
              pageSize,
              ...values
            }),
            this.props.contentManageActions.getProductNumber()
          ])
        }).then((data) => {
          this.setState({
            pageNum: data[0].data.currentPage,
            cityCode: values.cityCode,
            title: values.title,
            flag: values.flag,
            columns: values.columns
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
    const { appActions, contentManageActions } = this.props;
    const { cityCode, title, flag, columns } = this.state;
    appActions.loading(true).then(() => {
      return contentManageActions.getNoticeList({
        pageNum: page,
        pageSize,
        cityCode,
        title,
        flag,
        columns
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
    return () => document.getElementById('notice-area')
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const noticeList = contentManage.get('noticeList') && contentManage.get('noticeList');
    const list = noticeList && noticeList.get('list') && noticeList.get('list');
    const total = noticeList && noticeList.get('totalCount') && noticeList.get('totalCount') || 0;
    const current = noticeList && noticeList.get('currentPage') && noticeList.get('currentPage');
    const editData = noticeList && list.find(v => v.id === this.state.editId);
    const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
    const columnSelectList = contentManage.get('columnSelectList') && contentManage.get('columnSelectList') || [];
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 80,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 100
    }, {
      title: '副标题',
      dataIndex: 'subtitle',
      key: 'subtitle',
      width: 100
    }, {
      title: '图片预览',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      width: 120,
      render: (imgUrl) => {
        return <img src={imgUrl} width='100' height='50' />
      }
    }, {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 80
    }, {
      title: '栏目',
      dataIndex: 'columnName',
      key: 'columnName',
      width: 80
    }, {
      title: '是否头条',
      dataIndex: 'isHeadlines',
      key: 'isHeadlines',
      width: 80,
      render: (isHeadlines) => {
        if (isHeadlines === 1) {
          return <span>是</span>
        }
        if (isHeadlines === 0) {
          return <span>否</span>
        }
      }
    }, {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 80,
      render: (weight, data) => {
        if (data.flag === 0) {
          return <span>---</span>
        }
        if (weight) {
          return <span style={{marginLeft: '8px'}}>{weight}</span>
        }
        return '---'
      }
    }, {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 80,
      render: (editTime) => {
        return (
          <span>{formatDate({time: editTime, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      width: 60
    }, {
      title: '操作',
      key: 'action',
      width: 100,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          {
            data.isHeadlines === 1 && data.flag === 1  ? null : <a style={{marginLeft: '5px'}} onClick={this.handleChangeState(data.id, data.flag, data.cityCode, data.isHeadlines)}>更改状态</a>
          }
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <Layout className='content-common' id="notice-area">
        {
          this.renderTitle()
        }
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={'文章标题'}>
                {getFieldDecorator('title')(
                  <Input placeholder="请输入文章标题" />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label='城市'>
                { getFieldDecorator( 'cityName', {initialValue: ''})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option key='全国' value=''>全部</Option>
                    {
                      cityList.map((v, k) => (
                        <Option key={v.cityCode} value={v.cityName}>{v.cityName}</Option>
                      ))
                    }
                  </Select>
                ) }
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label='状态'>
                { getFieldDecorator( 'flag', {initialValue: ''})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option value="">全部</Option>
                    <Option value="1">生效</Option>
                    <Option value="0">未生效</Option>
                  </Select>
                ) }
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label='栏目'>
                { getFieldDecorator( 'columns', {initialValue: ''})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option key='全部' value=''>全部</Option>
                    {
                      columnSelectList.map((v, k) => (
                        <Option key={v.code} value={v.code}>{v.name}</Option>
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
            <NoticeCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              cityCode={this.state.cityCode}
              title={this.state.title}
              flag={this.state.flag}
              columns={this.state.columns}
              /> : null
        }
      </Layout>
    )
  }
}

Notice.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Notice))
