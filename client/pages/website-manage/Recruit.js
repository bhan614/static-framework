import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import { Table, Menu, Popconfirm, message, Button, Icon, Layout, Input, Form, Row, Col, Radio, Select, Modal } from 'antd'

import actions from './action'
import { format } from 'url'
import '../../styles/common.less'
import '../../styles/dispear.less'
//import RecruitForm from './RecruitForm'
import RecruitCheck from './RecruitCheck'
import RecruitForm from './RecruitForm'

const { Content } = Layout
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const cityMap = [{id: 1, name: '北京' }, {id: 2, name: '上海' }, {id: 3, name: '成都' },
                 {id: 4, name: '重庆' }, {id: 5, name: '深圳' },
                 {id: 6, name: '厦门' }, {id: 7, name: '广州' },
                 {id: 8, name: '武汉'}, {id: 9, name: '长沙'}, {id: 10, name: '西安'},
                 {id: 11, name: '合肥'}, {id: 12, name: '天津'}, {id: 13, name: '燕郊' },
                 {id: 14, name: '青岛' }, {id: 15, name: '济南' }, {id: 16, name: '沈阳'},
                 {id: 17, name: '大连' }, {id: 18, name: '杭州' }, {id: 19, name: '无锡' },
                 {id: 20, name: '南京' }]
const recruitMap = [{id: 1, name: '社会招聘'}, {id: 2, name: '校园招聘'}]

export class Recruit extends Component {
    static propTypes = {
        actions: PropTypes.object,
        form: PropTypes.object,
        location: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
        websiteManage: PropTypes.object.isRequired
    }

    constructor (props) {
        super(props)
        //let {jobType} = this.props.location.query
        const { pageSize = 10, pageNum = 1, recruitName, jobType, recruitType, cityName} = this.props.location.query
        //console.log(this.jobNameList)


        //操作人信息
        this.userInfo = {}
        if (window.INIT_DATA && window.INIT_DATA.USER_INFO) {
           //***测试环境之后要修改***//
           this.userInfo.updateStaff = window.INIT_DATA.USER_INFO.name || ''
           this.userInfo.updateStaffId = window.INIT_DATA.USER_INFO.usercode || ''
        } else {
           this.userInfo.updateStaff = ''
           this.userInfo.updateStaffId = ''
        }

        this.state = {
            pageSize: Number(pageSize) || 10,
            pageNum: pageNum || 1,
            formData: {
                recruitName: recruitName || '',
                recruitType: recruitType || '全部',
                jobType: jobType || '全部',
                cityName: cityName || '全部'
            },
            //index: null,
            formType: 'add',
            formValues: null,
            formVisible: false,
            //noPermission: false,
            modalVisible: false,
            modalDetail: null,
            //flag: 0
        }

        this.columns = [{
            title: '序号',
            //width: 80,
            dataIndex: 'tableNums',
            key: 'tableNums',
            className: 'textAlign'
        }, {
            title: '招聘岗位',
            //width: 120,
            dataIndex: 'recruitName',
            key: 'recruitName',
            className: 'textAlign'
        }, {
            title: '招聘类别',
            //width: 120,
            dataIndex: 'recruitType',
            key: 'recruitType',
            className: 'textAlign'
        }, {
            title: '岗位类别',
            //width: 120,
            dataIndex: 'jobName',
            key: 'jobName',
            className: 'textAlign'
        }, {
            title: '岗位地点',
            //width: 120,
            dataIndex: 'cityName',
            key: 'cityName',
            className: 'textAlign'
        }, {
            title: '岗位状态',
            //width: 120,
            dataIndex: 'flag',
            key: 'flag',
            className: 'textAlign',
            render: (value) => {
                //return value === 0 ? <Radio defaultChecked='false' disabled='true'>未生效</Radio> : <Radio defaultChecked='true' disabled='true'>生效</Radio>
               return value === 0 ? <div><span className='icon-dianno'></span><span>未生效</span></div> : <div><span className='icon-dian'></span><span>生效</span></div>
            }
        }, {
            title: '修改时间',
            //width: 120,
            dataIndex: 'updateTime',
            key: 'updateTime',
            className: 'textAlign'
        }, {
            title: '修改人',
            //width: 120,
            dataIndex: 'updateName',
            key: 'updater',
            className: 'textAlign'
        }, {
            title: '操作',
            render: (text, record, index) => {
                const self = this
                function handleEdit() {
                    self.handleEdit(record, index)
                }
                function handleCheck() {
                    self.handleCheck(record, index)
                }
                function handleChangeStatus() {
                    self.handleChangeStatus(record, index)
                }
                function handleDelete() {
                    self.handleDelete(record, index)
                }

                return (
                  <span>
                    <a href='#' onClick={handleEdit}>编辑</a>
                    <span className='ant-divider' />
                    <a href='#' onClick={handleCheck}>查看</a>
                    <span className='ant-divider' />
                    <a href='#' onClick={handleChangeStatus}>修改状态</a>
                    <span className='ant-divider' />
                    <Popconfirm title="确定删除此分类么?" onConfirm={handleDelete} >
                      <a href="#">删除</a>
                    </Popconfirm>
                  </span>
                )
            }
        }]
    }


