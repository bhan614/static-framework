import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Layout, Row, Col } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import contentManageActions from '../content-manage/action'
import { formatDate } from '../../utils/perfect';
import '../content-manage/detail.less'

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleCancel = this.handleCancel.bind(this);
    this.renderHotStatus = this.renderHotStatus.bind(this);
    this.renderFlag = this.renderFlag.bind(this);
  }


  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  renderHotStatus() {
    const { editData } = this.props;
    const flag = editData && editData.flag && editData.flag;
    if (flag === 1) {
      return <span>是</span>
    }
    if (flag === 0) {
      return <span>否</span>
    }
    return '';
  }

  renderFlag() {
    const { editData } = this.props;
    const status = editData && editData.status && editData.status;
    if (status === 1) {
      return <span>生效</span>
    }
    if (status === 0) {
      return <span>未生效</span>
    }
    return '';
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editData } = this.props;
    return (
      <Modal
        title={'产品详情'}
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
            <Col span={4}>费率:</Col>
            <Col span={16}>{editData && editData.rate && editData.rate}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>费率形式:</Col>
            <Col span={16}>{editData && editData.ratestips && editData.ratestips}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>额度费用文案:</Col>
            <Col span={16}>{editData && editData.quotaCosts && editData.quotaCosts}</Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={4}>额度费用例如:</Col>
            <Col span={16}>{editData && editData.example && editData.example}</Col>
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

ProductDetail.propTypes = {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( ProductDetail ))
