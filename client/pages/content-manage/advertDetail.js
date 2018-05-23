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

class AdvertDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleCancel = this.handleCancel.bind(this);
    this.renderType = this.renderType.bind(this);
    this.renderFlag = this.renderFlag.bind(this);
  }


  handleCancel() {
    this.props.modalChange();
  }

  renderType() {
    const { editData } = this.props;
    const type = editData && editData.type && editData.type;
    if (type === 1) {
      return <span>动画视频</span>
    }
    if (type === 0) {
      return <span>静态图片</span>
    }
    return '';
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
        title={'闪屏图详情'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <div className="detail-container">
          <Row>
            <Col span={4}></Col>
            <Col span={4}>城市:</Col>
            <Col span={16}>{editData && editData.cityName && editData.cityName}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>广告说明:</Col>
            <Col span={16}>{editData && editData.name && editData.name}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>类型:</Col>
            <Col span={16}>{this.renderType()}</Col>
          </Row>
          {
            editData && editData.type && editData.type === 1 ? null :
            <div>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>广告图(普通机型):</Col>
                <Col span={16}>
                  <img src={editData && editData.iconurl && editData.iconurl} height='120' />
                </Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>广告图(适配安卓宽屏):</Col>
                <Col span={16}>
                  <img src={editData && editData.bigIconurl && editData.bigIconurl} height='120' />
                </Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>广告图(适配iPhoneX):</Col>
                <Col span={16}>
                  <img src={editData && editData.wideIconurl && editData.wideIconurl} height='120' />
                </Col>
              </Row>
            </div>
          }
          <Row>
            <Col span={4}></Col>
            <Col span={4}>跳转链接:</Col>
            <Col span={16}>{editData && editData.url && editData.url || '---'}</Col>
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
            <Col span={7}>{editData && editData.createname && editData.createname}</Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

AdvertDetail.propTypes = {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( AdvertDetail ))
