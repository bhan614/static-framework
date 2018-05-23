import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import {formatDate} from '../../utils/perfect'
import appActions from '../app/action'
import contentManageActions from './action'
import './hot.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

let ck = null;
let instance = null;

class HotCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData && props.editData.imgUrl || '',
      imgWidth: '',
      imgHeight: '',
      flag: props.editData && props.editData.flag.toString() || '1',
      disabled: false,
      editorContent: props.editData && props.editData.content || '',
      showIframe: false,
      type: props.editData && props.editData.type.toString() || '1',
      titleLength: props.editData && props.editData.title && props.editData.title.length || '0',
      subTitleLength: props.editData && props.editData.subtitle && props.editData.subtitle.length || '0',
    }
    this.formHtml = props.editData && props.editData.content || null;

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.renderIframeHeader = this.renderIframeHeader.bind(this);
    this.handleCancelIframe = this.handleCancelIframe.bind(this);
    this.handleShowIframe = this.handleShowIframe.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onSubTitleChange = this.onSubTitleChange.bind(this);
    this.handleUploadImg = this.handleUploadImg.bind(this);
  }

  componentDidMount() {
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        this.props.contentManageActions.getHotNumber(),
        this.props.contentManageActions.getCityAddedSelectList(),
        this.props.contentManageActions.getBusinessSelectList()
      ])
    }).then((data) => {
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })

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
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, cityCode, title, flag, business} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        const businessList = contentManage.get('businessSelectList') && contentManage.get('businessSelectList') || [];
        const content = instance.getData();
        if (values.type === '1') {
          values.content = content;
        }
        //城市
        if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        //业务线
        if (values.business && values.business.length > 0) {
          const selectBusiness = businessList.filter(v => v.business === values.business).get('0');
          values.businessId = selectBusiness.businessId;
        }
        if (values.flag === '0') {
          values.weight = '0'
        }

        this.setState({disabled: true});
        values.imgUrl = this.state.imgUrl;
        values.shareUrl = this.state.shareUrl;
        appActions.loading(true).then(() => {
          return contentManageActions.addHot({
            id,
            ...values
          })
          .then(() => {
            return Promise.all([
              contentManageActions.getHotList({
                pageNum,
                pageSize,
                cityCode,
                title,
                flag,
                business
              }),
              contentManageActions.getHotNumber()
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

  checkNumber(rule, value, callback) {
    const { contentManage, editData } = this.props;
    const hotSort = contentManage && contentManage.get('hotSort') && contentManage.get('hotSort');
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
    if (hotSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }

  checkTitle(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入标题');
      return;
    }
    if (value.length > 15) {
      callback('超过15个字');
      return;
    }
    callback();
  }
  checkSubTitle(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入副标题');
      return;
    }
    if (value.length > 15) {
      callback('超过15个字');
      return;
    }
    callback();
  }

  checkPic(rule, value, callback) {
    const { editData } = this.props;
    const { imgUrl, imgWidth, imgHeight } = this.state;
    if (imgUrl === '') {
      callback('请上传配图');
      return;
    }

    if ((imgWidth !== 486 || imgHeight !== 300) && (imgWidth !== '' && imgHeight !== '')) {
      callback('配图尺寸错误');
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

  handleStateChange(e) {
    this.setState({ flag: e.target.value })
  }

  handleTypeChange(e) {
    this.setState({ type: e.target.value })
  }

  getArea() {
    return () => document.getElementById('hotCard-area')
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
    const { isShare } = this.state;
    const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
    const businessList = contentManage.get('businessSelectList') && contentManage.get('businessSelectList') || [];
    let firstCity = '';
    let firstBusiness = '';
    if (cityList && cityList.size > 0) {
      firstCity = cityList.get('0').cityName
    }
    if (businessList && businessList.size > 0) {
      firstBusiness = businessList.get('0').business
    }
    return (
      <Modal
        title={editData ? '编辑热门推荐' : '新增热门推荐'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
        width={1060}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id="hotCard-area">
          <FormItem
          {...formItemLayout}
          label='城市'
          >
            { getFieldDecorator( 'cityName', {
              rules: [{ required: true, message: '请选择城市' }],
              initialValue: editData && editData.cityName ? editData.cityName : firstCity
            } )(
              <Select getPopupContainer={this.getArea()}>
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
          label='业务线'
          >
            { getFieldDecorator( 'business', {
              rules: [{ required: true, message: '请选择业务线' }],
              initialValue: editData && editData.business ? editData.business : firstBusiness
            } )(
              <Select getPopupContainer={this.getArea()}>
                {
                  businessList.map((v, k) => (
                    <Option key={v.business} value={v.business}>{v.business}</Option>
                  ))
                }
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='标题'
        >
            { getFieldDecorator( 'title', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: editData ? editData.title : ''
          } )(
            <Input placeholder="不超过15个字" style={{ width: '80%', marginRight: '10px' }} onChange={this.onTitleChange} />
          ) }
            <span>{`${this.state.titleLength}/15`}</span>
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='副标题'
        >
            { getFieldDecorator( 'subtitle', {
            rules: [{ required: true, validator: this.checkSubTitle }],
            initialValue: editData ? editData.subtitle : ''
          } )(
            <Input placeholder="不超过15个字" style={{ width: '80%', marginRight: '10px' }} onChange={this.onSubTitleChange} />
          ) }
            <span>{`${this.state.subTitleLength}/15`}</span>
          </FormItem>
          {
            this.state.type === '1' ?
              <FormItem
              {...formItemLayout}
              label='来源'
            >
                { getFieldDecorator( 'source', {
                rules: [{ required: true, validator: this.checkSource }],
                initialValue: editData ? editData.source : ''
              } )(
                <Input placeholder="不超过五个字" style={{ width: '30%', marginRight: '10px' }} />
              ) }
              </FormItem> : null
          }
          <FormItem
          {...formItemLayout}
          label='配图'
          extra="图片尺寸486*300，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
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
          label='编辑方式'
        >
            { getFieldDecorator( 'type', {
            initialValue: editData ? editData.type.toString() : this.state.type
          } )(
            <RadioGroup onChange={this.handleTypeChange}>
              <Radio value="1">编辑器</Radio>
              <Radio value="0">H5跳转链接</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          {
            this.state.type === '0' ?
              <FormItem
              {...formItemLayout}
              label='跳转链接'
            >
                { getFieldDecorator( 'hotUrl', {
                rules: [{ required: true, message: '请输入跳转链接!' }],
                initialValue: editData ? editData.hotUrl : ''
              } )(
                <Input />
              ) }
              </FormItem> : null
          }
          <FormItem
          {...formItemLayout}
          label='内容'
          style={this.state.type === '0' ? { height: 0, overflow: 'hidden', marginBottom: 0 } : null}
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
                <Icon type="picture" className='hot-upload-icon' />
              </Upload>
              {
                this.state.editorContent === '' ? <div style={{color: 'red', marginTop: '-25px'}}>请输入内容</div> : null
              }
            </div>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='排序'
        >
            { getFieldDecorator( 'weight', {
            rules: [{ required: true, validator: this.checkNumber }],
            initialValue: editData ? editData.weight : ''
          } )(
            <Input placeholder="请输入正整数,数字越小,在前端先展示" disabled={this.state.flag === '0'} />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'flag', {
            initialValue: editData ? editData.flag.toString() : '1'
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

HotCard.propTypes = {
  appActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  contentManage: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number,
  cityCode: PropTypes.number,
  title: PropTypes.string,
  flag: PropTypes.string,
  business: PropTypes.string
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( HotCard ))
