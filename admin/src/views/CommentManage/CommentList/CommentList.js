import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, InputNumber, Icon, Tooltip } from 'antd';
import enUS from 'antd/es/locale/en_US';
import axios from "axios";
import commentStyle from './CommentList.module.scss';
import {connect} from "react-redux";
const { confirm } = Modal;
class CommentList extends Component{

    state = {
        columns: [
            {title: 'Comment ID', dataIndex: 'id', width: '150px'},
            {title: 'Comment Content', dataIndex: 'content', width: '300px'},
            {title: 'Commenter', width: '150px', render: (text, record) => {
                    return record.user ? record.user.username : '';
                }},
            {title: 'Reply To', width: '150px', render: (text, record) => {
                    return record.replyUser ? record.replyUser.username : '';
                }},
            {title: 'Article', width: '250px', render: (text, record) => {
                    return record.article ? record.article.title : '';
                }},
            {title: 'Type', width: '100px', dataIndex: 'type', render: (text, record) => {
                    if (record.type === 0) {
                        return 'Comment'
                    } else {
                        return 'Reply'
                    }
                }},
            {title: 'Accepted', width: '100px', dataIndex: 'pick', render: (text, record) => {
                    if (record.pick === 0) {
                        return 'No'
                    } else {
                        return 'Yes'
                    }
                }},
            {title: 'Create Time', dataIndex: 'createTime', width: '200px'},
        ],
        tableData: [],
        paginationProps: {
            current: 1, // Current page
            pageSize: 5, // Items per page
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => {
                return `Total ${total} items`;
            },
            total: 0, // Total count
            onChange: current => this.handlePageChange(current),
            onShowSizeChange: (current, pageSize) => this.handleSizeChange(current, pageSize)
        },
        searchParams: {
            content: ''
        },
        selectRows: []
    };

    // Page number change
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCommentList();
        });
    }

    // Items per page change
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCommentList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("Comment Management/Comment List");
        changeSelectKey(["6-1"]);
        changeOpenKey(["6"]);
        await this.getCommentList();
    };

    getCommentList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                content: searchParams.content
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/comment/list', data)
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
                    message.error("Failed to get comment data");
                }
            }).catch(function (error) {
                console.error(error);
                message.error("Failed to get comment data");
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
    searchCommentList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getCommentList();
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.setState({selectRows: selectedRows})
        }
    };



    // Delete comment information
    deleteComment() {
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
                axios.post(serverUrl+ '/admin/comment/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCommentList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCommentList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("Network error, failed to delete comment");
                })
            },
            onCancel() {
            }
        });

    }



    render() {
        const { columns, tableData, paginationProps, searchParams } = this.state;

        return (
            <React.Fragment>
                <div style={{width: '100%', height: '10%'}}>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteComment.bind(this)}>
                        Delete
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'content')} defaultValue={searchParams.content} value={searchParams.content} placeholder="Please enter comment content" style={{width: '200px', margin: '0 10px'}} />
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchCommentList.bind(this)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
