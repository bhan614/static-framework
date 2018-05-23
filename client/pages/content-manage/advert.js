import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import AdvertCard from './advertCard'
import AdvertDetail from './advertDetail'

import '../../styles/common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class Advert extends Component {
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
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handleDedailModalChange = this.handleDedailModalChange.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getAdvertList({
        pageNum,
        pageSize
      }).then((data) => {
        this.setState({
          pageNum: data.data.currentPage
        })
        appActions.loading(false)
      }).catch(err => {
        appActions.loading(false)
        message.error(err.msg);
      })
    })
  }

  renderTitle(total = '') {
    return () => (
      <Row type="flex" align="middle">
        <Col span={4}>共搜索到{total}条数据</Col>
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

  handleDedailModalChange() {
    this.setState({detailModalVisible: false})
  }

  handleDelete(id) {
    return () => {
      const { appActions, contentManageActions } = this.props;
      const { pageSize } = this.state;
      confirm({
        title: '确定删除该条广告图？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.deleteAdvert({
              id
            });
          }).then(() => {
            return contentManageActions.getAdvertList({
              pageNum: 1,
              pageSize
            })
          }).then(() => {
            message.success('删除成功');
            appActions.loading(false);
          }).catch(() => {
            appActions.loading(false);
            message.error('删除失败');
          })
        }
      });
    }
  }

  getChangedStatus(flag) {
    if (flag === 0) {
      return '1';
    }
    return '0';
  }

  handleChangeState(id, flag, cityCode) {
    return () => {
      const { appActions, contentManageActions, contentManage } = this.props;
      const { pageSize, pageNum } = this.state;
      const changedStatus = this.getChangedStatus(flag);
      confirm({
        title: '确定更改该条广告图状态？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeAdvertState({
              id,
              flag: changedStatus,
              cityCode
            });
          }).then(() => {
            return contentManageActions.getAdvertList({
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
        }
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const advertList = contentManage.get('advertList') && contentManage.get('advertList');
    const list = advertList && advertList.get('list') && advertList.get('list');
    const total = advertList && advertList.get('totalCount') && advertList.get('totalCount');
    const current = advertList && advertList.get('currentPage') && advertList.get('currentPage');
    const editData = advertList && list.find(v => v.id === this.state.editId);
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
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
    }, {
      title: '图片预览',
      dataIndex: 'iconurl',
      key: 'iconurl',
      width: 100,
      render: (iconurl, data) => {
        if (data.type === 0) {
          return <img src={iconurl} width='100' height='50' />
        }
        return '---'
      }
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type, data) => {
        if (type === 0) {
          return <span style={{marginLeft: '8px'}}>静态图片</span>
        }
        if (type === 1) {
          return <span style={{marginLeft: '8px'}}>动画视频</span>
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
      width: 100,
      render: (createTime) => {
        return (
          <span>{formatDate({time: createTime, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '操作人',
      dataIndex: 'createname',
      key: 'createname',
      width: 80
    }, {
      title: '操作',
      key: 'action',
      width: 150,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleView(data.id)}>查看</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleChangeState(data.id, data.flag, data.cityCode)}>更改状态</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleDelete(data.id)}>删除</a>
        </span>)
     }
    }];
    const pagination = {
      current,
      total,
      pageSize,
      showSizeChanger: false,
      //showQuickJumper: true,
      onChange: ( page, pageSize ) => {
        const { appActions, contentManageActions } = this.props;
        appActions.loading(true).then(() => {
          return contentManageActions.getAdvertList({
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
    }
    return (
      <Layout className='content-common' >
        <Content className='table-content-wrap' >
          <Table columns={columns} dataSource={list} pagination={pagination} title={this.renderTitle(total)} rowKey={this.renderRowKey} />
        </Content>
        {
          this.state.modalVisible ?
            <AdvertCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              /> : null
        }
        {
          this.state.detailModalVisible ?
            <AdvertDetail
              modalVisible={this.state.detailModalVisible}
              modalChange={this.handleDedailModalChange}
              editData={editData}
              /> : null
        }
      </Layout>
    )
  }
}

Advert.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Advert))
