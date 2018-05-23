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

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleCancel = this.handleCancel.bind(this);
  }


  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
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
            <Col span={6}>咨询板块:</Col>
            <Col span={14}>{editData && editData.productName && editData.productName}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={6}>咨询时间:</Col>
            <Col span={14}>{formatDate({time: editData && editData.createTime && editData.createTime, showYear: true, showHms: false})}</Col>
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( UserDetail ))
