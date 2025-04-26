import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, InputNumber, Icon, Tooltip } from 'antd';
import enUS from 'antd/es/locale/en_US';
import event from "../../../event";
import axios from "axios";
import categoryStyle from './CategoryList.module.scss';
import {connect} from "react-redux";
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class CategoryList extends Component{

    state = {
        columns: [
            {title: 'Category ID', dataIndex: 'id', width: '150px'},
            {title: 'Category Name', dataIndex: 'name', width: '150px'},
            {title: 'Sort Order', dataIndex: 'sort', width: '150px'},
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
            name: ''
        },
        modal: {
            visible: false,
            title: ""
        },
        category: {
            id: "",
            name: "",
            sort: 0
        },
        selectRows: []
    };

    // Page number change
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCategoryList();
        });
    }

    // Items per page change
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCategoryList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("Category Management/Category List");
        changeSelectKey(["3-1"]);
        changeOpenKey(["3"]);
        await this.getCategoryList();
    };

    getCategoryList() {
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
        return axios.post(serverUrl+ '/admin/category/list', data)
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
                    message.error("Failed to get category data");
                }
            }).catch(function (error) {
                console.error(error);
                message.error("Failed to get category data");
            })
    }

    // Search content binding
    changeSearchInput(type, e){
        // type: object member  e: change value
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
    searchCategoryList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getCategoryList();
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.setState({selectRows: selectedRows})
        }
    };

    // Open add dialog
    openAddModal() {
        this.setState({category: { sort: 0 }, modal: {visible: true, title: "Add Category Information"}});
    }

    // Dialog form content binding
    changeModalInput(type, e){
        // type: object member  e: change value
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.category, {
            [type]: e
        });
        this.setState({
            category: target
        })
    }

    // Click OK
    handleOk() {
        const { category } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/category/save', category)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    _this.setState({modal: {visible: false}, selectRows: []});
                    _this.rowSelection.selectedRowKeys = [];
                    _this.getCategoryList();
                }else{
                    message.error(resp.msg);
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to save category information");
        })
    }


    // Delete category information
    deleteCategory() {
        const { selectRows } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        if(selectRows.length === 0) {
            message.warning("Please select at least one piece of data for deletion~");
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
                axios.post(serverUrl+ '/admin/category/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCategoryList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCategoryList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("Network error, failed to delete category information");
                })
            },
            onCancel() {
            }
        });

    }

    // Open edit dialog
    openEditModal() {
        const { selectRows, category } = this.state;
        if(selectRows.length !== 1) {
            message.warning("Please select one piece of data for modification~")
            return false;
        }
        this.setState({category: {...selectRows[0] }, modal: {visible: true, title: "Modify Category Information"}});
    }



    render() {
        const { columns, tableData, paginationProps, searchParams, modal, category } = this.state;
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
                        <Form.Item label="Category Name">
                            <Input placeholder="Please enter category name" onChange={this.changeModalInput.bind(this, 'name')} defaultValue={category.name} value={category.name}/>
                        </Form.Item>
                        <Form.Item label={
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Tooltip placement="top" title="Higher sort value means higher priority on homepage">
                                    <div><Icon type="question-circle" /></div>
                                </Tooltip>
                                <div style={{marginLeft: '0.5rem'}}>Sort Order:</div>
                            </div>
                        }>
                            <InputNumber style={{width: '100%'}} min={0} max={10000} placeholder="Please enter sort order" onChange={this.changeModalInput.bind(this, 'sort')} defaultValue={category.sort} value={category.sort}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <div className={categoryStyle.category_button} style={{width: '100%', height: '10%'}}>
                    <Button icon="plus" className={categoryStyle.add} onClick={this.openAddModal.bind(this)}>
                        Add
                    </Button>
                    <Button type="edit" icon="edit" className={categoryStyle.edit} onClick={this.openEditModal.bind(this)}>
                        Edit
                    </Button>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteCategory.bind(this)}>
                        Delete
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'name')} defaultValue={searchParams.name} value={searchParams.name} placeholder="Please enter category name" style={{width: '200px', margin: '0 10px'}} />
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchCategoryList.bind(this)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
