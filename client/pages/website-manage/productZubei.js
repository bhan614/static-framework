import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from '../content-manage/action'
import websiteManageActions from './action';
import ProductCard from './productZubeiCard'
import ProductDetail from './productZubeiDetail';
import '../../styles/common.less';

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      detailModalVisible: false,
      editId: -1,
      cityCode: '',
      status: ''
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleDetailModalChange = this.handleDetailModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize, cityCode } = this.state;
    const { appActions, contentManageActions, websiteManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        websiteManageActions.getZuBeiList({
          pageNum,
          pageSize,
          cityCode
        }),
        this.props.contentManageActions.getCityAddedSelectList({flag: 1})
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

  handleDetailModalChange() {
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

  handleChangeState(id, s, code) {
    return () => {
      const { appActions, contentManageActions, contentManage, websiteManage, websiteManageActions } = this.props;
      const { pageSize, pageNum, cityCode, status } = this.state;
      const changedStatus = this.getChangedStatus(s);
      const statusValue = this.getStatusValue(s);
      const productSort = websiteManage && websiteManage.get('productSort') && websiteManage.get('productSort');
      confirm({
        title: `确定更改该条产品的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return websiteManageActions.addZuBei({
              id,
              status: changedStatus,
              cityCode: code
            })
            .then(() => {
              return websiteManageActions.getZuBeiList({
                pageNum,
                pageSize,
                cityCode,
                status
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

  handleReset() {
    this.props.form.resetFields();
  }

  handleSearch(e) {
    e.preventDefault();
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions, form, contentManage, websiteManageActions, websiteManage } = this.props;
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
          return websiteManageActions.getZuBeiList({
            pageNum: 1,
            pageSize,
            ...values
          })
        }).then((data) => {
          this.setState({
            pageNum: data.data.currentPage,
            cityCode: values.cityCode,
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
    const { cityCode, status } = this.state;
    const { appActions, contentManageActions, websiteManageActions } = this.props;
    appActions.loading(true).then(() => {
      return websiteManageActions.getZuBeiList({
        pageNum: page,
        pageSize,
        cityCode,
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
    return () => document.getElementById('product-area')
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage, websiteManage } = this.props;
    const productList = websiteManage.get('zuBeiList') && websiteManage.get('zuBeiList');
    const list = productList && productList.get('list') && productList.get('list');
    const total = productList && productList.get('totalCount') && productList.get('totalCount') || 0;
    const current = productList && productList.get('currentPage') && productList.get('currentPage');
    const editData = productList && list.find(v => v.id === this.state.editId);
    const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
    const firstCity = '';
    // if (cityList && cityList.size > 0) {
    //   firstCity = '北京'
    // }
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '费率形式',
      dataIndex: 'ratestips',
      key: 'ratestips',
      width: 100
    }, {
      title: '费率(最低)',
      dataIndex: 'rate',
      key: 'rate',
      width: 100,
      render: (rate) => {
        return <span>{`${rate}/月`}</span>
      }
    }, {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
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
      width: 100,
      render: (createTime) => {
        return (
          <span>{formatDate({time: createTime, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleView(data.id)}>查看</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleChangeState(data.id, data.status, data.cityCode)}>更改状态</a>
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Layout className='content-common' id='product-area' >
        {
          this.renderTitle()
        }
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={80}>
            <Col span={8}>
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
            <Col span={8}>
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
          <Col span={2}></Col>
          <Col span={20} style={{textAlign: 'right'}}>
            <Pagination showQuickJumper current={current} total={total} pageSize={this.state.pageSize} onChange={this.handlePaginationChange} />
          </Col>
          <Col span={2}>
            <span>共有{total}条</span>
          </Col>
        </Row>
        {
          this.state.modalVisible ?
            <ProductCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              cityCode={this.state.cityCode}
              status={this.state.status}
              /> : null
        }
        {
          this.state.detailModalVisible ?
            <ProductDetail
              modalVisible={this.state.detailModalVisible}
              modalChange={this.handleDetailModalChange}
              editData={editData}
              /> : null
        }
      </Layout>
    )
  }
}

Product.propTypes = {
  form: PropTypes.object,
  contentManage: PropTypes.object,
  websiteManage: PropTypes.object,
  contentManageActions: PropTypes.object,
  websiteManageActions: PropTypes.object,
  appActions: PropTypes.object,
  router: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const contentManage = state.get( 'contentManage' );
  const websiteManage = state.get( 'websiteManage' );
  return {
    contentManage,
    websiteManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch),
    websiteManageActions: bindActionCreators(websiteManageActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Product))
