import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Icon, Button, Select, Radio, message} from 'antd'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '../../styles/common.less'

import {EditorState, convertToRaw, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

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

    constructor(props) {
        super(props)
        const formValues = props.formValues
        this.state = {}
        const dutyHtml = (formValues && formValues.duty) ? formValues.duty : ''
        const requireHtml = formValues && formValues.require ? formValues.require : ''
        const dutyContentBlock = htmlToDraft(dutyHtml)
        const requireContentBlock = htmlToDraft(requireHtml)
        if (dutyContentBlock) {
            const contentState = ContentState.createFromBlockArray(dutyContentBlock.contentBlocks)
            const dutyEditorState = EditorState.createWithContent(contentState)
            this.state.dutyEditorState = dutyEditorState
        }
        if (requireContentBlock) {
            const contentState = ContentState.createFromBlockArray(requireContentBlock.contentBlocks)
            const requireEditorState = EditorState.createWithContent(contentState)
            this.state.requireEditorState = requireEditorState
        }
        //this.state.imgUrl = imgUrl || ''
    }

    componentWillReceiveProps (props) {
        if ( props.formValues && this.props.formValues.id !== props.formValues.id ) {
            const dutyHtml = (props.formValues && props.formValues.duty) ? props.formValues.duty : ''
            const requireHtml = props.formValues && props.formValues.require ? props.formValues.require : ''
            const dutyContentBlock = htmlToDraft(dutyHtml)
            const requireContentBlock = htmlToDraft(requireHtml)
            if (dutyContentBlock) {
                const contentState = ContentState.createFromBlockArray(dutyContentBlock.contentBlocks)
                const dutyEditorState = EditorState.createWithContent(contentState)
                this.setState({
                    dutyEditorState
                })
            }
            if (requireContentBlock) {
                const contentState = ContentState.createFromBlockArray(requireContentBlock.contentBlocks)
                const requireEditorState = EditorState.createWithContent(contentState)
                this.setState({
                    requireEditorState
                })
            }
        }
    }

    onDutyEditorStateChange = (dutyEditorState) => {
        this.setState({
            dutyEditorState
        })
     }  

     onRequireEditorStateChange = (requireEditorState) => {
        this.setState({
            requireEditorState
        })
     }  

     /**
     * 弹层点击取消操作
     */
    handleFormCancel = () => {
        this.props.handleHide()
    }

    /**
     * 去除html标签
     */
    delHtmlTag = (str) => {
        return str.replace(/<[^>]+>/g, '');//去掉所有的html标记
       }

    /**
     * 弹层点击确定操作
     */
    handleFormOk = (e) => {
        e.preventDefault()
        const {formValues, form} = this.props
        const fields = form.getFieldsValue()
        const duty = convertToRaw(this.state.dutyEditorState.getCurrentContent()) || ''
        const require = convertToRaw(this.state.requireEditorState.getCurrentContent()) || ''
        fields.duty = draftToHtml(duty)
        fields.require = draftToHtml(require)
        if (this.delHtmlTag(fields.duty).length !== 1 && this.delHtmlTag(fields.require).length !== 1) {
            form.validateFields((err) => {
                //console.log(values)
                 if (!err) {
                  Object.keys(fields).forEach((key) => {
                     const v = fields[key];
                     if (typeof v !== 'object') {
                       fields[key] = fields[key] && String(fields[key]).trim()
                     }
                  })
                  this.props.handleOK({...formValues, ...fields})
                }
              })
        } else {
            message.error('岗位职责和任职要求不能为空')
        }  
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
        const {dutyEditorState, requireEditorState} = this.state

        return (
          <div>
            <Modal closable={false}
                     title={title}
                     visible={visible}
                     //onOk={this.handleFormOk}
                     onCancel={this.handleFormCancel}
                     footer={null}>
              <Form layout='horizontal' onSubmit={this.handleFormOk}>
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
                  <Editor 
                      editorState={dutyEditorState}
                      wrapperClassname='demo-wrapper'
                      editorClassName='demo-editor'
                      toolbar={{
                          options: []
                      }}
                      localization={{
                          locale: 'zh'
                      }}
                        onEditorStateChange={this.onDutyEditorStateChange}
                     />
                </FormItem>
                <FormItem 
                    label='任职要求'
                >
                  <Editor 
                      editorState={requireEditorState}
                      wrapperClassname='demo-wrapper'
                      editorClassName='demo-editor'
                      toolbar={{
                            options: []
                      }}
                      localization={{
                            locale: 'zh'
                         }}
                        onEditorStateChange={this.onRequireEditorStateChange}
                  />
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
                <FormItem wrapperCol={{ span: 15, offset: 15 }}>
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