    componentDidMount () {
        const {actions} = this.props
        const {formData} = this.state
        //这里需要将select框转化成为其value
        const {recruitName, recruitType, jobType, cityName} = formData
        this.props.form.setFieldsValue({recruitName, recruitType, jobType, cityName})
        //console.log(22222)
        this.getRecruitList(true)
        actions.getJobName({type: 2})
    }

    // componentWillUpdate () {
    //     console.log(33333)
    // }

    // componentDidUpdate () {
    //     console.log(444444)
    // }

    /**
     * 页面初始化时候获取招聘列表
     */
    getRecruitList = (first) => {
        const {pageSize, pageNum, formData} = this.state
        const {actions, router} = this.props
        //formdata.cityName === '全国' ? null : formdata.cityName
        if (formData.cityName === '全部') {
            formData.cityName = null
        }
        Object.keys(formData).forEach((key) => {
            if (formData[key] === '全部') {
                formData[key] = ''
            }
        })
        actions.getRecruitmentList({
            pageSize, pageNum,  ...formData
        }).then(json => {
            //const currentPage = json.data && json.data.currentPage
            // this.setState({
            //     pageNum: currentPage
            // })
            if (!first) {
                router.push({
                    pathname: '/Website/Recruit',
                    query: {pageNum, pageSize, ...formData}
                })
            }
        }).catch((err) => {
            if (err) {
                message.error(err.message || err.msg || '查询出错', 3)
            }
        })
    }

    /**
     * 处理页面pageSize变化时的回调函数
     */

    onShowSizeChange = (current, pageSize) => {
            console.log(pageSize)
            this.setState({
                pageSize: Number(pageSize)
            }, this.getRecruitList)
    }

    /**
      * 添加招聘项
      * @param e
      */

     handleRecruitmentAdd = (e) => {
        this.setState({
            formType: 'add',
            formValues: null,
            formVisible: true
        })
    }

     /**
       * 编辑招聘信息
       */

      handleEdit = (formValues, index) => {
        this.setState({
            //index,
            formType: 'edit',
            formVisible: true,
            formValues
        })
    }

    /**
     * 修改招聘状态  这里有问题
     */
    handleChangeStatus = (formValues, index) => {
        const {actions} = this.props
        if (formValues.flag === 0) {
            formValues.flag = 1
        } else {
            formValues.flag = 0
        }
        actions.postAddRecruit(formValues).then(res => {
            message.success('修改招聘状态成功')
            this.getRecruitList()
        }).catch(err => {
            if (typeof err.msg === 'object') {
                message.error(err.msg.message)
            } else {
                message.error(err.msg)
            }
        })
    }

    /**
     * 点击查看弹出招聘信息modal框
     */

    handleCheck = (formValues, index) => {
        //console.log(formValues)
        this.setState({
            //index,
            modalVisible: true,
            formValues
        })
    }

    /**
     * 点击删除此条招聘信息
     */

    handleDelete = (formValues, index) => {
        const {actions} = this.props
        actions.postRecruitDelete(
            formValues
        ).then(data => {
            message.success('删除成功')
            this.getRecruitList()
        }).catch(err => {
            if (typeof err.msg === 'object') {
                message.error(err.msg.message)
            } else {
                message.error(err.msg)
            }
        })
    }

