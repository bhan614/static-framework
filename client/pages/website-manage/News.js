import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import { Table, Menu, Popconfirm, message, Button, Icon, Layout, Input, Form, Row, Col, Radio, Select, Modal } from 'antd'

import actions from './action'
import { format } from 'url'
import '../../styles/common.less'
import NewsCard from './NewsCard'
import NewsCheckDetail from './NewsCheckDetail'
import NewsPreCheck from './NewsPreCheck'

const { Content } = Layout
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const typeMap = [{id: 1, name: '公司动态'}, {id: 2, name: '人物专访'}]


class News extends Component {
    static propTypes = {
        actions: PropTypes.object,
        form: PropTypes.object,
        location: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
        websiteManage: PropTypes.object.isRequired
    }

    constructor (props) {
        super(props)
        const { pageSize = 10, pageNum = 1, title, type} = this.props.location.query

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
        this.handleModalChange = this.handleModalChange.bind(this);

        this.state = {
            pageSize: Number(pageSize),
            pageNum: pageNum || 1,
            formData: {
                title: title || '',
                type: type || '全部'
            },
            //index: null,
            formType: 'add',
            formValues: null,
            formVisible: false,
            //noPermission: false,
            modalVisible: false,
            modalDetail: null,
            //flag: 0
            checkShow: false,
            checkValues: null
        }

        this.columns = [{
            title: '序号',
            //width: 80,
            dataIndex: 'tableNums',
            key: 'tableNums',
            className: 'textAlign'
        }, {
            title: '资讯标题',
            //width: 120,
            dataIndex: 'title',
            key: 'title',
            className: 'textAlign',
            render: (value, record) => {
                const location = window.location.origin.replace('8888', '8901')
                return  <a href={`${location}/news/newsPreview?id=${record.id}`} target="view_window">{value}</a>
            }
        }, {
            title: '封面图片',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            className: 'textAlign',
            render: (value) => {
                return <img src={value} width='100' height='50' />
            }
        },
        {
            title: '资讯类别',
            //width: 120,
            dataIndex: 'type',
            key: 'type',
            className: 'textAlign'
        }, {
            title: '资讯状态',
            //width: 120,
            dataIndex: 'flag',
            key: 'flag',
            className: 'textAlign',
            render: (value) => {
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
            key: 'updateName',
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
                    self.handleNewsDelete(record, index)
                }

                const location = window.location.origin.replace('8888', '8901')

                return (
                  <span>
                    {/* <a href={`${location}/news/credit`} target="view_window">预览</a> */}
                    <a href='#' onClick={handleEdit}>编辑</a>
                    <span className='ant-divider' />
                    <a  href={`${location}/news/newsPreview?id=${record.id}`} target="view_window">预览</a>
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
        const { title, type } = formData
        this.props.form.setFieldsValue({title, type})
        this.getNewsList(true)
        //actions.getJobName(type)
    }

    /**
     * 页面初始化时候获取新闻列表
     */
    getNewsList = (first) => {
        const {pageSize, pageNum, formData} = this.state
        const {actions, router} = this.props
        Object.keys(formData).forEach((key) => {
            if (formData[key] === '全部') {
                formData[key] = ''
            }
        })
        actions.getNewsList({
            pageSize, pageNum,  ...formData
        }).then(json => {
            //const currentPage = json.data && json.data.currentPage
            // this.setState({
            //     pageNum: currentPage
            // })
            if (!first) {
                router.push({
                    pathname: '/Website/News',
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
        }, this.getNewsList)
}

    /**
      * 添加新闻项
      * @param e
      */

     handleNewsAdd = (e) => {
        this.setState({
            formType: 'add',
            formValues: null,
            formVisible: true
        })
    }

     /**
       * 编辑新闻项
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
     * 修改新闻状态
     */
    handleChangeStatus = (formValues, index) => {
        const {actions} = this.props
        if (formValues.flag === 0) {
            formValues.flag = 1
        } else {
            formValues.flag = 0
        }
        actions.postAddNews(formValues).then(res => {
            message.success('修改新闻状态成功')
            this.getNewsList()
        }).catch(err => {
            if (typeof err.msg === 'object') {
                message.error(err.msg.message)
            } else {
                message.error(err.msg)
            }
        })
    }

    /**
     * 点击查看弹出新闻信息modal框
     */

    handleCheck = (formValues, index) => {
        this.setState({
            //index,
            modalVisible: true,
            formValues
        })
    }

    /**
     * 点击删除此条新闻信息
     */

    handleNewsDelete = (formValues, index) => {
        const {actions} = this.props
        actions.postDeleteNews(formValues).then(data => {
            message.success('删除成功')
            this.getNewsList()
        }).catch(err => {
            message.error(err.msg)
        })
    }

    /**
     * 处理重置
     */
    handleReset = () => {
        this.props.form.resetFields()
        this.setState({formData: {}, pageNum: 1}, () => {
            this.getNewsList()
        })
    }

    /**
       * 通过key从对象中取到value的函数方法
       */
      findKey = (value, compare = (a, b) => a === b) => {
        return Object.keys().find(k => compare([k], value))
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
                //这里需要放置处理values里面获取select的值转化为真实值的逻辑，类似下面这样？？？？？？？
                //values.riskRate = values.riskRate ? this.findKey(values.riskRate) : ''
                this.setState({formData: values, pageNum: 1}, () => {
                    this.getNewsList()
                })
            }
        })
    }

    /**
     * 将新增和修改新闻的弹出框隐藏起来
     */

     handleHideFormModal = () => {
         this.setState({
            formVisible: false
         })
     }

     /**
      * 将查看新闻的弹出框隐藏起来
      */

      handleHideModal = (fields) => {
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
        //这里需要判断formtype类型是add还是edit
        actions.postAddNews(fields).then(res => {
            this.handleHideFormModal()
            this.getNewsList()
            message.success('添加新闻成功')
        }).catch(err => {
            if (typeof err.msg === 'object') {
                message.error(err.msg.errors.name.message)
            } else {
                message.error(err.msg)
            }
        })
    }

    /**
     * 处理预览窗口出现
     */

    handleCheckModalShow = (fields) => {
        console.log(fields)
        //console.log(this.state)
        this.setState({
            checkShow: true,
            checkValues: fields
        })
        // setTimeout(() => {
        //     console.log(11111)
        //     this.getNewsList()
        // }, 0)
    }

    handleModalChange() {
      this.setState({formVisible: false})
    }

    /**
     * 处理预览窗口隐藏
     */

    handleHidePreCheck = (fields) => {
        this.setState({
            checkShow: false,
            formType: 'add',
            formValues: fields,
            formVisible: true
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

    render() {
        const formItemLayout = {
           labelCol: { span: 6},
           wrapperCol: {span: 16}
        }
        const suffix = <Icon type="down" />
        const {websiteManage, router, actions } = this.props
        //在这写一些获取拿到的招聘数据列表的逻辑
        const newsListMap = websiteManage && websiteManage.get('newsList') && websiteManage.get('newsList').toJS() || ''
        const newsList = newsListMap.list || ''
        //console.log(newsList)
        //const length = newsList.length || ''
        const totalCount = newsListMap.totalCount
        //const totalCount = newsListMap.totalCount
        const dataList = newsList ? Array.from(newsList).map((item, index) => {
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
                //productType: '5'
               //pageFlag: true
                 })
                 this.setState({
                 pageNum: page,
                 pageSize
                 })
                 router.push({
                    pathname: '/Website/News',
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
                        <Col span={8}>
                          <FormItem {...formItemLayout} label='资讯标题'>
                            { getFieldDecorator('title')(
                              <Input placeholder='请输入资讯标题' />
                                           ) }
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem {...formItemLayout} label='资讯类别'>
                            { getFieldDecorator('type', {
                                          })(
                                            <Select
                                                //mode='combobox'
                                                //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{width: '100%'}}
                                                placeholder='请选择'
                                                //defaultValue='全部'
                                                //onchange={this.handleChange}
                                                //suffix={suffix}
                                               >
                                              <Option  value='全部'>全部</Option>
                                              {this.renderOptipons(typeMap)}
                                            </Select>
                                           ) }
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem >
                            <Button type='primary' size='default' htmlType='submit' className='btn1 btn-search'>查询</Button>
                            <Button type='primary' size='default' htmlType='reset' onClick={this.handleReset}>重置</Button>
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Content>
                <Button type='primary' onClick={this.handleNewsAdd}><Icon type='folder-add' />+新增</Button>
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
                    this.state.formVisible && <NewsCard
                        formType={this.state.formType}
                        formValues={this.state.formValues}
                        modalVisible={this.state.formVisible}
                        modalChange={this.handleModalChange}
                        formData={this.state.formData}
                        pageSize={this.state.pageSize}
                        pageNum={this.state.pageNum}
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
})(Form.create()(News))
