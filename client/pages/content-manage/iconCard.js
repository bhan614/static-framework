import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
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

class IconCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData && props.editData.iconUrl || '',
      imgWidth: '',
      imgHeight: '',
      status: props.editData && props.editData.status.toString() || '1',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
  }

  componentDidMount() {
    this.props.contentManageActions.getIconNumber();
    this.props.contentManageActions.getCityAddedSelectList();
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, cityCode, name, status} = this.props;
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
        values.imgUrl = this.state.imgUrl;
        appActions.loading(true).then(() => {
          return contentManageActions.addIcon({
            id,
            ...values
          })
          .then(() => {
            return Promise.all([
              contentManageActions.getIconList({
                pageNum,
                pageSize,
                cityCode,
                name,
                status
              }),
              contentManageActions.getIconNumber()
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
    const iconSort = contentManage && contentManage.get('iconSort') && contentManage.get('iconSort');
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
    if (iconSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }

  checkTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入Icon标题');
      return;
    }
    if (value.length > 6) {
      callback('超过6个字');
      return;
    }
    callback();
  }

  checkPic(rule, value, callback) {
    const { editData } = this.props;
    const { imgUrl, imgWidth, imgHeight } = this.state;
    if (imgUrl === '') {
      callback('请上传图标');
      return;
    }

    if (imgWidth !== 150 && imgHeight !== 150 && imgWidth !== '' && imgHeight !== '') {
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

  handleStateChange(e) {
    this.setState({ status: e.target.value })
  }

  getArea() {
    return () => document.getElementById('iconCard-area')
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
        title={editData ? '编辑Icon' : '新增Icon'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id="iconCard-area">
          <FormItem
          {...formItemLayout}
          label='城市'
          >
            { getFieldDecorator( 'cityName', {
              rules: [{ required: true, message: '请选择分类' }],
              initialValue: editData && editData.cityName ? editData.cityName : firstCity
            } )(
              <Select disabled={editData} getPopupContainer={this.getArea()}>
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
          label='Icon标题'
        >
            { getFieldDecorator( 'name', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: editData ? editData.name : ''
          } )(
            <Input placeholder="不超过6个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='图标'
          extra="图片尺寸150*150，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
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
          label='跳转链接'
        >
            { getFieldDecorator( 'url', {
            rules: [{ required: true, message: '请输入跳转链接!' }],
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
            <Input placeholder="请输入正整数,数字越小,在前端先展示" disabled={this.state.status === '0'} />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='Icon状态'
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

IconCard.propTypes = {
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
  status: PropTypes.string
}

const mapStateToProps = ( state, ownProps ) => {
  const contentManage = state.get( 'contentManage' );
  console.log(contentManage);
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( IconCard ))
