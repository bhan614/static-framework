import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Col, Checkbox, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import {formatDate} from '../../utils/perfect'

import appActions from '../app/action'
import websiteManageActions from './action'
import contentManageActions from '../content-manage/action'
import '../content-manage/noticeCard.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

let ck = null;
let instance = null;

class NewsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.formValues && props.formValues.imgUrl || '',
      imgWidth: '',
      imgHeight: '',
      editorContent: props.formValues && props.formValues.content || '',
      disabled: false,
      flag: props.formValues && props.formValues.flag.toString() || '1'
    }
    this.formHtml = props.formValues && props.formValues.content || null;
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadImg = this.handleUploadImg.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // 从 CDN 库加载CK
    //this.loadJs('//cdn.ckeditor.com/4.7.1/full/ckeditor.js');
    if (window.CKEDITOR) {
      this.onLoadEditor()
    }
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, websiteManageActions, formValues, formType, websiteManage, formData, pageSize, pageNum} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if (this.state.editorContent === '') {
        return;
      }
      if ( !err ) {
        const id = formValues ? formValues.id : null;   //id存在更新 不存在新增
        const content = instance.getData();

        values.imgUrl = this.state.imgUrl;
        values.content = content;
        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return websiteManageActions.postAddNews({
            id,
            ...values
          })
          .then(() => {
            websiteManageActions.getNewsList({...formData, pageSize, pageNum})
          }).then(() => {
            appActions.loading(false);
            this.setState({disabled: false});
            if (formType === 'edit') {
              message.success('修改成功')
            } else {
              message.success('添加成功')
            }
            this.afterSubmit();
          }).catch(err => {
            appActions.loading(false);
            this.setState({disabled: false});
            message.error(err.msg)
          })
        })
      }
    })
  }

  afterSubmit() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  checkTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入文章标题');
      return;
    }
    if (value.length > 30) {
      callback('超过30个字');
      return;
    }
    callback();
  }

  checkContent(rule, value, callback) {
    const content = instance.getData();
    if (content === '') {
      callback('请输入内容');
      return;
    }
    callback();
  }

  checkEditor(rule, value, callback) {
    callback();
  }

  /**
   *  加载 CK 完成后进行编辑器初始化
   */
  onLoadEditor = (e) => {
    ck = window.CKEDITOR;
    const ckOptions = {
      language: 'zh-cn',
      height: '13cm',
      width: '21cm',
      allowedContent: {
        $1: {
          elements: ck.dtd,
          attributes: true,
          styles: true,
          classes: true,
        },
      },
      disallowedContent: 'script; *[on*]',
      removePlugins: 'elementspath',
      toolbar: [
        { name: 'colors', items: ['TextColor'] },
        { name: 'style', items: ['FontSize'] },
        { name: 'basicstyles', items: ['Bold', 'Italic'] },
        { name: 'links', items: ['Link'] },
        { name: 'clipboard', items: ['PasteText', 'PasteFromWord'] },
        { name: 'insert', items: ['CodeSnippet'] },
        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'tools', items: [] }
      ],
      filebrowserUploadUrl: uploadData.url
    };

    // 给正文部分添加样式支持
    ck.addCss(`
      .pager { border: 1px solid #999; border-left: 0; border-right: 0; height: 1px; }
      .circlearea { border:2px dashed #108EE9; padding: 5px; }
      .cke_editable { margin: 0; padding: 0.5cm; }
    `);

    instance = ck.replace('editor', ckOptions);
    // 向编辑器赋值，如果有
    if (this.formHtml) {
      instance.setData(this.formHtml);
    }

    instance.on('change', (e) => {
      this.handleEditorChange(instance.getData());
    })
    instance.on('paste', (e) => {
      e.stop();
      const { contentManageActions } = this.props;
      const pasteData = e.data.dataTransfer._;
      if (e.data.dataValue && e.data.dataValue.length > 0) {
        //如果同时复制图片和文字
        const value = e.data.dataValue;
        if (value.indexOf('</img>') > 0) {
          message.error('请单独复制文字或图片');
          return false;
        }
        instance.insertHtml(e.data.dataValue);
      } else if (pasteData.files && pasteData.files.length > 0) {
        const formData = new FormData();
        formData.append('uploadFiles', pasteData.files[0]);
        formData.append('key', uploadData.key);
        contentManageActions.uploadFiles(formData).then(v => {
          instance.insertHtml(`<img src=${v.data.url} style="width: 100%; height: auto; display: block; margin: 0px auto;" />`)
        })
        .catch(() => {
          message.error('上传失败');
        })
      }
    })
  }

  handleEditorChange(v) {
    const { contentManageActions } = this.props;
    this.setState({
      editorContent: v
    })
  }

  loadJs(url) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = this.onLoadEditor;
    document.body.appendChild(script);
  }

  handleUploadImg(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      const url = info.file.response.data.url;
      const width = info.file.response.data.width;
      const height = info.file.response.data.height;
      console.log(info);
      this.setState({url});
      instance.insertHtml(`<img src=${url} style="width: 100%; height: auto; display: block; margin: 0px auto;" />`)
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }


  handleStateChange(e) {
    this.setState({ flag: e.target.value })
  }

  checkPic(rule, value, callback) {
    const { imgUrl, imgWidth, imgHeight } = this.state;
    if (imgUrl === '') {
      callback('请上传封面图像');
      return;
    }
    if ((imgWidth !== 560 || imgHeight !== 372) && (imgWidth !== '' && imgHeight !== '')) {
      callback('文章图像尺寸错误');
      return;
    }
    callback();
  }

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

  handleChange(info) {

    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const imgWidth = info.file.response.data.width;
      const imgHeight = info.file.response.data.height;
      this.setState({imgUrl: url, imgWidth, imgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  getArea() {
    return () => document.getElementById('noticeCard-area')
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 14 },
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
    const { formType, formValues, websiteManage } = this.props;

    return (
      <Modal
        title={formType === 'add' ? '新增新闻' : '编辑新闻'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        width={1060}
        footer={null}
        className="noticeCard"
      >
        <Form id="noticeCard-area" onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='标题'
        >
            { getFieldDecorator( 'title', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: formType === 'edit' ? formValues.title : ''
          } )(
            <Input placeholder="不超过30个字符" style={{ width: '85%', marginRight: '10px' }}/>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='资讯类别'
        >
            { getFieldDecorator( 'type', {
            initialValue: formType === 'edit' ? formValues.type : '公司动态'
          } )(
            <RadioGroup>
              <Radio value="人物专访">人物专访</Radio>
              <Radio value="公司动态">公司动态</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='消息来源'
        >
            { getFieldDecorator( 'source', {
            rules: [{ required: true, message: '请输入消息来源' }],
            initialValue: formType === 'edit' ? formValues.source : ''
          } )(
            <Input style={{ width: '85%', marginRight: '10px' }} />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='资讯简讯'
        >
            { getFieldDecorator( 'newsletter', {
            rules: [{ required: true, message: '请输入资讯简讯' }],
            initialValue: formType === 'edit' ? formValues.newsletter : ''
          } )(
            <TextArea/>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='封面图片'
          extra='图片尺寸560*372，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片}'
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

          <FormItem
          {...formItemLayout}
          label='内容'
        >
            { getFieldDecorator( 'content', {
              rules: [{ required: true, validator: this.checkEditor }],

          } )(
            <div>
              <TextArea id="editor" />
              <Upload
                name="uploadFiles"
                action={uploadData.url}
                data={{
                  key: uploadData.key
                }}
                showUploadList={false}
                onChange={this.handleUploadImg}
                >
                <Icon type="picture" className='notice-upload-icon' />
              </Upload>
              {
                this.state.editorContent === '' ? <div style={{color: 'red', marginTop: '-25px'}}>请输入内容</div> : null
              }
            </div>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'flag', {
            initialValue: formType === 'edit' ? formValues.flag.toString() : '1'
          } )(
            <RadioGroup onChange={this.handleStateChange} disabled={this.state.isHeadlines === '1'}>
              <Radio value="1">生效</Radio>
              <Radio value="0">未生效</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
           {...tailFormItemLayout}
         >
            <Button style={{float: 'right'}} type='primary' size='default' htmlType='submit' disabled={this.state.disabled}>保存</Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

NewsCard.propTypes = {
  appActions: PropTypes.object,
  websiteManage: PropTypes.object,
  websiteManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  formType: PropTypes.string,
  contentManageActions: PropTypes.object,
  formValues: PropTypes.object,
  formData: PropTypes.object,
  pageSize: PropTypes.Number,
  pageNum: PropTypes.Number
}

const mapStateToProps = (state, ownProps) => {
  const websiteManage = state.get( 'websiteManage' );
  const contentManage = state.get( 'contentManage' );
  return {
    websiteManage,
    contentManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    websiteManageActions: bindActionCreators(websiteManageActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( NewsCard ))
