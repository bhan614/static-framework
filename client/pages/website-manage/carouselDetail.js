import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Layout, Row, Col } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import websiteManageActions from './action'
import { formatDate } from '../../utils/perfect';
import '../content-manage/detail.less'

class CarouselDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleCancel = this.handleCancel.bind(this);
    this.renderFlag = this.renderFlag.bind(this);
  }


  handleCancel() {
    this.props.modalChange();
  }

  renderFlag() {
    const { editData } = this.props;
    const flag = editData && editData.flag && editData.flag;
    if (flag === 1) {
      return <span>生效</span>
    }
    if (flag === 0) {
      return <span>未生效</span>
    }
    return '';
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editData } = this.props;
    return (
      <Modal
        title={'轮播图详情'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <div className="detail-container">
          <Row>
            <Col span={4}></Col>
            <Col span={4}>适用城市:</Col>
            <Col span={16}>{editData && editData.cityName && editData.cityName}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>业务线:</Col>
            <Col span={16}>{editData && editData.business && editData.business}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>标题:</Col>
            <Col span={16}>{editData && editData.title && editData.title}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>PC轮播图:</Col>
            <Col span={16}>
              <img src={editData && editData.iconUrl && editData.iconUrl} height='120' style={{ maxWidth: '300px' }} />
            </Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>移动端轮播图:</Col>
            <Col span={16}>
              <img src={editData && editData.appiconurl && editData.appiconurl} height='120' style={{ maxWidth: '300px' }} />
            </Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>跳转链接:</Col>
            <Col span={16}>{editData && editData.url && editData.url}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>排序:</Col>
            <Col span={16}>{editData && editData.weight && editData.weight}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>状态:</Col>
            <Col span={16}>{this.renderFlag()}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>创建时间:</Col>
            <Col span={6}>{formatDate({time: editData && editData.createTime && editData.createTime, showYear: true, showHms: false})}</Col>
            <Col span={3}>创建人:</Col>
            <Col span={7}>{editData && editData.createName && editData.createName}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>修改时间:</Col>
            <Col span={6}>{formatDate({time: editData && editData.updateTime && editData.updateTime, showYear: true, showHms: false})}</Col>
            <Col span={3}>修改人:</Col>
            <Col span={7}>{editData && editData.updateName && editData.updateName}</Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

CarouselDetail.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  editData: PropTypes.object,
  modalChange: PropTypes.func
}

const mapStateToProps = ( state, ownProps ) => {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( CarouselDetail ))
