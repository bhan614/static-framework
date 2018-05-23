import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import contentManageActions from '../content-manage/action'
import websiteManageActions from './action'
import '../content-manage/icon.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData && props.editData.imageUrl || '',
      mImgUrl: props.editData && props.editData.appimageurl || '',
      appImgUrl: props.editData && props.editData.detailimageurl || '',
      imgWidth: '',
      imgHeight: '',
      appImgWidth: '',
      appImgHeight: '',
      mImgWidth: '',
      mImgHeight: '',
      status: props.editData && props.editData.status.toString() || '1',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMChange = this.handleMChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.checkMPic = this.checkMPic.bind(this);
    this.handleAppChange = this.handleAppChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.checkRemark = this.checkRemark.bind(this);
    this.checkRates = this.checkRates.bind(this);
    this.checkAppPic = this.checkAppPic.bind(this);
  }

  componentDidMount() {
    this.props.websiteManageActions.getLiveNumber();
    this.props.contentManageActions.getCityAddedSelectList({flag: 1});
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, websiteManage, websiteManageActions, cityCode, name, status} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const cityList = contentManage.get('cityAddedSelectList') && contentManage.get('cityAddedSelectList') || [];
        if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        if (values.status === '0') {
          values.weight = '0'
        }
        this.setState({disabled: true});
        values.imageUrl = this.state.imgUrl;
        values.detailimageurl = this.state.appImgUrl;
        values.appimageurl = this.state.mImgUrl;
        appActions.loading(true).then(() => {
          return websiteManageActions.addLive({
            id,
            ...values
          })
          .then(() => {
            return Promise.all([
              websiteManageActions.getLiveList({
                pageNum,
                pageSize,
                cityCode,
                productName: name,
                status
              }),
              websiteManageActions.getLiveNumber()
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
    const productSort = websiteManage && websiteManage.get('liveSort') && websiteManage.get('liveSort');
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
      callback('超过8个字');
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

  checkPic(rule, value, callback) {
    const { editData } = this.props;
    const { imgUrl, imgWidth, imgHeight } = this.state;
    if (imgUrl === '') {
      callback('请上传产品图像');
      return;
    }

    if ((imgWidth !== 280 || imgHeight !== 280) && (imgWidth !== '' && imgHeight !== '')) {
      callback('产品图像尺寸错误');
      return;
    }
    callback();
  }

  checkMPic(rule, value, callback) {
    const { editData } = this.props;
    const { mImgUrl, mImgWidth, mImgHeight } = this.state;
    if (mImgUrl === '') {
      callback('请上传产品图像');
      return;
    }

    if ((mImgWidth !== 1005 || mImgHeight !== 360) && (mImgWidth !== '' && mImgHeight !== '')) {
      callback('产品图像尺寸错误');
      return;
    }
    callback();
  }

  checkAppPic(rule, value, callback) {
    const { editData } = this.props;
    const { appImgUrl, appImgWidth, appImgHeight } = this.state;
    if (appImgUrl === '') {
      callback('请上传产品图像');
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

  handleMChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const mImgWidth = info.file.response.data.width;
      const mImgHeight = info.file.response.data.height;
      this.setState({mImgUrl: url, mImgWidth, mImgHeight});
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
      this.setState({appImgUrl: url, appImgWidth, appImgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleStateChange(e) {
    this.setState({ status: e.target.value })
  }

  getArea() {
    return () => document.getElementById('productCard-area')
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
    let firstCity = '';
    if (cityList && cityList.size > 0) {
      firstCity = cityList.get('0').cityName
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
          label='产品名称'
        >
            { getFieldDecorator( 'productName', {
            rules: [{ required: true, validator: this.checkName}],
            initialValue: editData ? editData.productName : ''
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
            { getFieldDecorator( 'rate', {
            rules: [{ required: true, validator: this.checkRates }],
            initialValue: editData ? editData.rate : ''
          } )(
            <Input placeholder="不超过6个字符" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='介绍文案'
        >
            { getFieldDecorator( 'introduction', {
            rules: [{ required: true, validator: this.checkRemark }],
            initialValue: editData ? editData.introduction : ''
          } )(
            <Input placeholder="一句话介绍产品,不超过12个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='产品解释'
        >
            { getFieldDecorator( 'explanation', {
            rules: [{ required: true, message: '请输入产品解释!' }],
            initialValue: editData ? editData.explanation : ''
          } )(
            <TextArea placeholder="请输入产品解释" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='产品特点1'
        >
            { getFieldDecorator( 'featureText1', {
            rules: [{ required: true, message: '请输入产品特点1!' }],
            initialValue: editData ? editData.featureText1 : ''
          } )(
            <Input placeholder="请输入产品特点" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='描述'
        >
            { getFieldDecorator( 'featureExplain1', {
            rules: [{ required: true, message: '请输入特点1描述!' }],
            initialValue: editData ? editData.featureExplain1 : ''
          } )(
            <Input placeholder="一句话描述产品特点1" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='产品特点2'
        >
            { getFieldDecorator( 'featureText2', {
            rules: [{ required: true, message: '请输入产品特点2!' }],
            initialValue: editData ? editData.featureText2 : ''
          } )(
            <Input placeholder="请输入产品特点" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='描述'
        >
            { getFieldDecorator( 'featureExplain2', {
            rules: [{ required: true, message: '请输入特点2描述!' }],
            initialValue: editData ? editData.featureExplain2 : ''
          } )(
            <Input placeholder="一句话描述产品特点2" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='产品特点3'
        >
            { getFieldDecorator( 'featureText3', {
            rules: [{ required: true, message: '请输入产品特点3!' }],
            initialValue: editData ? editData.featureText3 : ''
          } )(
            <Input placeholder="请输入产品特点" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='描述'
        >
            { getFieldDecorator( 'featureExplain3', {
            rules: [{ required: true, message: '请输入特点3描述!' }],
            initialValue: editData ? editData.featureExplain3 : ''
          } )(
            <Input placeholder="一句话描述产品特点3" />
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
          extra="图片尺寸280*280，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
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
          className="micon-uploader-container"
          label='移动端产品图像'
          extra="图片尺寸1005*360，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
        >
            { getFieldDecorator( 'appimgurl', {
            rules: [{ required: true, validator: this.checkMPic }],
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
               onChange={this.handleMChange}
             >
              {
                 this.state.mImgUrl ?
                   <img src={this.state.mImgUrl} alt="" className="avatar" /> :
                   <Icon type="plus" className="avatar-uploader-trigger" />
               }
            </Upload>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          className="appicon-uploader-container"
          label='移动端详情内容'
          extra="大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
        >
            { getFieldDecorator( 'appImgUrl', {
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
                 this.state.appImgUrl ?
                   <img src={this.state.appImgUrl} alt="" className="avatar" /> :
                   <Icon type="plus" className="avatar-uploader-trigger" />
               }
            </Upload>
          ) }
          </FormItem>
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
  websiteManage: PropTypes.object,
  websiteManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number,
  cityCode: PropTypes.number,
  name: PropTypes.string,
  status: PropTypes.string
}

const mapStateToProps = ( state, ownProps ) => {
  const contentManage = state.get( 'contentManage' );
  const websiteManage = state.get( 'websiteManage' );
  return {
    contentManage,
    websiteManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch),
    websiteManageActions: bindActionCreators(websiteManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( ProductCard ))
