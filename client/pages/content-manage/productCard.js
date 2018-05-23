import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon, Tag } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import contentManageActions from './action'
import './icon.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;


const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData && props.editData.iconUrl || '',
      backImgUrl: props.editData && props.editData.backurl || '',
      mubanUrl: props.editData && props.editData.imgUrl || '',
      clientImg: props.editData && props.editData.clientImg || '',
      useProcess: props.editData && props.editData.useProcess || '',
      iconUrl1: props.editData && props.editData.iconUrl1 || '',
      iconUrl2: props.editData && props.editData.iconUrl2 || '',
      iconUrl3: props.editData && props.editData.iconUrl3 || '',
      imgWidth: '',
      imgHeight: '',
      backImgWidth: '',
      backImgHeight: '',
      mubanWidth: '',
      mubanHeight: '',
      clientWidth: '',
      clientHeight: '',
      processWidth: '',
      processHeight: '',
      iconWidth1: '',
      iconHeight1: '',
      iconWidth2: '',
      iconHeight2: '',
      iconWidth3: '',
      iconHeight3: '',
      status: props.editData && props.editData.status.toString() || '1',
      flag: props.editData && props.editData.flag.toString() || '1',
      type: props.editData && props.editData.type && props.editData.type.toString() || '0',
      color: props.editData && props.editData.color || '',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.checkBackPic = this.checkBackPic.bind(this);
    this.checkMuBanPic = this.checkMuBanPic.bind(this);
    this.checkClientPic = this.checkClientPic.bind(this);
    this.checkProcessPic = this.checkProcessPic.bind(this);
    this.checkIcon1Pic = this.checkIcon1Pic.bind(this);
    this.checkIcon2Pic = this.checkIcon2Pic.bind(this);
    this.checkIcon3Pic = this.checkIcon3Pic.bind(this);
    this.handleBackChange = this.handleBackChange.bind(this);
    this.handleClientChange = this.handleClientChange.bind(this);
    this.handleMubanChange = this.handleMubanChange.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.handleIcon1Change = this.handleIcon1Change.bind(this);
    this.handleIcon2Change = this.handleIcon2Change.bind(this);
    this.handleIcon3Change = this.handleIcon3Change.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleFlagChange = this.handleFlagChange.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.checkRemark = this.checkRemark.bind(this);
    this.checkRates = this.checkRates.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  componentDidMount() {
    this.props.contentManageActions.getProductNumber();
    this.props.contentManageActions.getCityAddedSelectList();
    this.props.contentManageActions.getBusinessSelectList();
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, cityCode, name, status, flag, business} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        const businessList = contentManage.get('businessSelectList') && contentManage.get('businessSelectList') || [];
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
        if (values.status === '0') {
          values.weight = '0'
        }
        if (values.flag === '0') {
          values.scope = ''
        }
        this.setState({disabled: true});
        values.iconUrl = this.state.imgUrl;
        values.backurl = this.state.backImgUrl;
        values.imgUrl = this.state.mubanUrl;
        values.clientImg = this.state.clientImg;
        values.useProcess = this.state.useProcess;
        values.iconUrl1 = this.state.iconUrl1;
        values.iconUrl2 = this.state.iconUrl2;
        values.iconUrl3 = this.state.iconUrl3;
        appActions.loading(true).then(() => {
          return contentManageActions.addProduct({
            id,
            ...values
          })
          .then(() => {
            return Promise.all([
              contentManageActions.getProductList({
                pageNum,
                pageSize,
                cityCode,
                name,
                status,
                flag,
                business
              }),
              contentManageActions.getProductNumber()
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
    const productSort = contentManage && contentManage.get('productSort') && contentManage.get('productSort');
    const isEditNumber = editData && editData.weight || -1;
    if (this.state.status === '0') {
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
    if (productSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }

  checkRateType(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入费率形式');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字');
      return;
    }
    callback();
  }

  checkName(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入产品名称');
      return;
    }
    if (value.length > 9) {
      callback('超过9个字');
      return;
    }
    callback();
  }

  checkPoint(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入产品特点');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字');
      return;
    }
    callback();
  }

  checkClientCase(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入案例');
      return;
    }
    if (value.length > 50) {
      callback('超过50个字');
      return;
    }
    callback();
  }

  checkClientName(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入姓名');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字');
      return;
    }
    callback();
  }

  checkClientDescription(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入描述');
      return;
    }
    if (value.length > 15) {
      callback('超过15个字');
      return;
    }
    callback();
  }

  checkRateMsg(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入费率相关信息');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字');
      return;
    }
    callback();
  }

  checkQuestion(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入常见问题');
      return;
    }
    if (value.length > 20) {
      callback('超过20个字');
      return;
    }
    callback();
  }

  checkAnswer(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入解答');
      return;
    }
    if (value.length > 50) {
      callback('超过50个字');
      return;
    }
    callback();
  }

  checkExplain(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入产品说明');
      return;
    }
    if (value.length > 22) {
      callback('超过22个字');
      return;
    }
    callback();
  }

  checkRateExplain(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入说明');
      return;
    }
    if (value.length > 10) {
      callback('超过10个字');
      return;
    }
    callback();
  }

  checkRemark(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入介绍文案');
      return;
    }
    if (value.length > 12) {
      callback('超过12个字');
      return;
    }
    callback();
  }

  checkRates(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入费率');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字符');
      return;
    }
    callback();
  }

  checkRange(rule, value, callback) {
    if (!value || value === '') {
      callback('请输入适用范围');
      return;
    }
    if (value.length > 12) {
      callback('超过12个字');
      return;
    }
    callback();
  }

  checkPic(rule, value, callback) {
    const { editData } = this.props;
    const { imgUrl, imgWidth, imgHeight } = this.state;
    if (imgUrl === '') {
      callback('请上传产品图像');
      return;
    }

    if ((imgWidth !== 126 || imgHeight !== 126) && (imgWidth !== '' && imgHeight !== '')) {
      callback('产品图像尺寸错误');
      return;
    }
    callback();
  }

  checkBackPic(rule, value, callback) {
    const { editData } = this.props;
    const { backImgUrl, backImgWidth, backImgHeight } = this.state;
    if (backImgUrl === '') {
      callback('请上传图标');
      return;
    }

    if ((backImgWidth !== 1005 || backImgHeight !== 360) && (backImgWidth !== '' && backImgHeight !== '')) {
      callback('背景图尺寸错误');
      return;
    }
    callback();
  }

  checkMuBanPic(rule, value, callback) {
    const { editData } = this.props;
    const { mubanUrl, mubanWidth, mubanHeight } = this.state;
    if (mubanUrl === '') {
      callback('请上传Banner图');
      return;
    }

    if ((mubanWidth !== 750 || mubanHeight !== 378) && (mubanWidth !== '' && mubanHeight !== '')) {
      callback('Banner图尺寸错误');
      return;
    }
    callback();
  }

  checkClientPic(rule, value, callback) {
    const { editData } = this.props;
    const { clientImg, clientWidth, clientHeight } = this.state;
    if (clientImg === '') {
      callback('请上传头像');
      return;
    }

    if ((clientWidth !== 110 || clientHeight !== 110) && (clientWidth !== '' && clientHeight !== '')) {
      callback('头像尺寸错误');
      return;
    }
    callback();
  }

  checkProcessPic(rule, value, callback) {
    const { editData } = this.props;
    const { useProcess, processWidth, processHeight } = this.state;
    if (useProcess === '') {
      callback('请上传流程图');
      return;
    }

    if ((processWidth !== 600 || processHeight !== 240) && (processWidth !== '' && processHeight !== '')) {
      callback('流程图尺寸错误');
      return;
    }
    callback();
  }

  checkIcon1Pic(rule, value, callback) {
    const { editData } = this.props;
    const { iconUrl1, iconWidth1, iconHeight1 } = this.state;
    if (iconUrl1 === '') {
      callback('请上传产品特点图标');
      return;
    }

    if ((iconWidth1 !== 70 || iconHeight1 !== 70) && (iconWidth1 !== '' && iconHeight1 !== '')) {
      callback('图标尺寸错误');
      return;
    }
    callback();
  }
  checkIcon2Pic(rule, value, callback) {
    const { editData } = this.props;
    const { iconUrl2, iconWidth2, iconHeight2 } = this.state;
    if (iconUrl2 === '') {
      callback('请上传产品特点图标');
      return;
    }

    if ((iconWidth2 !== 70 || iconHeight2 !== 70) && (iconWidth2 !== '' && iconHeight2 !== '')) {
      callback('图标尺寸错误');
      return;
    }
    callback();
  }
  checkIcon3Pic(rule, value, callback) {
    const { editData } = this.props;
    const { iconUrl3, iconWidth3, iconHeight3 } = this.state;
    if (iconUrl3 === '') {
      callback('请上传产品特点图标');
      return;
    }

    if ((iconWidth3 !== 70 || iconHeight3 !== 70) && (iconWidth3 !== '' && iconHeight3 !== '')) {
      callback('图标尺寸错误');
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

  handleBackChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const backImgWidth = info.file.response.data.width;
      const backImgHeight = info.file.response.data.height;
      this.setState({backImgUrl: url, backImgWidth, backImgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleClientChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const clientWidth = info.file.response.data.width;
      const clientHeight = info.file.response.data.height;
      this.setState({clientImg: url, clientWidth, clientHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleMubanChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const mubanWidth = info.file.response.data.width;
      const mubanHeight = info.file.response.data.height;
      this.setState({mubanUrl: url, mubanWidth, mubanHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleProcessChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const processWidth = info.file.response.data.width;
      const processHeight = info.file.response.data.height;
      this.setState({useProcess: url, processWidth, processHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleIcon1Change(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const iconWidth1 = info.file.response.data.width;
      const iconHeight1 = info.file.response.data.height;
      this.setState({iconUrl1: url, iconWidth1, iconHeight1});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }
  handleIcon2Change(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const iconWidth2 = info.file.response.data.width;
      const iconHeight2 = info.file.response.data.height;
      this.setState({iconUrl2: url, iconWidth2, iconHeight2});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }
  handleIcon3Change(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const iconWidth3 = info.file.response.data.width;
      const iconHeight3 = info.file.response.data.height;
      this.setState({iconUrl3: url, iconWidth3, iconHeight3});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleStateChange(e) {
    this.setState({ status: e.target.value })
  }

  handleFlagChange(e) {
    this.setState({ flag: e.target.value })
  }

  getArea() {
    return () => document.getElementById('productCard-area')
  }

  handleTypeChange(e) {
    this.setState({ type: e.target.value })
  }

  handleColorChange(e) {
    this.setState({ color: e.target.value })
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
        title={editData ? '编辑产品' : '新增产品'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id='productCard-area'>
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
              rules: [{ required: true, message: '请选择业务线' }],
              initialValue: editData && editData.business ? editData.business : firstBusiness
            } )(
              <Select disabled={firstBusiness === ''} getPopupContainer={this.getArea()}>
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
          label='产品名称'
        >
            { getFieldDecorator( 'name', {
            rules: [{ required: true, validator: this.checkName}],
            initialValue: editData ? editData.name : ''
          } )(
            <Input placeholder="不超过9个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='费率形式'
        >
            { getFieldDecorator( 'ratestips', {
            rules: [{ required: true, validator: this.checkRateType }],
            initialValue: editData ? editData.ratestips : ''
          } )(
            <Input placeholder="不超过6个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='费率'
        >
            { getFieldDecorator( 'rates', {
            rules: [{ required: true, validator: this.checkRates }],
            initialValue: editData ? editData.rates : ''
          } )(
            <Input placeholder="不超过6个字符" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='介绍文案'
        >
            { getFieldDecorator( 'remarks', {
            rules: [{ required: true, validator: this.checkRemark }],
            initialValue: editData ? editData.remarks : ''
          } )(
            <Input placeholder="一句话介绍产品,不超过12个字" />
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
            <Input placeholder="请输入正整数,数字越小,在前端先展示" disabled={this.state.status === '0'} />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          className="icon-uploader-container"
          label='产品图像'
          extra="图片尺寸126*126，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
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
          className="back-uploader-container"
          label='背景图'
          extra="图片尺寸1005×360，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
          >
            { getFieldDecorator( 'backurl', {
            rules: [{ required: true, validator: this.checkBackPic }],
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
               onChange={this.handleBackChange}
             >
              {
                 this.state.backImgUrl ?
                   <img src={this.state.backImgUrl} alt="" className="avatar" /> :
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
            initialValue: this.state.type
          } )(
            <RadioGroup onChange={this.handleTypeChange}>
              <Radio value="0">H5跳转链接</Radio>
              <Radio value="1">模板编辑</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          {
            this.state.type === '0' ?
              <FormItem
              {...formItemLayout}
              label='跳转链接'
            >
                { getFieldDecorator( 'url', {
                rules: [{ required: true, message: '请输入跳转链接!' }],
                initialValue: editData ? editData.url : ''
              } )(
                <Input placeholder="请输入跳转链接" />
              ) }
              </FormItem> : null
          }
          {
            this.state.type === '1' ?
              <div>
                <FormItem
                  {...formItemLayout}
                  label='主题颜色'
                >
                  { getFieldDecorator( 'color', {
                    rules: [{ required: true, message: '请输入模板主题颜色' }],
                    initialValue: editData ? editData.color : ''
                  } )(
                    <Input onChange={this.handleColorChange} placeholder="请输入模板主题颜色号 如:#2db7f5" />
                  ) }
                  {
                    this.state.color ?
                      <Tag color={this.state.color} style={{ display: 'inline-block', marginTop: '10px' }}>{this.state.color}</Tag>
                      : null
                  }
                </FormItem>
                <FormItem
                {...formItemLayout}
                className="back-uploader-container"
                label='Banner图'
                extra="图片尺寸750×378，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                  { getFieldDecorator( 'mubanUrl', {
                  rules: [{ required: true, validator: this.checkMuBanPic }],
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
                     onChange={this.handleMubanChange}
                   >
                    {
                       this.state.mubanUrl ?
                         <img src={this.state.mubanUrl} alt="" className="avatar" /> :
                         <Icon type="plus" className="avatar-uploader-trigger" />
                    }
                  </Upload>
                ) }
                </FormItem>
                <div className="product-item-title">产品相关信息:</div>
                <FormItem
                {...formItemLayout}
                className="icon-uploader-container"
                label='特点1图标'
                extra="图片尺寸70×70，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                  { getFieldDecorator( 'iconUrl1', {
                  rules: [{ required: true, validator: this.checkIcon1Pic }],
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
                     onChange={this.handleIcon1Change}
                   >
                    {
                       this.state.iconUrl1 ?
                         <img src={this.state.iconUrl1} alt="" className="avatar" /> :
                         <Icon type="plus" className="avatar-uploader-trigger" />
                    }
                  </Upload>
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='产品特点1'
              >
                  { getFieldDecorator( 'point1', {
                  rules: [{ required: true, validator: this.checkPoint }],
                  initialValue: editData ? editData.point1 : ''
                } )(
                  <Input placeholder="不超过6个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='说明'
              >
                  { getFieldDecorator( 'explain1', {
                  rules: [{ required: true, validator: this.checkExplain }],
                  initialValue: editData ? editData.explain1 : ''
                } )(
                  <Input placeholder="不超过22个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                className="icon-uploader-container"
                label='特点2图标'
                extra="图片尺寸70×70，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                  { getFieldDecorator( 'iconUrl2', {
                  rules: [{ required: true, validator: this.checkIcon2Pic }],
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
                     onChange={this.handleIcon2Change}
                   >
                    {
                       this.state.iconUrl2 ?
                         <img src={this.state.iconUrl2} alt="" className="avatar" /> :
                         <Icon type="plus" className="avatar-uploader-trigger" />
                    }
                  </Upload>
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='产品特点2'
              >
                  { getFieldDecorator( 'point2', {
                  rules: [{ required: true, validator: this.checkPoint }],
                  initialValue: editData ? editData.point2 : ''
                } )(
                  <Input placeholder="不超过6个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='说明'
              >
                  { getFieldDecorator( 'explain2', {
                  rules: [{ required: true, validator: this.checkExplain }],
                  initialValue: editData ? editData.explain2 : ''
                } )(
                  <Input placeholder="不超过22个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                className="icon-uploader-container"
                label='特点3图标'
                extra="图片尺寸70×70，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                  { getFieldDecorator( 'iconUrl3', {
                  rules: [{ required: true, validator: this.checkIcon3Pic }],
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
                     onChange={this.handleIcon3Change}
                   >
                    {
                       this.state.iconUrl3 ?
                         <img src={this.state.iconUrl3} alt="" className="avatar" /> :
                         <Icon type="plus" className="avatar-uploader-trigger" />
                    }
                  </Upload>
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='产品特点3'
              >
                  { getFieldDecorator( 'point3', {
                  rules: [{ required: true, validator: this.checkPoint }],
                  initialValue: editData ? editData.point3 : ''
                } )(
                  <Input placeholder="不超过6个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='说明'
              >
                  { getFieldDecorator( 'explain3', {
                  rules: [{ required: true, validator: this.checkExplain }],
                  initialValue: editData ? editData.explain3 : ''
                } )(
                  <Input placeholder="不超过22个字" />
                ) }
                </FormItem>
                <div className="product-item-title">费率相关信息:</div>
                <FormItem
                {...formItemLayout}
                label='相关信息1'
              >
                  { getFieldDecorator( 'rateMsg1', {
                  rules: [{ required: true, validator: this.checkRateMsg }],
                  initialValue: editData ? editData.rateMsg1 : ''
                } )(
                  <Input placeholder="不超过6个字 最高额度/还款方式/费率/期限" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='说明'
              >
                  { getFieldDecorator( 'rateExplain1', {
                  rules: [{ required: true, validator: this.checkRateExplain }],
                  initialValue: editData ? editData.rateExplain1 : ''
                } )(
                  <Input placeholder="不超过10个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='相关信息2'
              >
                  { getFieldDecorator( 'rateMsg2', {
                  rules: [{ required: true, validator: this.checkRateMsg }],
                  initialValue: editData ? editData.rateMsg2 : ''
                } )(
                  <Input placeholder="不超过6个字 最高额度/还款方式/费率/期限" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='说明'
              >
                  { getFieldDecorator( 'rateExplain2', {
                  rules: [{ required: true, validator: this.checkRateExplain }],
                  initialValue: editData ? editData.rateExplain2 : ''
                } )(
                  <Input placeholder="不超过10个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='相关信息3'
              >
                  { getFieldDecorator( 'rateMsg3', {
                  rules: [{ required: true, validator: this.checkRateMsg }],
                  initialValue: editData ? editData.rateMsg3 : ''
                } )(
                  <Input placeholder="不超过6个字 最高额度/还款方式/费率/期限" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='说明'
              >
                  { getFieldDecorator( 'rateExplain3', {
                  rules: [{ required: true, validator: this.checkRateExplain }],
                  initialValue: editData ? editData.rateExplain3 : ''
                } )(
                  <Input placeholder="不超过10个字" />
                ) }
                </FormItem>
                <div className="product-item-title">案例相关信息:</div>
                <FormItem
                {...formItemLayout}
                label='客户姓名'
              >
                  { getFieldDecorator( 'clientName', {
                  rules: [{ required: true, validator: this.checkClientName }],
                  initialValue: editData ? editData.clientName : ''
                } )(
                  <Input placeholder="不超过6个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='相关描述'
              >
                  { getFieldDecorator( 'clientDescription', {
                  rules: [{ required: true, validator: this.checkClientDescription }],
                  initialValue: editData ? editData.clientDescription : ''
                } )(
                  <Input placeholder="不超过15个字  职业/年龄" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                className="back-uploader-container"
                label='客户照片'
                extra="图片尺寸110×110，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                  { getFieldDecorator( 'clientImg', {
                  rules: [{ required: true, validator: this.checkClientPic }],
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
                     onChange={this.handleClientChange}
                   >
                    {
                       this.state.clientImg ?
                         <img src={this.state.clientImg} alt="" className="avatar" /> :
                         <Icon type="plus" className="avatar-uploader-trigger" />
                    }
                  </Upload>
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='客户案例'
              >
                  { getFieldDecorator( 'clientCase', {
                  rules: [{ required: true, validator: this.checkClientCase }],
                  initialValue: editData ? editData.clientCase : ''
                } )(
                  <TextArea placeholder="不超过50个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                className="back-uploader-container"
                label='使用流程'
                extra="图片尺寸600×240，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
                >
                  { getFieldDecorator( 'useProcess', {
                  rules: [{ required: true, validator: this.checkProcessPic }],
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
                     onChange={this.handleProcessChange}
                   >
                    {
                       this.state.useProcess ?
                         <img src={this.state.useProcess} alt="" className="avatar" /> :
                         <Icon type="plus" className="avatar-uploader-trigger" />
                    }
                  </Upload>
                ) }
                </FormItem>
                <div className="product-item-title">问题相关信息:</div>
                <FormItem
                {...formItemLayout}
                label='常见问题1'
              >
                  { getFieldDecorator( 'question1', {
                  rules: [{ required: true, validator: this.checkQuestion }],
                  initialValue: editData ? editData.question1 : ''
                } )(
                  <Input placeholder="不超过20个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='解答'
              >
                  { getFieldDecorator( 'answer1', {
                  rules: [{ required: true, validator: this.checkAnswer }],
                  initialValue: editData ? editData.answer1 : ''
                } )(
                  <TextArea placeholder="不超过50个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='常见问题2'
              >
                  { getFieldDecorator( 'question2', {
                  rules: [{ required: true, validator: this.checkQuestion }],
                  initialValue: editData ? editData.question2 : ''
                } )(
                  <Input placeholder="不超过20个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='解答'
              >
                  { getFieldDecorator( 'answer2', {
                  rules: [{ required: true, validator: this.checkAnswer }],
                  initialValue: editData ? editData.answer2 : ''
                } )(
                  <TextArea placeholder="不超过50个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='常见问题3'
              >
                  { getFieldDecorator( 'question3', {
                  rules: [{ required: true, validator: this.checkQuestion }],
                  initialValue: editData ? editData.question3 : ''
                } )(
                  <Input placeholder="不超过20个字" />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='解答'
              >
                  { getFieldDecorator( 'answer3', {
                  rules: [{ required: true, validator: this.checkAnswer }],
                  initialValue: editData ? editData.answer3 : ''
                } )(
                  <TextArea placeholder="不超过50个字" />
                ) }
                </FormItem>
              </div> : null
          }
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'status', {
            initialValue: editData ? editData.status.toString() : '1'
          } )(
            <RadioGroup onChange={this.handleStateChange}>
              <Radio value="1">生效</Radio>
              <Radio value="0">未生效</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='设为热门'
        >
            { getFieldDecorator( 'flag', {
            initialValue: editData ? editData.flag.toString() : '1'
          } )(
            <RadioGroup onChange={this.handleFlagChange}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          {
            this.state.flag === '1' ?
              <FormItem
              {...formItemLayout}
              label='适用范围'
            >
                { getFieldDecorator( 'scope', {
                rules: [{ required: true, validator: this.checkRange }],
                initialValue: editData ? editData.scope : ''
              } )(
                <Input placeholder="此文案将显示在首页-热门产品" />
              ) }
              </FormItem> : null
          }
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

ProductCard.propTypes = {
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
  name: PropTypes.string,
  status: PropTypes.string,
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( ProductCard ))
