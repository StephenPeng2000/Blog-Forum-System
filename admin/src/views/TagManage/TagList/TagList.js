import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, InputNumber, Icon, Tooltip } from 'antd';
import enUS from 'antd/es/locale/en_US';
import event from "../../../event";
import axios from "axios";
import tagStyle from './TagList.module.scss';
import {connect} from "react-redux";
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class TagList extends Component{

    state = {
        columns: [
            {title: 'Tag ID', dataIndex: 'id', width: '150px'},
            {title: 'Tag Name', dataIndex: 'name', width: '150px'}
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
            name: ''
        },
        modal: {
            visible: false,
            title: ""
        },
        tag: {
            id: "",
            name: ""
        },
        selectRows: []
    };

    // Page number change
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getTagList();
        });
    }

    // Items per page change
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getTagList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("Tag Management/Tag List");
        changeSelectKey(["4-1"]);
        changeOpenKey(["4"]);
        await this.getTagList();
    };

    getTagList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                name: searchParams.name
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/tag/list', data)
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
                    message.error("Failed to get tag data");
                }
            }).catch(function (error) {
                console.error(error);
                message.error("Failed to get tag data");
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
    searchTagList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getTagList();
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.setState({selectRows: selectedRows})
        }
    };

    // Open add modal
    openAddModal() {
        this.setState({tag: { }, modal: {visible: true, title: "Add Tag"}});
    }

    // Modal form content two-way binding implementation
    changeModalInput(type, e){
        // type: object member  e: changed value
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.tag, {
            [type]: e
        });
        this.setState({
            tag: target
        })
    }

    // Click confirm
    handleOk() {
        const { tag } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/tag/save', tag)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    _this.setState({modal: {visible: false}, selectRows: []});
                    _this.rowSelection.selectedRowKeys = [];
                    _this.getTagList();
                }else{
                    message.error(resp.msg);
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to save tag");
        })
    }


    // Delete tag
    deleteTag() {
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
                axios.post(serverUrl+ '/admin/tag/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchTagList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchTagList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("Network error, failed to delete tag");
                })
            },
            onCancel() {
            }
        });

    }

    // Open edit modal
    openEditModal() {
        const { selectRows } = this.state;
        if(selectRows.length !== 1) {
            message.warning("Please select one item to edit")
            return false;
        }
        this.setState({tag: {...selectRows[0] }, modal: {visible: true, title: "Edit Tag"}});
    }



    render() {
        const { columns, tableData, paginationProps, searchParams, modal, tag } = this.state;
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
                    title={modal.title}
                    visible={modal.visible}
                    okText="Confirm"
                    cancelText="Cancel"
                    maskClosable={false}
                    onOk={this.handleOk.bind(this)}
                    onCancel={() => this.setState({modal: {visible: false}})}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="Tag Name">
                            <Input placeholder="Please enter tag name" onChange={this.changeModalInput.bind(this, 'name')} defaultValue={tag.name} value={tag.name}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <div className={tagStyle.tag_button} style={{width: '100%', height: '10%'}}>
                    <Button icon="plus" className={tagStyle.add} onClick={this.openAddModal.bind(this)}>
                        Add
                    </Button>
                    <Button type="edit" icon="edit" className={tagStyle.edit} onClick={this.openEditModal.bind(this)}>
                        Edit
                    </Button>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteTag.bind(this)}>
                        Delete
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'name')} defaultValue={searchParams.name} value={searchParams.name} placeholder="Please enter tag name" style={{width: '200px', margin: '0 10px'}} />
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchTagList.bind(this)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(TagList);
