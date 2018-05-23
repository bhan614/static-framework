import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Icon, Button, Select, Radio} from 'antd'

const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const { TextArea } = Input
const RadioGroup = Radio.Group
const cityMap = [{id: 1, name: '北京' }, {id: 2, name: '上海' }, {id: 3, name: '成都' }, 
                 {id: 4, name: '重庆' }, {id: 5, name: '深圳' }, 
                 {id: 6, name: '厦门' }, {id: 7, name: '广州' },
                 {id: 8, name: '武汉'}, {id: 9, name: '长沙'}, {id: 10, name: '西安'}, 
                 {id: 11, name: '合肥'}, {id: 12, name: '天津'}, {id: 13, name: '燕郊' }, 
                 {id: 14, name: '青岛' }, {id: 15, name: '济南' }, {id: 16, name: '沈阳'},
                 {id: 17, name: '大连' }, {id: 18, name: '杭州' }, {id: 19, name: '无锡' }, 
                 {id: 20, name: '南京' }]
const recruitMap = [{id: 1, name: '社会招聘'}, {id: 2, name: '校园招聘'}]

export class RecruitForm extends Component {
    static propTypes = {
        formValues: PropTypes.object,
        formType: PropTypes.string,
        form: PropTypes.object,
        handleHide: PropTypes.func,
        handleOK: PropTypes.func,
        jobNameList: PropTypes.array
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
    handleFormOk = (e) => {
        e.preventDefault()
        const {formValues, form} = this.props
        //const fields = this.props.form.getFieldsValue()
        form.validateFields((err, values) => {
          //console.log(values)
           if (!err) {
            Object.keys(values).forEach((key) => {
               const v = values[key];
               if (typeof v !== 'object') {
                 values[key] = values[key] && String(values[key]).trim()
               }
            })
            this.props.handleOK({...formValues, ...values})
          }
        })
    }

    renderOptions = (alllist) => {
        //const {alllist} = this.props
        return (alllist || []).map(item => {
            return <Option key={item.id} value={item.name}>{item.name}</Option>
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {formValues, formType, jobNameList} = this.props
        const title = formType === 'add' ? '添加招聘信息' : '编辑招聘信息'
        const visible = true

        return (
          <div>
            <Modal closable={false}
                     title={title}
                     visible={visible}
                     //onOk={this.handleFormOk}
                     onCancel={this.handleFormCancel}
                     footer={null}>
              <Form layout='horizontal' onSubmit={this.handleFormOk} className='form1'>
                <FormItem
                      label='岗位名称'
                      hasFeedback
                >
                  {getFieldDecorator('recruitName', {
                      initialValue: formValues && formValues.recruitName || '',
                      rules: [{
                          required: true, message: '岗位名称不能为空'
                      }]
                  })(
                    <Input placeholder='请输入'/>
                  )}
                </FormItem>
                <FormItem
                      label='招聘类别'
                      hasFeedback
                >
                  {getFieldDecorator('recruitType', {
                      initialValue: formValues && formValues.recruitType === '社会招聘' ? '社会招聘' : '校园招聘' || '',
                      rules: [{
                          required: true, message: '招聘类别不能为空'
                      }]
                  })(
                    <RadioGroup onChange={this.onChange} >
                      <Radio key="a" value={'社会招聘'}>社会招聘</Radio>
                      <Radio key="b" value={'校园招聘'}>校园招聘</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                      label='岗位类别'
                >
                  {getFieldDecorator('jobType', {
                    initialValue: formValues && formValues.jobName || [],
                    rules: [{
                        required: true, message: '岗位类别不能为空'
                    }]
                  })(
                    <Select
                      //mode="multiple"
                      style={{width: '100%'}}
                      placeholder='请选择类别'
                      //onChange={this.handleChange}
                    >
                      {this.renderOptions(jobNameList)}
                    </Select>

                  )}
                </FormItem>
                <FormItem
                      label='岗位地点'
                >
                  {getFieldDecorator('cityName', {
                    initialValue: formValues && formValues.cityName || [],
                    rules: [{
                        required: true, message: '岗位地点不能为空'
                    }]
                  })(
                    <Select
                      //mode="multiple"
                      style={{width: '100%'}}
                      placeholder='请选择城市'
                      //onChange={this.handleChange}
                    >
                      {this.renderOptions(cityMap)}
                    </Select>

                  )}
                </FormItem>
                <FormItem
                      label='岗位职责'
                      hasFeedback
                >
                  {getFieldDecorator('duty', {
                      initialValue: formValues && formValues.duty || '',
                      rules: [{
                          required: true, message: '岗位职责不能为空'
                      }]
                  })(
                    <TextArea  placeholder='岗位职责不能少于五个字符' rows={6}/>
                  )}
                </FormItem>
                <FormItem
                      label='任职要求'
                      hasFeedback
                >
                  {getFieldDecorator('require', {
                      initialValue: formValues && formValues.require || '',
                      rules: [{
                          required: true, message: '任职要求不能为空'
                      }]
                  })(
                    <TextArea  placeholder='任职要求不能少于五个字符' rows={6}/>
                  )}
                </FormItem>
                <FormItem
                      label='招聘状态'
                      hasFeedback
                >
                  {getFieldDecorator('flag', {
                      initialValue: formValues && formValues.flag === 0 ? 0 : 1 || '',
                      rules: [{
                          required: true, message: '招聘状态不能为空'
                      }]
                  })(
                    <RadioGroup >
                      <Radio key="a" value={1}>生效</Radio>
                      <Radio key="b" value={0}>未生效</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem wrapperCol={{ span: 16, offset: 16 }}>
                  <Button type='primary' size='default' htmlType='submit' className='btn1 btn-search' >确定</Button>
                  <Button type='primary' size='default' htmlType='reset' onClick={this.handleFormCancel}>取消</Button>
                </FormItem>
              </Form> 
            </Modal>
          </div>
        )
    }
}
export default createForm()(RecruitForm)

