import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import IconCard from './iconCard'
import '../../styles/common.less';

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class Icon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      editId: -1,
      cityCode: 110000, //北京
      status: '',
      name: ''
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
  componentWillMount() {
    const { pageNum, pageSize, cityCode } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        contentManageActions.getIconList({
          pageNum,
          pageSize,
          cityCode
        }),
        this.props.contentManageActions.getIconNumber(),
        this.props.contentManageActions.getCityAddedSelectList()
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

  handleChangeState(id, flag, code) {
    return () => {
      const { appActions, contentManageActions, contentManage } = this.props;
      const { pageSize, pageNum, cityCode, status, name } = this.state;
      const changedStatus = this.getChangedStatus(flag);
      const statusValue = this.getStatusValue(flag);
      const iconSort = contentManage && contentManage.get('iconSort') && contentManage.get('iconSort');
      confirm({
        title: `确定更改该条Icon的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeIconState({
              id,
              status: changedStatus,
              sort: flag === 0 ? iconSort.get('0') + 1 : null,
              cityCode: code
            })
            .then(() => {
              return Promise.all([
                contentManageActions.getIconList({
                  pageNum,
                  pageSize,
                  cityCode,
                  status,
                  name
                 }),
                contentManageActions.getIconNumber()
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
            contentManageActions.getIconList({
              pageNum: 1,
              pageSize,
              ...values
            }),
            this.props.contentManageActions.getIconNumber()
          ])
        }).then((data) => {
          this.setState({
            pageNum: data[0].data.currentPage,
            cityCode: values.cityCode,
            name: values.name,
            status: values.status
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
    const { cityCode, name, status } = this.state;
    appActions.loading(true).then(() => {
      return contentManageActions.getIconList({
        pageNum: page,
        pageSize,
        cityCode,
        name,
        status
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
    return () => document.getElementById('icon-area')
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const iconList = contentManage.get('iconList') && contentManage.get('iconList');
    const list = iconList && iconList.get('list') && iconList.get('list');
    const total = iconList && iconList.get('totalCount') && iconList.get('totalCount') || 0;
    const current = iconList && iconList.get('currentPage') && iconList.get('currentPage');
    const editData = iconList && list.find(v => v.id === this.state.editId);
    const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
    let firstCity = '';
    if (cityList && cityList.size > 0) {
      firstCity = '北京'
    }
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
      dataIndex: 'name',
      key: 'name',
      width: 100
    }, {
      title: '图片预览',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      width: 100,
      render: (iconUrl) => {
        return <img src={iconUrl} width='70' height='70' />
      }
    }, {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
    }, {
      title: '排序',
      dataIndex: 'weight',
      key: 'weight',
      width: 70,
      render: (weight, data) => {
        if (data.status === 0) {
          return <span style={{marginLeft: '8px'}}>---</span>
        }
        if (weight) {
          return <span style={{marginLeft: '8px'}}>{weight}</span>
        }
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (status) => {
        if (status === 1) {
          return <span>生效</span>
        }
        if (status === 0) {
          return <span>未生效</span>
        }
      }
    }, {
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 70,
      render: (time) => {
        return (
          <span>{formatDate({time, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 70,
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
      title: '修改人',
      dataIndex: 'updateName',
      key: 'updateName',
      width: 60
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleChangeState(data.id, data.status, data.cityCode)}>更改状态</a>
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <Layout className='content-common' id='icon-area' >
        {
          this.renderTitle()
        }
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={'轮播Icon标题'}>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入icon标题" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label='城市'>
                { getFieldDecorator( 'cityName', {initialValue: firstCity})(
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
            <Col span={6}>
              <FormItem {...formItemLayout} label='状态'>
                { getFieldDecorator( 'status', {initialValue: ''})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option value="">全部</Option>
                    <Option value="1">生效</Option>
                    <Option value="0">未生效</Option>
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
            <IconCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              cityCode={this.state.cityCode}
              name={this.state.name}
              status={this.state.status}
              /> : null
        }
      </Layout>
    )
  }
}

Icon.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Icon))
