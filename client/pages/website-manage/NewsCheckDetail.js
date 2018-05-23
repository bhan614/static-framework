import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Icon, Button, Select, Radio, Upload} from 'antd'

const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const { TextArea } = Input
const RadioGroup = Radio.Group

export class NewsCheckDetail extends Component {
    static propTypes = {
        formValues: PropTypes.object,
        form: PropTypes.object,
        handleHide: PropTypes.func
    }

     /**
     * 弹层点击取消操作
     */
    handleFormCancel = () => {
        this.props.handleHide()
    }

    /**
     * 弹层点击确定操作
     */
    handleFormOk = () => {
        this.props.handleHide()
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const {formValues} = this.props
        const title = '查看新闻资讯'
        const visible = true
        //console.log(formValues)

        return (
          <div>
            <Modal closable={false}
                     title={title}
                     visible={visible}
                    //  onOk={this.handleFormOk}
                    //  onCancel={this.handleFormCancel}
                    footer={<Button type='primary' size='default' onClick={this.handleFormOk} >确定</Button>}
                    >
              <Form layout='horizontal' onSubmit={this.handleSubmit}>
                <FormItem
                      label='资讯标题'
                      hasFeedback
                >
                  {getFieldDecorator('title', {
                    initialValue: formValues && formValues.title || '',
                      rules: [{
                          required: true, message: '资讯标题不能为空'
                      }]
                  })(
                    <Input disabled/>
                  )}
                </FormItem>
                <FormItem
                      label='资讯类别'
                      hasFeedback
                >
                  {getFieldDecorator('type', {
                    initialValue: formValues && formValues.type === '公司动态' ? '公司动态' : '人物专访' || '',
                      rules: [{
                          required: true, message: '招聘类别不能为空',
                      }]
                  })(
                    <RadioGroup onChange={this.onChange} disabled>
                      <Radio key="a" value={'公司动态'}>公司动态</Radio>
                      <Radio key="b" value={'人物专访'}>人物专访</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                      label='消息来源'
                      hasFeedback
                >
                  {getFieldDecorator('source', {
                    initialValue: formValues && formValues.source || '',
                    rules: [{
                        required: true, message: '消息来源不能为空'
                    }]
                  })(
                    <Input disabled/>
                  )}
                </FormItem>
                <FormItem
                      label='封面图片'
                      hasFeedback
                >
                  {getFieldDecorator('imgUrl', {
                    initialValue: formValues && formValues.imgUrl || '',
                    rules: [{
                        
                    }]
                  })(
                    <img src='imgUrl'/>

                  )}
                </FormItem>
                <FormItem
                      label='资讯正文'
                      hasFeedback
                >
                  {getFieldDecorator('content', {
                    initialValue: formValues && formValues.content || '',
                      rules: [{
                          required: true, message: '新闻内容不能为空'
                      }]
                  })(
                    <TextArea   disabled/>
              )}
                </FormItem>
                <FormItem
                      label='资讯状态'
                      hasFeedback
                >
                  {getFieldDecorator('flag', {
                    initialValue: formValues && formValues.flag === 0 ? 0 : 1 || '',
                      rules: [{
                          required: true, message: '资讯状态'
                      }]
                  })(
                    <RadioGroup disabled >
                      <Radio key="a" value={1}>生效</Radio>
                      <Radio key="b" value={0}>未生效</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Form>                 
            </Modal>
          </div>
        )
    }
}
export default createForm()(NewsCheckDetail)

