import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import websiteManageActions from './action';
import contentManageActions from '../content-manage/action'
import '../content-manage/icon.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.editData && props.editData.status.toString() || '1',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkRemark = this.checkRemark.bind(this);
    this.checkRates = this.checkRates.bind(this);
  }

  componentDidMount() {
    this.props.contentManageActions.getCityAddedSelectList({flag: 1});
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, websiteManageActions, websiteManage, cityCode, status} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }

        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return websiteManageActions.addZuBei({
            id,
            ...values
          })
          .then(() => {
            return websiteManageActions.getZuBeiList({
              pageNum,
              pageSize,
              cityCode,
              status
            })
          }).then(() => {
            appActions.loading(false);
            this.setState({disabled: false});
            if (editData) {
              message.success('修改成功')
            } else {
              message.success('添加成功')
            }
            this.afterSubmit();
          }).catch(err => {
            appActions.loading(false);
            this.setState({disabled: false});
            message.error(err.msg);
          })
        })
      }
    })
  }

  afterSubmit() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  checkRateType(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入费率形式');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字');
      return;
    }
    callback();
  }

  checkName(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入产品名称');
      return;
    }
    if (value.length > 9) {
      callback('超过8个字');
      return;
    }
    callback();
  }

  checkRemark(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入介绍文案');
      return;
    }
    if (value.length > 12) {
      callback('超过12个字');
      return;
    }
    callback();
  }

  checkRates(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入费率');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字符');
      return;
    }
    callback();
  }

  checkRange(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入适用范围');
      return;
    }
    if (value.length > 12) {
      callback('超过12个字');
      return;
    }
    callback();
  }

  handleStateChange(e) {
    this.setState({ status: e.target.value })
  }

  getArea() {
    return () => document.getElementById('productCard-area')
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    }
    const { getFieldDecorator } = this.props.form;
    const { editData, contentManage } = this.props;
    const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
    let firstCity = '';
    if (cityList && cityList.size > 0) {
      firstCity = cityList.get('0').cityName
    }
    return (
      <Modal
        title={editData ? '编辑产品' : '新增产品'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id='productCard-area'>
          <FormItem
          {...formItemLayout}
          label='城市'
          >
            { getFieldDecorator( 'cityName', {
              rules: [{ required: true, message: '请选择城市' }],
              initialValue: editData && editData.cityName ? editData.cityName : firstCity
            } )(
              <Select disabled={editData || firstCity === ''} getPopupContainer={this.getArea()}>
                {
                  cityList.map((v, k) => (
                    <Option key={v.cityCode} value={v.cityName}>{v.cityName}</Option>
                  ))
                }
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='费率形式'
        >
            { getFieldDecorator( 'ratestips', {
            rules: [{ required: true, validator: this.checkRateType }],
            initialValue: editData ? editData.ratestips : ''
          } )(
            <Input placeholder="不超过6个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='费率'
        >
            { getFieldDecorator( 'rate', {
            rules: [{ required: true, validator: this.checkRates }],
            initialValue: editData ? editData.rate : ''
          } )(
            <Input placeholder="不超过6个字符" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='额度费用文案'
        >
            { getFieldDecorator( 'quotaCosts', {
            rules: [{ required: true, message: '请输入额度费用文案' }],
            initialValue: editData ? editData.quotaCosts : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='额度费用例如'
        >
            { getFieldDecorator( 'example', {
            rules: [{ required: true, message: '请输入额度费用例如' }],
            initialValue: editData ? editData.example : ''
          } )(
            <TextArea />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'status', {
            initialValue: editData ? editData.status.toString() : '1'
          } )(
            <RadioGroup onChange={this.handleStateChange}>
              <Radio value="1">生效</Radio>
              <Radio value="0">未生效</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
           {...tailFormItemLayout}
         >
            <Button style={{float: 'right'}} type='primary' size='default' htmlType='submit' disabled={this.state.disabled} >保存</Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ProductCard.propTypes = {
  appActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  contentManage: PropTypes.object,
  websiteManage: PropTypes.object,
  websiteManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number,
  cityCode: PropTypes.number,
  status: PropTypes.string
}

const mapStateToProps = ( state, ownProps ) => {
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
    websiteManageActions: bindActionCreators(websiteManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( ProductCard ))
