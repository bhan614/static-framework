import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Icon, Button, Select, Radio, Row, Col} from 'antd'


class RecruitCheck extends Component {
    static propTypes = {
        formValues: PropTypes.object,
        handleHide: PropTypes.func
    }

     /**
     * 弹层点击取消操作
     */
    handleModalCancel = () => {
        this.props.handleHide()
    }

    /**
     * 去除html标签
     */
    delHtmlTag = (str) => {
      return str.replace(/<[^>]+>/g, '');//去掉所有的html标记
     }

    /**
     * 时间格式转化
     */
    // timeTrans = (str) => {
    //      console.log(str)
    //      const arr =  new Date(parseInt(str)).toLocaleString().replace(/:\d{1,2}$/, ' ').split(',')[0].split('/');
    //      console.log(arr)
    //      //return arr.splice(2, 1).concat(arr).join('-')
    //      return arr.join('-')
    // }

    render() {
        const {formValues} = this.props
        const title = '查看招聘职位'
        const visible = true
        formValues.duty = this.delHtmlTag(formValues.duty)
        formValues.require = this.delHtmlTag(formValues.require)
        //formValues.createTime = this.timeTrans(formValues.createTime)
        

        return (
          <Modal
              title={'招聘详情'}
              visible={visible}
              onCancel={this.handleModalCancel}
              footer={null}
          >
            <div className="detail-container">
              <Row>
                <Col span={4}></Col>
                <Col span={4}>岗位名称:</Col>
                <Col span={16}>{formValues.recruitName || ''}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>招聘类别:</Col>
                <Col span={16}>{formValues.recruitType || ''}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>岗位类别:</Col>
                <Col span={16}>{formValues.jobName || ''}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>岗位地点:</Col>
                <Col span={16}>{formValues.cityName || ''}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>岗位职责:</Col>
                <Col span={16}>{formValues.duty || ''}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>任职要求:</Col>
                <Col span={16}>{formValues.require || ''}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>招聘状态:</Col>
                <Col span={16}>{formValues.flag === 1 ? '已生效' : '未生效'}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>创建人:</Col>
                <Col span={16}>{formValues.createName || ''}</Col>
              </Row>
              <Row>
                <Col span={4}></Col>
                <Col span={4}>创建时间:</Col>
                <Col span={16}>{formValues.createTime || ''}</Col>
              </Row>
            </div>
          </Modal>
        )
    }
}
export default RecruitCheck;


