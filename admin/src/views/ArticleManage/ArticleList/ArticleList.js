import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, Radio, Icon, Tooltip } from 'antd';
import enUS from 'antd/es/locale/en_US';
import axios from "axios";
import 'highlight.js/styles/base16/onedark.css';
import articleStyle from './ArticleList.module.scss';
import {connect} from "react-redux";
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class ArticleList extends Component{

    state = {
        columns: [
            {title: 'Article ID', dataIndex: 'id', width: '150px'},
            {title: 'Title', dataIndex: 'title', width: '250px'},
            {title: 'Summary', dataIndex: 'summary', width: '300px'},
            {title: 'Author', width: '150px', render: (text, record) => {
                    return record.user ? record.user.username : '';
                }},
            {title: 'Status', dataIndex: 'state', width: '100px', render: text => {
                    if (text === 0) {
                        return "Pending Review";
                    } else if (text === 1) {
                        return "Unsolved";
                    } else if (text === 2) {
                        return "Solved";
                    } else if (text === 3) {
                        return "Approved";
                    } else if (text === 4) {
                        return "Rejected";
                    } else if (text === 5) {
                        return "Draft";
                    }
                }},
            {title: 'Category', width: '150px', render: (text, record) => {
                    return record.category ? record.category.name : '';
                }},
            {title: 'Tags', width: '150px', render: (text, record) => {
                    return record.tags ? record.tags.map(tag => tag.name).join(', ') : '';
                }},
            {title: 'Type', dataIndex: 'type', width: '100px', render: (text, record) => {
                    if (record.type === 0) {
                        return "Blog";
                    } else {
                        return "Q&A";
                    }
                }},
            {title: 'Create Time', dataIndex: 'createTime', width: '200px'},
            {title: 'Update Time', dataIndex: 'updateTime', width: '200px'},
            {title: 'Top', dataIndex: 'top', width: '150px', render: (text, record) => {
                    if (record.top === 0) {
                        return "No";
                    } else {
                        return "Yes";
                    }
                }},
            {title: 'Official', dataIndex: 'official', width: '150px', render: (text, record) => {
                    if (record.official === 0) {
                        return "No";
                    } else {
                        return "Yes";
                    }
                }},
            {title: 'Article Essence', dataIndex: 'essence', width: '150px', render: (text, record) => {
                    if(text === 1) {
                        return "No";
                    } else if (text === 2) {
                        return "Yes";
                    }
                }},
            {title: 'Article View Count', dataIndex: 'viewNum', width: '150px'},
            {title: 'Article Collection Count', dataIndex: 'collectNum', width: '150px'},
            {title: 'Article Like Count', dataIndex: 'likeNum', width: '150px'},
            {title: 'Article Comment Count', dataIndex: 'commentNum', width: '150px'},
        ],
        tableData: [],
        paginationProps: {
            current: 1, // Current page
            pageSize: 5, // Items per page
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: function(total) {
                return `Total ${total} items`;
            },
            total: 0, // Total count
            onChange: current => this.handlePageChange(current),
            onShowSizeChange: (current, pageSize) => this.handleSizeChange(current, pageSize)
        },
        searchParams: {
            title: '',
            state: 0,
            type: 0
        },
        editModal: {
            visible: false
        },
        viewModal: {
            visible: false
        },
        article: {
            id: "",
            state: 6,
            top: 1,
            type: 1,
            official: 1,
            essence: 1
        },
        selectRows: []
    };

    // Page number change
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getArticleList();
        });
    }

    // Items per page change
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getArticleList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("Article Management/Article List");
        changeSelectKey(["5-1"]);
        changeOpenKey(["5"]);
        await this.getArticleList();
    };

    getArticleList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                title: searchParams.title,
                type: searchParams.type,
                state: searchParams.state
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/article/list', data)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    let data = resp.data.list;
                    data.forEach((e, i) => {
                        e.key = i;
                    });
                    _this.setState({tableData: data});
                    // Get pagination data
                    let page = {
                        current: resp.data.page,
                        pageSize: resp.data.size,
                        total: resp.data.total
                    };
                    _this.setState({paginationProps: page});
                }else{
                    message.error("Failed to get article data");
                }
            }).catch(function (error) {
                console.error(error);
                message.error("Failed to get article data");
            })
    }

    // Search content two-way binding implementation
    changeSearchInput(type, e){
        // type: object member  e: changed value
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.searchParams, {
            [type]: e
        });
        this.setState({
            searchParams: target
        })
    }

    // Search
    searchArticleList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getArticleList();
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.setState({selectRows: selectedRows})
        }
    };

    // Modal form content two-way binding implementation
    changeModalInput(type, e){
        // type: object member  e: changed value
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.article, {
            [type]: e
        });
        this.setState({
            article: target
        })
    }

    // Click modify confirm
    handleOk() {
        const { article } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/update', article)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    _this.setState({editModal: {visible: false}, selectRows: []});
                    _this.rowSelection.selectedRowKeys = [];
                    _this.getArticleList();
                }else{
                    message.error(resp.msg);
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to modify article information");
        })
    }


    // Delete article information
    deleteArticle() {
        const { selectRows } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        if(selectRows.length === 0) {
            message.warning("Please select at least one item to delete");
            return false;
        }
        let selectIds = [];
        selectRows.forEach( e => {
            selectIds.push(e.id);
        });
        const ids = selectIds.join(",");
        confirm({
            title: 'Confirm',
            content: 'Are you sure to delete these ' + selectRows.length + ' items?',
            okText: 'Confirm',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                axios.post(serverUrl+ '/admin/article/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchArticleList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchArticleList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("Network error, failed to delete article information");
                })
            },
            onCancel() {
            }
        });

    }

    // Open modify modal
    openEditModal() {
        const { selectRows } = this.state;
        if(selectRows.length !== 1) {
            message.warning("Please select one item to modify status");
            return false;
        }
        this.setState({article: {...selectRows[0] }, editModal: { visible: true }});
    }

    // Open view details modal
    openViewModal() {
        const { selectRows } = this.state;
        if(selectRows.length !== 1) {
            message.warning("Please select one item to view details");
            return false;
        }
        this.setState({article: {...selectRows[0] }, viewModal: { visible: true }});
    }



    render() {
        const { columns, tableData, paginationProps, searchParams, viewModal, editModal, article } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <React.Fragment>
                <Modal
                    title="View Article Details"
                    visible={viewModal.visible}
                    okText="Confirm"
                    onCancel={() => this.setState({viewModal: { visible: false }})}
                    width={700}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    maskClosable={false}
                    onOk={() => this.setState({viewModal: { visible: false }})}
                >
                    <div className="for-container">
                        <div className="for-markdown-preview">
                            <div style={{padding: '1.5rem'}}  dangerouslySetInnerHTML={{
                                __html: article.contentHtml
                            }}
                            />
                        </div>
                    </div>
                </Modal>
                <Modal
                    title="Modify Article Information"
                    visible={editModal.visible}
                    okText="Confirm"
                    cancelText="Cancel"
                    onCancel={() => this.setState({editModal: { visible: false }})}
                    maskClosable={false}
                    onOk={this.handleOk.bind(this)}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="Article Status">
                            <Select value={article.state} onChange={this.changeModalInput.bind(this, 'state')} style={{ width: '100%' }}>
                                <Option value={0}>Pending Review</Option>
                                {
                                    article.type === 2 && <Option value={1}>Unsolved</Option>
                                }
                                {
                                    article.type === 2 && <Option value={2}>Solved</Option>
                                }
                                {
                                    article.type === 1 && <Option value={3}>Approved</Option>
                                }
                                <Option value={4}>Rejected</Option>
                                <Option value={5}>Draft</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Top">
                            <Radio.Group onChange={this.changeModalInput.bind(this, 'top')} value={article.top}>
                                <Radio value={0}>No</Radio>
                                <Radio value={1}>Yes</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Official">
                            <Radio.Group onChange={this.changeModalInput.bind(this, 'official')} value={article.official}>
                                <Radio value={0}>No</Radio>
                                <Radio value={1}>Yes</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Essence">
                            <Radio.Group onChange={this.changeModalInput.bind(this, 'essence')} value={article.essence}>
                                <Radio value={1}>No</Radio>
                                <Radio value={2}>Yes</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
                <div className={articleStyle.article_button} style={{width: '100%', height: '10%'}}>
                    <Button icon="eye" className={articleStyle.view} onClick={this.openViewModal.bind(this)}>
                        View Details
                    </Button>
                    <Button type="edit" icon="edit" className={articleStyle.edit} onClick={this.openEditModal.bind(this)}>
                        Modify
                    </Button>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteArticle.bind(this)}>
                        Delete
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'title')} defaultValue={searchParams.title} value={searchParams.title} placeholder="Please enter article title" style={{width: '200px', margin: '0 10px'}} />
                    <Select defaultValue={0} style={{width: '200px', margin: '0 10px'}} onChange={this.changeSearchInput.bind(this, 'state')}>
                        <Option value={0}>All</Option>
                        <Option value={1}>Pending Review</Option>
                        <Option value={2}>Unsolved</Option>
                        <Option value={3}>Solved</Option>
                        <Option value={4}>Approved</Option>
                        <Option value={5}>Rejected</Option>
                        <Option value={6}>Draft</Option>
                    </Select>
                    <Select defaultValue={0} style={{width: '200px', margin: '0 10px'}} onChange={this.changeSearchInput.bind(this, 'type')}>
                        <Option value={0}>All</Option>
                        <Option value={1}>Blog</Option>
                        <Option value={2}>Q&A</Option>
                    </Select>
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchArticleList.bind(this)}>
                        Search
                    </Button>
                </div>
                <div style={{width: '100%', height: '90%'}}>
                    <ConfigProvider locale={enUS}>
                        <Table scroll={{ x: '100%', y: 400}} rowSelection={this.rowSelection} columns={columns} dataSource={tableData} pagination={paginationProps}/>
                    </ConfigProvider>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    menuName: state.menuName,
    selectKey: state.selectKey,
    openKey: state.openKey,
    serverUrl: state.serverUrl
});

const mapDispatchToProps = dispatch => ({
    changeName: name => dispatch({type:"changeName", name}),
    changeSelectKey: selectKey => dispatch({type:"changeSelectKey", selectKey}),
    changeOpenKey: openKey => dispatch({type:"changeOpenKey", openKey})
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
