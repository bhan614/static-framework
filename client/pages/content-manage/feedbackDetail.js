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
import { feedbackTypeData } from './dataConfig';
import './detail.less'

class FeedbackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleCancel = this.handleCancel.bind(this);
    this.renderType = this.renderType.bind(this);
  }


  handleCancel() {
    this.props.modalChange();
  }

  renderType() {
    const { editData } = this.props;
    const type = editData && editData.type && editData.type;
    return feedbackTypeData.map(v => {
      if (type === Number(v.type)) {
        return v.name
      }
      return ''
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editData } = this.props;
    return (
      <Modal
        title={'反馈详情'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <div className="detail-container">
          <Row>
            <Col span={4}></Col>
            <Col span={4}>反馈用户:</Col>
            <Col span={16}>{editData && editData.phone && editData.phone}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>反馈时间:</Col>
            <Col span={16}>{formatDate({time: editData && editData.createTime && editData.createTime, showYear: true, showHms: false})}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>反馈类型:</Col>
            <Col span={16}>{this.renderType()}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>反馈内容:</Col>
            <Col span={12}>{editData && editData.content && editData.content}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>联系方式:</Col>
            <Col span={16}>{editData && editData.contactway  && editData.contactway}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>处理结果:</Col>
            <Col span={12}>{editData && editData.result  && editData.result}</Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

FeedbackDetail.propTypes = {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( FeedbackDetail ))
