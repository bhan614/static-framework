import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message, Spin } from 'antd'
import {imageRule} from '../../utils/perfect'

class NewsUploadImg extends Component {

    static propTypes = {
        change: PropTypes.func,
        formValues: PropTypes.object,
        formType: PropTypes.string
    }

    state = {
        previewVisible: false,
        previewImage: '',
        text: '上传图片',
        fileList: [],
        img: '',
        rotateDeg: 0,
        uploading: false,
      }

      handleCancel = () => this.setState({ previewVisible: false })

      beforeUpload = (file) => {
        const error = imageRule(file, [2, 3]);
        if ( error !== '') {
          message.error(`图片-${error.name}格式错误：${error.msg}`);
          return false;
        }
        this.setState({uploading: true});
        return true;
      }
    
      handleChange = ({file}) => {
        this.props.change(file, (imageUrl) => {
          file.url = imageUrl;
          this.setState({uploading: false});
        });
      }

      render() {
        const { previewVisible, uploading } = this.state
        const {formValues, formType} = this.props

        return (
          <div className="clearfix">
            <Spin spinning={uploading}>
              <Upload
                  className="avatar-uploader"
                  name="uploadFiles"
                  data={{key: 'PQMWB4F!7952UV&H'}}
                  showUploadList={false}
                  action=""
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
              >
                <Icon type="plus" className="avatar-uploader-trigger" />
                {/* {
                  formType === 'edit' ? (
                    <img src={formValues.imgUrl} alt="" className="avatar" />
                    ) : ''
                } */}
              </Upload>
            </Spin>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="预览" style={{ width: '100%' }} src='#'/>
            </Modal>
          </div>
        )
      }
}
export default NewsUploadImg

