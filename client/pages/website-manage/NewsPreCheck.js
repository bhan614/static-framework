import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Icon, Button, Select, Radio, Upload} from 'antd'

const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const { TextArea } = Input
const RadioGroup = Radio.Group

export class NewsPreCheck extends Component {
    static propTypes = {
        checkValues: PropTypes.object,
        form: PropTypes.object,
        handleHidePreCheck: PropTypes.func
    }

     /**
     * 弹层点击取消操作
     */
    handleFormCancel = () => {
        this.props.handleHidePreCheck(this.props.checkValues)
    }

 render() {
        const { getFieldDecorator } = this.props.form;
        const {checkValues} = this.props
        const title = '查看新闻'
        const visible = true

        return (
          <div>
            <Modal closable={false}
                     title={title}
                     visible={visible}
                    //  onOk={this.handleFormOk}
                    //  onCancel={this.handleFormCancel}>
                     footer={<Button type='primary' size='default' onClick={this.handleFormCancel} >确定</Button>}>
              <div className='root'>
                <div className='artical'>
                  <header>
                    <h2>{checkValues.title || ''}</h2>
                    <div className='message-source'>
                      <p className='source-time'>
                        <span>消息来源:</span>
                        <span>{checkValues.source || ''}</span>
                        <span></span>
                        <span>{checkValues.updateTime || ''}</span>
                      </p>
                    </div>
                  </header>
                  <content className='artical'>
                    <div className='artical-wrapper'> 
                      <div className='img-wrapper'>
                        <span>
                          <img src='checkValues.imgUrl'/>
                        </span>
                      </div>
                      <div className='content-wrapper'>
                        <div>
                          <p>{checkValues.content || ''}</p>
                        </div>
                      </div>
                    </div>
                  </content> 
                </div>        
              </div>            
            </Modal>
          </div>
        )
    }
}
export default createForm()(NewsPreCheck)

