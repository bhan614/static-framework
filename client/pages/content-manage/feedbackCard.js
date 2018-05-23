import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import contentManageActions from './action'
import { feedbackData } from './dataConfig'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class FeedbackCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, type, resulttype} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        this.setState({disabled: true});
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        appActions.loading(true).then(() => {
          return contentManageActions.addFeedback({
            id,
            ...values
          })
          .then(() => {
            appActions.loading(false);
            this.setState({disabled: false});
            message.success('添加成功')
            this.handleCancel();
          }).catch(err => {
            appActions.loading(false);
            this.setState({disabled: false});
            message.error(err.msg)
          })
        }).then(() => {
          return contentManageActions.getFeedbackList({
            pageNum,
            pageSize,
            type,
            resulttype
          })
        })
      }
    })
  }

  afterSubmit() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  checkResult(rule, value, callback) {
    if (value === '') {
      callback('请输入备注');
      return;
    }
    if (value.length > 200) {
      callback('超过200个字');
      return;
    }
    callback();
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

    return (
      <Modal
        title={'处理反馈'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'resulttype', {
            rules: [{ required: true, message: '请选择类型' }],
            initialValue: editData && editData.resulttype !== 1 ? editData.resulttype.toString() : '2'
          } )(
            <RadioGroup>
              {
                feedbackData.map(v => {
                  if (v.type !== '1') {
                    return <Radio key={v.type} value={v.type}>{v.name}</Radio>
                  }
                  return null
                })
              }
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='备注'
          >
            { getFieldDecorator( 'result', {
            rules: [{ required: true, validator: this.checkResult }],
            initialValue: editData ? editData.result : ''
          } )(
            <Input type="textarea" rows={4} placeholder='请备注处理结果, 不超过200字' />
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

FeedbackCard.propTypes = {
  appActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  contentManage: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number,
  type: PropTypes.string,
  resulttype: PropTypes.string
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( FeedbackCard ))
