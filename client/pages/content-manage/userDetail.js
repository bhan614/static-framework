import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Layout, Row, Col } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import contentManageActions from './action'
import { formatDate } from '../../utils/perfect';
import './detail.less'

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleCancel = this.handleCancel.bind(this);
    this.renderIsUpload = this.renderIsUpload.bind(this);
    this.renderAuthStatus = this.renderAuthStatus.bind(this);
    this.renderOrigin = this.renderOrigin.bind(this);
  }


  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  renderIsUpload() {
    const { editData } = this.props;
    const idCard = editData && editData.idCardPic1Url && editData.idCardPic1Url;
    if (idCard && idCard.length > 0) {
      return <span>是</span>
    }
    return <span>否</span>;
  }

  renderAuthStatus() {
    const { editData } = this.props;
    const isReal = editData && editData.isReal && editData.isReal;
    if (isReal === 1) {
      return <span>已实名</span>
    }
    if (isReal === 0) {
      return <span>未实名</span>
    }
    return '';
  }

  renderOrigin() {
    const { editData } = this.props;
    const source = editData && editData.source && editData.source;
    if (source === 1) {
      return <span>Android</span>
    }
    if (source === 2) {
      return <span>IOS</span>
    }
    if (source === 3) {
      return <span>微信</span>
    }
    if (source === 4) {
      return <span>其他</span>
    }
    return <span>其他</span>
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editData } = this.props;
    return (
      <Modal
        title={'用户详情'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <div className="detail-container">
          <Row>
            <Col span={4}></Col>
            <Col span={6}>姓名:</Col>
            <Col span={14}>{editData && editData.name && editData.name}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>手机号:</Col>
            <Col span={14}>{editData && editData.phone && editData.phone}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>来源:</Col>
            <Col span={14}>{this.renderOrigin()}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>实名状态:</Col>
            <Col span={14}>{this.renderAuthStatus()}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>身份证号:</Col>
            <Col span={14}>{editData && editData.idCard && editData.idCard || '无'}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>会员等级:</Col>
            <Col span={14}>{editData && editData.level && `LV${editData.level}`}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>注册时间:</Col>
            <Col span={14}>{formatDate({time: editData && editData.createTime && editData.createTime, showYear: true, showHms: false})}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>是否上传身份证:</Col>
            <Col span={14}>{this.renderIsUpload()}</Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

UserDetail.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  editData: PropTypes.object,
  modalChange: PropTypes.func
}

const mapStateToProps = ( state, ownProps ) => {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( UserDetail ))
