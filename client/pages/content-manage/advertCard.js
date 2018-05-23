import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import contentManageActions from './action'
import './advert.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class AdvertCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData && props.editData.iconurl || '',
      bigImgUrl: props.editData && props.editData.bigIconurl || '',
      widthImgUrl: props.editData && props.editData.wideIconurl || '',
      imgWidth: '',
      imgHeight: '',
      bigImgWidth: '',
      bigImgHeight: '',
      widthImgWidth: '',
      widthImgHeight: '',
      jsonName: props.editData && props.editData.url && props.editData.url || '',
      type: props.editData && props.editData.type.toString() || '0',
      flag: props.editData && props.editData.flag.toString() || '1',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.checkBigPic = this.checkBigPic.bind(this);
    this.checkWidthPic = this.checkWidthPic.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleJsonChange = this.handleJsonChange.bind(this);
    this.handleBigChange = this.handleBigChange.bind(this);
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.checkJson = this.checkJson.bind(this);
  }

  componentWillMount() {
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getAdvertCitySelectList()
    }).then((data) => {
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const cityList = contentManage.get('advertCityList') && contentManage.get('advertCityList') || [];
        this.setState({disabled: true});
        values.iconurl = this.state.imgUrl;
        values.jsonUrl = '';
        values.imgUrl = '';
        values.bigIconurl = this.state.bigImgUrl;
        values.wideIconurl = this.state.widthImgUrl;
        //城市
        if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        appActions.loading(true).then(() => {
          return contentManageActions.addAdvert({
            id,
            ...values
          })
        }).then(() => {
          return contentManageActions.getAdvertList({
            pageNum,
            pageSize
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
          message.error(err.msg)
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
      callback('请输入广告图标题');
      return;
    }
    if (value.length > 20) {
      callback('超过20个字');
      return;
    }
    callback();
  }

  checkPic(rule, value, callback) {
    const { editData } = this.props;
    const { imgUrl, imgWidth, imgHeight } = this.state;
    if (imgUrl === '') {
      callback('请上传广告图');
      return;
    }

    if ((imgWidth !== 720 || imgHeight !== 1280) && (imgWidth !== '' && imgHeight !== '')) {
      callback('尺寸错误');
      return;
    }
    callback();
  }

  checkBigPic(rule, value, callback) {
    const { editData } = this.props;
    const { bigImgUrl, bigImgWidth, bigImgHeight } = this.state;
    if (bigImgUrl === '') {
      callback('请上传广告图');
      return;
    }

    if ((bigImgWidth !== 800 || bigImgHeight !== 1280) && (bigImgWidth !== '' && bigImgHeight !== '')) {
      callback('尺寸错误');
      return;
    }
    callback();
  }

  checkWidthPic(rule, value, callback) {
    const { editData } = this.props;
    const { widthImgUrl, widthImgWidth, widthImgHeight } = this.state;
    if (widthImgUrl === '') {
      callback('请上传广告图');
      return;
    }

    if ((widthImgWidth !== 1125 || widthImgHeight !== 2436) && (widthImgWidth !== '' && widthImgHeight !== '')) {
      callback('尺寸错误');
      return;
    }
    callback();
  }

  checkJson(rule, value, callback) {
    const { editData } = this.props;
    const { imgUrl } = this.state;
    if (imgUrl === '') {
      callback('请上传动图');
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

  beforeJsonUpload(file) {

    const isJson = file.type === 'application/json';

    if (!isJson) {
      message.error('只能上传json格式!');
    }

    return isJson;
  }

  handleChange(info) {
    console.log(info);
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

  handleJsonChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      this.setState({imgUrl: url, jsonName: name});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }
  handleBigChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const bigImgWidth = info.file.response.data.width;
      const bigImgHeight = info.file.response.data.height;
      this.setState({bigImgUrl: url, bigImgWidth, bigImgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }
  handleWidthChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const widthImgWidth = info.file.response.data.width;
      const widthImgHeight = info.file.response.data.height;
      this.setState({widthImgUrl: url, widthImgWidth, widthImgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleStateChange(e) {
    this.setState({ flag: e.target.value })
  }

  handleTypeChange(e) {
    this.setState({
      type: e.target.value,
      imgUrl: '',
      bigImgUrl: '',
      widthImgUrl: '',
      imgWidth: '',
      imgHeight: '',
      bigImgWidth: '',
      bigImgHeight: '',
      widthImgWidth: '',
      widthImgHeight: '',
      jsonName: ''
    })
  }

  getArea() {
    return () => document.getElementById('advertCard-area')
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
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
    const cityList = contentManage.get('advertCityList') && contentManage.get('advertCityList') || [];
    let firstCity = '';
    if (cityList && cityList.size > 0) {
      firstCity = cityList.get('0').cityName
    }
    return (
      <Modal
        title={editData ? '编辑开屏' : '新增开屏'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        className="advert-card"
        footer={null}
      >
        <Form id="advertCard-area" onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='城市'
          >
            { getFieldDecorator( 'cityName', {
              rules: [{ required: true, message: '请选择分类' }],
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
          label='广告说明'
        >
            { getFieldDecorator( 'name', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: editData ? editData.name : ''
          } )(
            <Input placeholder="不超过20个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='类型'
        >
            { getFieldDecorator( 'type', {
            initialValue: editData ? editData.type.toString() : '0'
          } )(
            <RadioGroup onChange={this.handleTypeChange} disabled>
              <Radio value="0">静态图片</Radio>
              <Radio value="1">动画视频</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          {
            this.state.type === '1' ?
              <FormItem
              {...formItemLayout}
              label='闪屏动画'
              extra="动画格式为:json,动画时长为3秒，每次仅上传1个动画"
            >
                { getFieldDecorator( 'jsonUrl', {
                rules: [{ required: true, validator: this.checkJson }],
              } )(
                <Upload
                   name="uploadFiles"
                   showUploadList={false}
                   action={uploadData.url}
                   data={{
                     key: uploadData.key
                   }}
                   beforeUpload={this.beforeJsonUpload}
                   onChange={this.handleJsonChange}
                 >
                  <Button>
                    <Icon type="upload" />上传动图
                  </Button>
                  <div>
                    {this.state.jsonName}
                  </div>
                </Upload>
              ) }
              </FormItem> : (
                <div className="img-container">
                  <FormItem
                  {...formItemLayout}
                  label='广告图(普通机型)'
                  extra="图片尺寸720*1280，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
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
                  label='广告图(适配安卓宽屏)'
                  extra="图片尺寸800*1280，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                    { getFieldDecorator( 'bigIconurl;', {
                    rules: [{ required: true, validator: this.checkBigPic }],
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
                       onChange={this.handleBigChange}
                     >
                      {
                         this.state.bigImgUrl ?
                           <img src={this.state.bigImgUrl} alt="" className="avatar" /> :
                           <Icon type="plus" className="avatar-uploader-trigger" />
                       }
                    </Upload>
                  ) }
                  </FormItem>
                  <FormItem
                  {...formItemLayout}
                  label='广告图(适配iPhoneX)'
                  extra="图片尺寸1125*2436，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                    { getFieldDecorator( 'wideIconurl', {
                    rules: [{ required: true, validator: this.checkWidthPic }],
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
                       onChange={this.handleWidthChange}
                     >
                      {
                         this.state.widthImgUrl ?
                           <img src={this.state.widthImgUrl} alt="" className="avatar" /> :
                           <Icon type="plus" className="avatar-uploader-trigger" />
                       }
                    </Upload>
                  ) }
                  </FormItem>
                </div>
              )
          }

          <FormItem
          {...formItemLayout}
          label='跳转链接'
        >
            { getFieldDecorator( 'url', {
            initialValue: editData ? editData.url : ''
          } )(
            <Input />
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
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

AdvertCard.propTypes = {
  appActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number,
  contentManage: PropTypes.object
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( AdvertCard ))
