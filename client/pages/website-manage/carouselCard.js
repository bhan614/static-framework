import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import websiteManageActions from './action'
import contentManageActions from '../content-manage/action'
import './carousel.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class CarouselCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconUrl: props.editData && props.editData.iconUrl || '',
      appIconUrl: props.editData && props.editData.appiconurl || '',
      imgWidth: '',
      imgHeight: '',
      appImgWidth: '',
      appImgHeight: '',
      flag: props.editData && props.editData.flag.toString() || '1',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAppChange = this.handleAppChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.checkAppPic = this.checkAppPic.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
  }

  componentDidMount() {
    this.props.websiteManageActions.getBannerNumber();
    this.props.contentManageActions.getCityAddedSelectList({flag: 1});
    this.props.contentManageActions.getBusinessSelectList();
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, websiteManageActions, pageSize, editData, pageNum, websiteManage, contentManage, cityCode, title, flag, business} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        const businessList = contentManage.get('businessSelectList') && contentManage.get('businessSelectList') || [];
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
        values.iconUrl = this.state.iconUrl;
        values.appiconurl = this.state.appIconUrl;
        appActions.loading(true).then(() => {
          return websiteManageActions.addCarousel({
            id,
            ...values
          })
          .then(() => {
            return Promise.all([
              websiteManageActions.getCarouselList({
                pageNum,
                pageSize,
                cityCode,
                title,
                flag,
                business
              }),
              websiteManageActions.getBannerNumber()
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
    const { websiteManage, editData } = this.props;
    const bannerSort = websiteManage && websiteManage.get('bannerSort') && websiteManage.get('bannerSort');
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
    if (bannerSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }

  checkTitle(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入轮播图标题');
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
    const { iconUrl, imgWidth, imgHeight } = this.state;
    if (iconUrl === '') {
      callback('请上传轮播图');
      return;
    }
    if ((imgWidth !== 1920 || imgHeight !== 457) && (imgWidth !== '' && imgHeight !== '')) {
      callback('轮播图尺寸错误');
      return;
    }
    callback();
  }

  checkAppPic(rule, value, callback) {
    const { editData } = this.props;
    const { appIconUrl, appImgWidth, appImgHeight } = this.state;
    if (appIconUrl === '') {
      callback('请上传轮播图');
      return;
    }
    if ((appImgWidth !== 1125 || appImgHeight !== 540) && (appImgWidth !== '' && appImgHeight !== '')) {
      callback('轮播图尺寸错误');
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
      this.setState({iconUrl: url, imgWidth, imgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleAppChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const appImgWidth = info.file.response.data.width;
      const appImgHeight = info.file.response.data.height;
      this.setState({appIconUrl: url, appImgWidth, appImgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleStateChange(e) {
    this.setState({ flag: e.target.value })
  }

  getArea() {
    return () => document.getElementById('bannerCard-area')
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
    const { editData, websiteManage, contentManage } = this.props;
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
        title={editData ? '编辑轮播图' : '新增轮播图'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id="bannerCard-area">
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
          label='业务线'
          >
            { getFieldDecorator( 'business', {
              //rules: [{ required: true, message: '请选择业务线' }],
              initialValue: editData && editData.business ? editData.business : ''
            } )(
              <Select disabled={firstBusiness === ''} getPopupContainer={this.getArea()}>
                {
                  businessList.map((v, k) => (
                    <Option key={v.businessId} value={v.business}>{v.business}</Option>
                  ))
                }
                <Option key={'none'} value={''}>无</Option>
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='轮播图标题'
        >
            { getFieldDecorator( 'title', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: editData ? editData.title : ''
          } )(
            <Input placeholder="不超过15个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='PC轮播图'
          extra="图片尺寸1920*457，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
        >
            { getFieldDecorator( 'iconUrl', {
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
                 this.state.iconUrl ?
                   <img src={this.state.iconUrl} alt="" className="avatar" /> :
                   <Icon type="plus" className="avatar-uploader-trigger" />
               }
            </Upload>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='移动端轮播图'
          extra="图片尺寸1125*540，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
        >
            { getFieldDecorator( 'appIconUrl', {
            rules: [{ required: true, validator: this.checkAppPic }],
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
               onChange={this.handleAppChange}
             >
              {
                 this.state.appIconUrl ?
                   <img src={this.state.appIconUrl} alt="" className="avatar" /> :
                   <Icon type="plus" className="avatar-uploader-trigger" />
               }
            </Upload>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='跳转链接'
        >
            { getFieldDecorator( 'url', {
            //rules: [{ required: true, message: '请输入跳转链接!' }],
            initialValue: editData ? editData.url : ''
          } )(
            <Input />
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
          label='轮播图状态'
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

CarouselCard.propTypes = {
  appActions: PropTypes.object,
  websiteManageActions: PropTypes.object,
  websiteManage: PropTypes.object,
  contentManage: PropTypes.object,
  contentManageActions: PropTypes.object,
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( CarouselCard ))
