import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Icon, Button, Select, Radio, Upload, message} from 'antd'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {uploadData} from '../../utils/uploadData'

import {EditorState, convertToRaw, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import NewsUploadImg from './NewsUploadImg'

const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const { TextArea } = Input
const RadioGroup = Radio.Group

export class NewsForm extends Component {
    static propTypes = {
        formValues: PropTypes.object,
        formType: PropTypes.string,
        form: PropTypes.object,
        handleHide: PropTypes.func,
        handleOK: PropTypes.func,
        handleCheckModalShow: PropTypes.func
    }

    constructor(props) {
      super(props)
      const formValues = props.formValues
      this.state = {
        imgUrl: formValues && formValues.imgUrl || ''
    }
      const html = (formValues && formValues.content) ? formValues.content : ''
      //const imgUrl = formValues && formValues.imgUrl ? formValues.imgUrl : ''
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          const editorState = EditorState.createWithContent(contentState)
          this.state.editorState = editorState
      }
      //this.state.imgUrl = imgUrl || ''
  }

   componentWillReceiveProps (props) {
    if ( props.formValues && this.props.formValues.id !== props.formValues.id ) {
        const html = (props.formValues && props.formValues.content) ? props.formValues.content : ''
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            this.setState({
                editorState
            })
        }
    }
}

    onEditorStateChange = (editorState) => {
      console.log(editorState.toJS());
       this.setState({
           editorState
       })
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
        const {formType, form, formValues} = this.props
        const fields = form.getFieldsValue()
        const content = convertToRaw(this.state.editorState.getCurrentContent())
        console.log(this.state.editorState.getCurrentContent().toJS());
        fields.content = draftToHtml(content)
        fields.imgUrl = this.state.imgUrl
        if (this.delHtmlTag(fields.content).length !== 1 && fields.imgUrl !== '') {
          form.validateFields((err) => {
            if (!err) {
              Object.keys(fields).forEach((key) => {
                const v = fields[key]
                if (typeof v !== 'object') {
                  fields[key] = fields[key] && String(fields[key]).trim()
                }
             })
             this.props.handleOK({...formValues, ...fields})
            }
          })
        } else {
          message.error('封面图片或新闻内容不能为空')
        }
      }

    /**
     * 处理查看
     */

    handleCheck = () => {
        //console.log(111111)
        const {formType} = this.props
        const fields = this.props.form.getFieldsValue()
        //console.log(fields)
        if (fields.content && formType === 'add') {
          fields.content = fields.content.blocks[0].text
        }
        console.log(fields)
        this.handleFormCancel()
        this.props.handleCheckModalShow(fields)
     }

    renderOptions = (alllist) => {
        //const {alllist} = this.props
        return (alllist || []).map(item => {
            return <Option key={item.id} value={item.name}>{item.name}</Option>
        })
    }

    // /**
    //  * 处理图片上传
    //  */
    // uploadChange = (file, uploadingFalse) => {
    //   if (file.status === 'done') {
    //     const {data, code, msg} = file.response
    //     if (code === 200) {
    //       const imgUrl = data[0] && data[0].url
    //       message.success('图片上传成功！', 3)
    //       this.setState({imgUrl}, uploadingFalse)
    //       }
    //    }
    // }

    /**
     *
     * 图片上传之前的处理
     */
    beforeUpload(file) {
      const isJPEG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      let isJPG = false;
      const name = file.name;
      const jpgStr = name.slice(file.name.length - 4);
      if (jpgStr === '.jpg') {
        isJPG = true;
      }
      const isImage = isJPG || isPNG;

      if (!isImage) {
        message.error('只能上传jpg，png格式!');
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isImage && !isLt2M) {
        message.error('图片大小不能超过2MB!');
      }

      return isImage && isLt2M;
    }

    /**
     * 处理上传图片
     */

    handleChange = (info) => {
      if (info.file.status !== 'uploading') {
        console.log('uploading');
      }
      if (info.file.status === 'done') {
        const url = info.file.response.data.url.toString();
        //console.log(url)
        const name = info.file.response.data.originName;
        const imgWidth = info.file.response.data.width;
        const imgHeight = info.file.response.data.height;
        this.setState({
          imgUrl: url,
          imgHeight,
          imgWidth
        })
        message.success(`${info.file.name}上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name}上传失败`);
      }
    }

    /**
     * 检查图片
     */

    checkPic = (rule, value, callback) => {
      //const { editData } = this.props;
      const { iconUrl, imgWidth, imgHeight } = this.state;
      if (iconUrl === '') {
        callback('请上传图片');
        return;
      }
      if (imgWidth === '' && imgHeight === '') {
        callback('图片尺寸错误');
        return;
      }
      callback();
    }

    /**
     * 去除html标签
     */
    delHtmlTag = (str) => {
      return str.replace(/<[^>]+>/g, '');//去掉所有的html标记
     }


    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {formValues, formType} = this.props
        const title = formType === 'add' ? '添加新闻资讯' : '编辑新闻资讯'
        const visible = true
        const domain = window.INIT_DATA.domian
        const {editorState, imgUrl} = this.state
        function uploadImageCallBack(file) {
          return new Promise(
              (resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', uploadData.url);
                  const data = new FormData();
                  data.append('uploadFiles', file);
                  data.append('key', uploadData.key);
                  xhr.send(data);
                  xhr.addEventListener('load', () => {
                      const response = JSON.parse(xhr.responseText);
                      console.log(response)
                      if (response.code !== 1) {
                        reject(response)
                      } else {
                        console.log(response.data);
                        resolve({
                            data: {
                              alt: response.data.originName,
                              link: response.data.url
                            }
                        });
                      }
                  });
                  xhr.addEventListener('error', () => {
                      const error = JSON.parse(xhr.responseText);
                      reject(error);
                  });
              }
          );
      }

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
                      label='资讯标题'
                      hasFeedback
                >
                  {getFieldDecorator('title', {
                      initialValue: formValues && formValues.title || '',
                      rules: [{
                          required: true, message: '资讯标题不能为空'
                      }]
                  })(
                    <Input placeholder='文章标题小于30字'/>
                  )}
                </FormItem>
                <FormItem
                      label='资讯类别'
                      hasFeedback
                >
                  {getFieldDecorator('type', {
                      initialValue: formValues && formValues.type === '公司动态' ? '公司动态' : '人物专访' || '',
                      rules: [{
                          required: true, message: '资讯类别不能为空'
                      }]
                  })(
                    <RadioGroup onChange={this.onChange} >
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
                    <Input placeholder='请输入'/>
                  )}
                </FormItem>
                <FormItem
                      label='资讯简讯'
                      hasFeedback
                >
                  {getFieldDecorator('newsletter', {
                    initialValue: formValues && formValues.newsletter || '',
                    rules: [{
                        required: true, message: '资讯简讯不能为空'
                    }]
                  })(
                    <TextArea placeholder='请输入资讯简讯,不能超过多少个字'/>
                  )}
                </FormItem>
                <FormItem
                      label='封面图片'
                      extra="图片尺寸1920*457，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                  { getFieldDecorator( 'imgUrl', {
                       rules: [{ required: true, validator: this.checkPic }],
                  } )(
                    <Upload
                       className="avatar-uploader"
                       name="uploadFiles"
                       showUploadList={false}
                       action={uploadData.url}
                       data={{
                            key: uploadData.key
                       }}
                       beforeUpload={this.beforeUpload}
                       onChange={this.handleChange}
                     >
                      {
                         this.state.imgUrl ?
                           <img src={this.state.imgUrl} alt="" className="avatar" /> :
                           <Icon type="plus" className="avatar-uploader-trigger" />
                       }
                    </Upload>
                      ) }
                </FormItem>
                <Editor
                   editorState={editorState}
                   wrapperClassName="demo-wrapper"
                   editorClassName="demo-editor"
                   toolbar={{
                       options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image'],
                       image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } }
                   }}
                   localization={{
                       locale: 'zh',
                   }}
                   onEditorStateChange={this.onEditorStateChange}
               />
                <FormItem
                      label='资讯状态'
                      hasFeedback
                >
                  {getFieldDecorator('flag', {
                      initialValue: formValues && formValues.flag === 0 ? 0 : 1 || '',
                      rules: [{
                          required: true, message: '资讯状态不能为空'
                      }]
                  })(
                    <RadioGroup  >
                      <Radio key="a" value={1}>生效</Radio>
                      <Radio key="b" value={0}>未生效</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem wrapperCol={{ span: 16, offset: 16 }}>
                  {/* <Button type='primary' size='default' htmlType='reset' onClick={this.handleCheck} >预览</Button> */}
                  <Button type='primary' size='default' htmlType='submit' className='btn1 btn-search' >确定</Button>
                  <Button type='primary' size='default' onClick={this.handleFormCancel}>取消</Button>
                </FormItem>
              </Form>
            </Modal>
          </div>
        )
    }
}
export default createForm()(NewsForm)
