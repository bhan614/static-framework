import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Col, Checkbox, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import {formatDate} from '../../utils/perfect'

import appActions from '../app/action'
import contentManageActions from './action'
import './noticeCard.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

let ck = null;
let instance = null;

class NoticeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData && props.editData.imgUrl || '',
      imgWidth: '',
      imgHeight: '',
      editorContent: props.editData && props.editData.content || '',
      disabled: false,
      showIframe: false,
      flag: props.editData && props.editData.flag.toString() || '1',
      isHeadlines: props.editData && props.editData.isHeadlines.toString() || '0',
      titleLength: props.editData && props.editData.title && props.editData.title.length || '0',
      subTitleLength: props.editData && props.editData.subtitle && props.editData.subtitle.length || '0',
    }
    this.formHtml = props.editData && props.editData.content || null;
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadImg = this.handleUploadImg.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleShowIframe = this.handleShowIframe.bind(this);
    this.handleCancelIframe = this.handleCancelIframe.bind(this);
    this.renderIframeHeader = this.renderIframeHeader.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleHeadlineChange = this.handleHeadlineChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkSubTitle = this.checkSubTitle.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onSubTitleChange = this.onSubTitleChange.bind(this);
  }

  componentWillMount() {
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        contentManageActions.getCityAddedSelectList(),
        contentManageActions.getColumnSelectList({
          type: 1
        })
      ])
    }).then((data) => {
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
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
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, title, flag, cityCode, columns} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if (this.state.editorContent === '') {
        return;
      }
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const content = instance.getData();
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        values.imgUrl = this.state.imgUrl;
        values.content = content;
        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return contentManageActions.addNotice({
            id,
            ...values
          })
          .then(() => {
            return Promise.all([
              contentManageActions.getNoticeList({
                pageNum,
                pageSize,
                title,
                flag,
                cityCode,
                columns
              }),
              contentManageActions.getNoticeNumber()
            ])
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
    if (value.length > 22) {
      callback('超过22个字');
      return;
    }
    callback();
  }
  checkSubTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入文章副标题');
      return;
    }
    if (value.length > 30) {
      callback('超过30个字');
      return;
    }
    callback();
  }
  checkSource(rule, value, callback) {
    if (value === '') {
      callback('请输入来源');
      return;
    }
    if (value.length > 5) {
      callback('超过5个字');
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


  handleShowIframe() {
    this.setState({showIframe: true});
  }

  handleCancelIframe() {
    this.setState({showIframe: false});
  }

  renderIframeHeader() {
    const { form } = this.props;
    const time = formatDate({time: new Date().getTime(), showYear: true, showHms: true});
    const html = `<div><div style="height: auto;position: relative;padding: 15px 15px 5px 15px;font-size:19px">
    <div><div style="margin-bottom: 8px;">${form.getFieldValue('title')}</div>
    <div style="color: #9c9c9c;font-size:12px">
    <span style="margin-right:5px;padding: 1px 4px;border-radius: 3px;border: 1px solid #9c9c9c;">${form.getFieldValue('source')}</span>
    <span>${time}</span>
    </div></div>
    </div><div style="padding: 10px 15px 5px 15px">${this.state.editorContent}</div></div>
    <script>window.onload=function(){
      var img=document.getElementsByTagName('img');
      var table=document.getElementsByTagName('table');
      var span = document.getElementsByTagName('span');
      var body = document.getElementsByTagName('body');
      var p = document.getElementsByTagName('p');
      body[0].style.fontSize = '13px';
      if(img) {
        for(i=0;i<img.length;i++){
          if(img[i].naturalWidth<window.innerWidth) {
            img[i].style.width=img[i].naturalWidth;
          }else{
            img[i].style.width='100%';
          }
          img[i].style.height='auto';img[i].style.margin='0 auto';img[i].style.display='block';
        }
      }
      if(table) {
        for(i=0;i<table.length;i++){
          table[i].style.width='100%';table[i].style.margin='0 auto';table[i].style.display='block';table[i].style.border='none';
        }
      }
      if(p) {
        for(i=0;i<p.length;i++){
          p[i].style.wordWrap='break-word';p[i].style.margin='0';
        }
      }
      if(span) {
        for(i=0;i<span.length;i++){
          var fontSize = span[i].style.fontSize;
          if(fontSize && fontSize.indexOf('pt') !== -1){
            var sizeNumber = fontSize.substring(0, fontSize.length-2);
            var pxNumber = Number(sizeNumber)*1.1;
            var newSize = pxNumber + 'px';
            span[i].style.fontSize = newSize;
          }
        }
      }}
    </script>`
    return html;
  }

  checkNumber(rule, value, callback) {
    const { contentManage, editData } = this.props;
    const noticeSort = contentManage && contentManage.get('noticeSort') && contentManage.get('noticeSort');
    const isEditNumber = editData && editData.weight || -1;
    if (this.state.flag === '0') {
      callback();
      return;
    }
    if (value === '') {
      callback('请输入序号');
      return;
    }
    if (isNaN(value) || value <= 0) {
      callback('请输入正整数');
      return;
    }
    if (noticeSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }

  handleStateChange(e) {
    this.setState({ flag: e.target.value })
  }

  handleHeadlineChange(e) {
    this.setState({ isHeadlines: e.target.value, imgUrl: '', imgWidth: '', imgHeight: '' });
    this.props.form.setFieldsValue({
      imgUrl: ''
    });
  }

  checkPic(rule, value, callback) {
    const { editData } = this.props;
    const { imgUrl, imgWidth, imgHeight, isHeadlines } = this.state;
    if (imgUrl === '') {
      callback('请上传文章图像');
      return;
    }
    if (Number(isHeadlines) === 1) {
      if ((imgWidth !== 1005 || imgHeight !== 531) && (imgWidth !== '' && imgHeight !== '')) {
        callback('头条图像尺寸错误');
        return;
      }
    } else {
      if ((imgWidth !== 420 || imgHeight !== 279) && (imgWidth !== '' && imgHeight !== '')) {
        callback('文章图像尺寸错误');
        return;
      }
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

  onTitleChange(e) {
    this.setState({ titleLength: e.target.value.length })
  }

  onSubTitleChange(e) {
    this.setState({ subTitleLength: e.target.value.length })
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
    const { editData, contentManage } = this.props;
    const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
    const firstCity = '全国';
    let firstColumn = '';
    //先写死全国
    //if (cityList && cityList.size > 0) {
    //  firstCity = cityList.get('0').cityName
    //}
    const columnSelectList = contentManage.get('columnSelectList') && contentManage.get('columnSelectList') || [];
    if (columnSelectList && columnSelectList.size > 0) {
      firstColumn = columnSelectList.get('0').code
    }
    const size = this.state.isHeadlines === '1' ? '1005×531' : '420×279'
    return (
      <Modal
        title={editData ? '编辑文章' : '新增文章'}
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
            initialValue: editData ? editData.title : ''
          } )(
            <Input placeholder="不超过22个字符" style={{ width: '85%', marginRight: '10px' }} onChange={this.onTitleChange} />
          ) }
            <span>{`${this.state.titleLength}/22`}</span>
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='副标题'
        >
            { getFieldDecorator( 'subtitle', {
            rules: [{ required: true, validator: this.checkSubTitle }],
            initialValue: editData ? editData.subtitle : ''
          } )(
            <Input placeholder="不超过30个字符" style={{ width: '85%', marginRight: '10px' }} onChange={this.onSubTitleChange} />
          ) }
            <span>{`${this.state.subTitleLength}/30`}</span>
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='摘要'
        >
            { getFieldDecorator( 'summary', {
            rules: [{ required: true, message: '请输入摘要' }],
            initialValue: editData ? editData.summary : ''
          } )(
            <TextArea/>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='城市'
          >
            { getFieldDecorator( 'cityName', {
              rules: [{ required: true, message: '请选择分类' }],
              initialValue: editData && editData.cityName ? editData.cityName : firstCity
            } )(
              <Select getPopupContainer={this.getArea()} disabled>
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
          label='设为头条'
        >
            { getFieldDecorator( 'isHeadlines', {
            initialValue: editData ? editData.isHeadlines.toString() : '0'
          } )(
            <RadioGroup onChange={this.handleHeadlineChange} disabled={editData && editData.id}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='栏目'
          >
            { getFieldDecorator( 'columns', {
              rules: [{ required: true, message: '请选择栏目' }],
              initialValue: editData && editData.columns ? editData.columns : firstColumn
            } )(
              <Select getPopupContainer={this.getArea()}>
                {
                  columnSelectList.map((v, k) => (
                    <Option key={v.code} value={v.code}>{v.name}</Option>
                  ))
                }
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='文章图像'
          extra={`图片尺寸${size}，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片`}
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
          label='来源'
        >
            { getFieldDecorator( 'source', {
            rules: [{ required: true, validator: this.checkSource }],
            initialValue: editData ? editData.source : ''
          } )(
            <Input placeholder="不超过五个字" />
          ) }
          </FormItem>
          {
            this.state.flag === '0' || this.state.isHeadlines === '1' ?
              null : <FormItem
              {...formItemLayout}
              label='排序'
            >
                { getFieldDecorator( 'weight', {
                rules: [{ required: true, validator: this.checkNumber }],
                initialValue: editData ? editData.weight : ''
              } )(
                <Input placeholder="请输入正整数,数字越小,在前端先展示" />
              ) }
              </FormItem>
          }
          <FormItem
          {...formItemLayout}
          label='内容'
        >
            { getFieldDecorator( 'content', {
              rules: [{ required: true, validator: this.checkEditor }],
          //  initialValue: editData ? editData.content : ''
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
            initialValue: editData ? editData.flag.toString() : '1'
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
            <Button style={{float: 'right', marginRight: '10px'}} type='primary' size='default' onClick={this.handleShowIframe} >预览</Button>
          </FormItem>
          {
            this.state.showIframe ?
              <Modal width='310' visible={this.state.showIframe} footer={null} className="iframeModal" onCancel={this.handleCancelIframe}
              >
                <iframe title="myiframe" frameBorder='0' srcDoc={this.renderIframeHeader()} width="280px" height="490px"></iframe>
              </Modal> : null
          }
        </Form>
      </Modal>
    )
  }
}

NoticeCard.propTypes = {
  appActions: PropTypes.object,
  contentManage: PropTypes.object,
  contentManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number,
  title: PropTypes.string,
  cityCode: PropTypes.number,
  flag: PropTypes.string,
  columns: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( NoticeCard ))