    /**
     * 处理重置
     */
    handleReset = () => {
        this.props.form.resetFields()
        this.setState({formData: {}, pageNum: 1}, () => {
            this.getRecruitList()
        })
    }

    /**
       * 通过key从对象中取到value的函数方法
       */
      findKey = (value, compare = (a, b) => a === b) => {
          return this.jobNameList.map(item => {
              return Object.keys(item).find(k => compare([k], value))
          })
       // return Object.keys(this.jobNameList).find(k => compare([k], value))
      }

       /**
     * 处理搜索提交逻辑
     */
    handleSearchSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Object.keys(values).forEach((key) => {
                    if (values[key] === '全部') {
                        values[key] = ''
                    }
                    values[key] = values[key] && values[key].trim()
                })
                //这里需要放置处理values里面获取select的值转化为真实值的逻辑，类似下面这样
                //values.riskRate = values.riskRate ? this.findKey(values.riskRate) : ''
                if (values.jobType) {
                    this.jobNameList.forEach(item => {
                        if (item.name === values.jobType) {
                            values.jobType = item.code
                        }
                    })
                }
                this.setState({formData: values, pageNum: 1}, () => {
                    this.getRecruitList()
                })
            }
        })
    }

    /**
     * 将弹出框隐藏起来
     */

     handleHideFormModal = () => {
         this.setState({
            formVisible: false
         })
     }

     /**
      * 将查看招聘信息弹出框隐藏起来
      */

      handleHideModal = () => {
          this.setState({
              modalVisible: false
          })
      }

    /**
      * 提交表单
      * @param formdata
      */

     handleSubmit = (fields) => {
        const {actions} = this.props
         //console.log(fields)
        //这里需要判断formtype类型是add还是edit
        Object.keys(fields).forEach((key) => {
            if (fields[key] === '全部') {
                fields[key] = ''
            }
            //fields[key] = fields[key] && fields[key].trim()
        })
        //这里需要放置处理values里面获取select的值转化为真实值的逻辑，类似下面这样
        //values.riskRate = values.riskRate ? this.findKey(values.riskRate) : ''
        if (fields.jobType) {
            this.jobNameList.forEach(item => {
                if (item.name === fields.jobType) {
                    fields.jobType = item.code
                }
            })
        }
        actions.postAddRecruit(fields).then(data => {
            this.handleHideFormModal()
            this.getRecruitList()
            message.success('添加招聘信息成功')
        }).catch(err => {
            if (typeof err.msg === 'object') {
                message.error(err.msg.message)
            } else {
                message.error(err.msg)
            }
        })
    }

    /**
     * 渲染select的options，当然这里不止一个select输入框，所以需要把它封装一下，弄成传参的形式
     */

    renderOptipons = (optionMap) => {
        return (optionMap || []).map(item => {
            return <Option key={item.id} value={item.name}>{item.name}</Option>
        })
    }

    /**
     * 当select选择以后的回调
     */

    handleSelect = (e) => {
       //console.log(e)
       this.jobNameList.forEach(item => {
           if (item.name === e) {
               e = item.code
           }
       })
       //e = this.findKey(e)
       //console.log(e)
     }

    render() {
        const formItemLayout = {
           labelCol: { span: 6},
           wrapperCol: {span: 16}
        }
        const suffix = <Icon type="down" />
        const {websiteManage, router, actions } = this.props
        //在这写一些获取拿到的招聘数据列表的逻辑
        const recruitListMap = websiteManage && websiteManage.get('recruitList1') && websiteManage.get('recruitList1').toJS() || ''
        const recruitList = recruitListMap.list || ''
        const totalCount = recruitListMap.totalCount
        this.jobNameList = websiteManage && websiteManage.get('jobNameList') && websiteManage.get('jobNameList').toJS() || ''
        const dataList = recruitList ? Array.from(recruitList).map((item, index) => {
            item.tableNums = index + 1
            item.key = index + 1
            return item
        }) : []
        const { getFieldDecorator } = this.props.form


        //配置分页器
        const pagination = {
            current: Number(this.state.pageNum),
            total: totalCount,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            showQuickJumper: true,
           // pageSizeOptions: [`${tool.pageSize}`],
            onChange: (page, pageSize) => {
              //console.log(page, pageSize)
                const queryObj = Object.assign(this.state.formData, {
                pageSize: this.state.pageSize,
                pageNum: page,
               // productType: '5'
               //pageFlag: true
                 })
                 this.setState({
                 pageNum: page,
                 pageSize
                 })
                 router.push({
                    pathname: '/Website/Recruit',
                    query: queryObj
                 })
                 //queryObj.URL = 'orderQuery'
                 this.getRecruitList()

            },
            style: {
              float: 'none',
              display: 'flex',
              justifyContent: 'center'
            }
        }

        return (
          <div>
            {
              <div>
                <Content className={'search-form'}>
                  <div className='base-inner-search'>
                    <Form onSubmit={this.handleSearchSubmit} autoComplete='off'>
                      <Row className='mar'>
                        <Col span={6}>
                          <FormItem {...formItemLayout} label='招聘岗位'>
                            { getFieldDecorator('recruitName')(
                              <Input placeholder='请输入要招聘的岗位' />
                                           ) }
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem {...formItemLayout} label='招聘类别'>
                            { getFieldDecorator('recruitType', {
                                //initialValue: '全部'
                                          })(
                                            <Select
                                                //mode='combobox'
                                                //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{width: '100%'}}
                                                placeholder='请选择'
                                                //onchange={this.handleChange}
                                               >
                                              <Option  value='全部'>全部</Option>
                                              {this.renderOptipons(recruitMap)}
                                            </Select>
                                           ) }
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem {...formItemLayout} label='岗位类别'>
                            { getFieldDecorator('jobType', {
                                //initialValue: '全部'
                                          })(
                                            <Select
                                                //mode="multiple"
                                                style={{width: '100%'}}
                                                placeholder='请选择'
                                                //defaultValue='全部'
                                                //onChange={this.handleChange}
                                              >
                                              <Option value='全部'>全部</Option>
                                              {this.renderOptipons(this.jobNameList)}
                                            </Select>
                              )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem {...formItemLayout} label='岗位地点'>
                            { getFieldDecorator('cityName', {
                                    //initialValue: '全部'
                                          })(
                                            <Select
                                                //mode='combobox'
                                                //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{width: '100%'}}
                                                placeholder='请选择'
                                                //optionFilterProp="children"
                                                //notFoundContent="无法找到"
                                                //onchange={this.handleChange}
                                                //suffix={suffix}
                                               >
                                              <Option  value='全部'>全部</Option>
                                              {this.renderOptipons(cityMap)}
                                            </Select>
                                           ) }
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                          <Button type='primary' size='default' htmlType='submit' className='btn1 btn-search'>查询</Button>
                          <Button type='primary' size='default' htmlType='reset' onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Content>
                <Button  type='primary' onClick={this.handleRecruitmentAdd}><Icon type='folder-add' />+新增</Button>
                {/* <Button  type='primary' onClick={this.handleRecruitmentAdd}><Icon type='folder-add' />+新增</Button> */}
                <div className='count'>共{totalCount}条</div>
                <Table
                       key={this.renderRowKey}
                       rowKey={this.renderRowKey}
                       columns={this.columns}
                       dataSource={dataList}
                       className='mt20'
                       pagination={pagination}
                     />
                {
                    this.state.formVisible && <RecruitForm
                        formType={this.state.formType}
                        formValues={this.state.formValues}
                        handleHide={this.handleHideFormModal}
                        handleOK={this.handleSubmit}
                        jobNameList={this.jobNameList}
                    />
                }
                {
                    this.state.modalVisible && <RecruitCheck
                        //formType={this.state.formType}
                        formValues={this.state.formValues}
                        handleHide={this.handleHideModal}
                        //jobNameList={this.jobNameList}
                        //handleOK={this.handleSubmit}
                    />
                }
              </div>
                }
          </div>
        )
    }
}
export default connect((state) => {
    return {
        websiteManage: state.get('websiteManage')
    }
}, dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
})(Form.create()(Recruit))
