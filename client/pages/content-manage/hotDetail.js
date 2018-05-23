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

class HotDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleCancel = this.handleCancel.bind(this);
    this.renderFlag = this.renderFlag.bind(this);
    this.renderType = this.renderType.bind(this);
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

  renderType() {
    const { editData } = this.props;
    const type = editData && editData.type && editData.type;
    if (type === 1) {
      return <span>编辑器</span>
    }
    if (type === 0) {
      return <span>H5链接</span>
    }
    return '';
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editData } = this.props;
    return (
      <Modal
        title={'热门推荐详情'}
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
            <Col span={4}>副标题:</Col>
            <Col span={16}>{editData && editData.subtitle && editData.subtitle}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>编辑方式:</Col>
            <Col span={16}>{this.renderType()}</Col>
          </Row>
          {
            editData && editData.type === 1 ?
              <Row>
                <Col span={4}></Col>
                <Col span={4}>来源:</Col>
                <Col span={16}>{editData && editData.source && editData.source}</Col>
              </Row> : null
          }
          <Row>
            <Col span={4}></Col>
            <Col span={4}>配图:</Col>
            <Col span={16}>
              <img src={editData && editData.imgUrl && editData.imgUrl} height='120' />
            </Col>
          </Row>
          {
            editData && editData.type === 0 ?
              <Row>
                <Col span={4}></Col>
                <Col span={4}>跳转链接:</Col>
                <Col span={16}>{editData && editData.hotUrl && editData.hotUrl}</Col>
              </Row> : null
          }
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
        </div>
      </Modal>
    )
  }
}

HotDetail.propTypes = {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( HotDetail ))
