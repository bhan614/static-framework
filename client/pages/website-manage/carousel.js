import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import websiteManageActions from './action'
import contentManageActions from '../content-manage/action'
import CarouselCard from './carouselCard'
import CarouselDetail from './carouselDetail'
import '../../styles/common.less';

const FormItem = Form.Item
const { Content } = Layout;
const { Option } = Select;
const confirm = Modal.confirm;

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      detailModalVisible: false,
      editId: -1,
      cityCode: 110000,
      title: '',
      flag: '',
      business: ''
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleDedailModalChange = this.handleDedailModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize, cityCode } = this.state;
    const { appActions, websiteManageActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        websiteManageActions.getCarouselList({
          pageNum,
          pageSize,
          cityCode
        }),
        this.props.websiteManageActions.getBannerNumber(),
        this.props.contentManageActions.getCityAddedSelectList({flag: 1}),
        this.props.contentManageActions.getBusinessSelectList()
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

  handleChangeState(id, status, code) {
    return () => {
      const { appActions, websiteManageActions, websiteManage } = this.props;
      const { pageSize, pageNum, cityCode, title, flag, business } = this.state;
      const changedStatus = this.getChangedStatus(status);
      const statusValue = this.getStatusValue(status);
      const bannerSort = websiteManage && websiteManage.get('bannerSort') && websiteManage.get('bannerSort');
      confirm({
        title: `确定更改该条轮播图的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return websiteManageActions.changeCarouselState({
              id,
              flag: changedStatus,
              weight: status === 0 ? bannerSort.get('0') + 1 : null,
              cityCode: code
            })
            .then(() => {
              return Promise.all([
                websiteManageActions.getCarouselList({
                  pageNum,
                  pageSize,
                  cityCode,
                  title,
                  flag,
                  business
                 }),
                websiteManageActions.getBannerNumber()
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
    const { appActions, websiteManageActions, form, websiteManage, contentManage } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if ( !err ) {
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        const businessList = contentManage.get('businessSelectList') && contentManage.get('businessSelectList') || [];
        if (values.cityName && values.cityName === '') {
          values.cityCode = ''
        } else if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        //业务线
        if (values.business && values.business === '') {
          values.businessId = ''
        } else if (values.business) {
          const selectBusiness = businessList.filter(v => v.business === values.business).get('0');
          values.businessId = selectBusiness.businessId;
        }
        appActions.loading(true).then(() => {
          return Promise.all([
            websiteManageActions.getCarouselList({
              pageNum: 1,
              pageSize,
              ...values
            }),
            this.props.websiteManageActions.getBannerNumber()
          ])
        }).then((data) => {
          this.setState({
            pageNum: data[0].data.currentPage,
            cityCode: values.cityCode,
            title: values.title,
            flag: values.flag,
            business: values.business
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
    const { cityCode, flag, title, business } = this.state;
    const { appActions, websiteManageActions } = this.props;
    appActions.loading(true).then(() => {
      return websiteManageActions.getCarouselList({
        pageNum: page,
        pageSize,
        cityCode,
        flag,
        title,
        business
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
    return () => document.getElementById('banner-area')
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { websiteManage, contentManage } = this.props;
    const carouselList = websiteManage.get('carouselList') && websiteManage.get('carouselList');
    const list = carouselList && carouselList.get('list') && carouselList.get('list');
    const total = carouselList && carouselList.get('totalCount') && carouselList.get('totalCount') || 0;
    const current = carouselList && carouselList.get('currentPage') && carouselList.get('currentPage');
    const editData = carouselList && list.find(v => v.id === this.state.editId);
    const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
    const businessList = contentManage.get('businessSelectList') && contentManage.get('businessSelectList') || [];
    let firstCity = '';
    if (cityList && cityList.size > 0) {
      firstCity = '北京'
    }
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 120
    }, {
      title: '图片预览',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      width: 120,
      render: (iconUrl) => {
        return <img src={iconUrl} width='100' height='50' />
      }
    }, {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
    }, {
      title: '业务线',
      dataIndex: 'business',
      key: 'business',
      width: 100,
      render: (business) => {
        if (business) {
          return <span>{business}</span>
        }
        return '---'
      }
    }, {
      title: '排序',
      dataIndex: 'weight',
      key: 'weight',
      width: 70,
      render: (weight, data) => {
        if (data.flag === 0) {
          return <span style={{marginLeft: '8px'}}>---</span>
        }
        if (weight) {
          return <span style={{marginLeft: '8px'}}>{weight}</span>
        }
      }
    }, {
      title: '状态',
      dataIndex: 'flag',
      key: 'flag',
      width: 70,
      render: (flag) => {
        if (flag === 1) {
          return <span>生效</span>
        }
        if (flag === 0) {
          return <span>未生效</span>
        }
      }
    }, {
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 70,
      render: (createTime) => {
        return (
          <span>{formatDate({time: createTime, showYear: true, showHms: false})}</span>
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
      width: 120,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleView(data.id)}>查看</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleChangeState(data.id, data.flag, data.cityCode)}>更改状态</a>
        </span>)
     }
    }];

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
    return (
      <Layout className='content-common' id="banner-area" >
        {
          this.renderTitle()
        }
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'轮播图标题'}>
                {getFieldDecorator('title')(
                  <Input placeholder="请输入banner标题" />
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
              <FormItem {...formItemLayout} label='业务线'>
                { getFieldDecorator( 'business', {initialValue: this.state.business})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option key='全部' value=''>全部</Option>
                    {
                      businessList.map((v, k) => (
                        <Option key={v.business} value={v.business}>{v.business}</Option>
                      ))
                    }
                  </Select>
                ) }
              </FormItem>
            </Col>
            <Col span={6}>
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
            <CarouselCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              cityCode={this.state.cityCode}
              title={this.state.title}
              flag={this.state.flag}
              business={this.state.business}
              /> : null
        }
        {
          this.state.detailModalVisible ?
            <CarouselDetail
              modalVisible={this.state.detailModalVisible}
              modalChange={this.handleDedailModalChange}
              editData={editData}
              /> : null
        }
      </Layout>
    )
  }
}

Carousel.propTypes = {
  form: PropTypes.object,
  websiteManage: PropTypes.object,
  contentManage: PropTypes.object,
  websiteManageActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  appActions: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const websiteManage = state.get( 'websiteManage' );
  const contentManage = state.get( 'contentManage' );
  return {
    websiteManage,
    contentManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    websiteManageActions: bindActionCreators(websiteManageActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Carousel))
