import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, Upload, Icon, InputNumber } from 'antd';
import enUS from 'antd/es/locale/en_US';
import event from "../../../event";
import axios from "axios";
import userStyle from './UserList.module.scss';
import {connect} from "react-redux";
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class UserList extends Component{

    state = {
        columns: [
            {title: 'User ID', dataIndex: 'id', width: '150px'},
            {title: 'Username', dataIndex: 'username', width: '100px'},
            {title: 'Avatar', dataIndex: 'headPic', width: '100px', render: headPic => {
                const { serverUrl } = this.props;
                return ( <img style={{width: '90px', height: '60px'}} src={serverUrl + "/common/photo/view?filename=" + headPic} alt="" /> )
            }},
            {title: 'Phone', dataIndex: 'phone', width: '150px'},
            {title: 'Register Time', dataIndex: 'registerTime', width: '200px'},
            {title: 'Gender', dataIndex: 'sex', width: '80px', render: text => {
                if(text === 1) {
                    return "Male";
                } else if (text === 2) {
                    return "Female";
                } else if (text === 3) {
                    return "Unknown";
                }
            }},
            {title: 'Role',  dataIndex: 'roleId', width: '100px', render: text => {
                if(text === 1) {
                    return "Normal User";
                } else if (text === 2) {
                    return "Admin";
                }
            }},
            {title: 'Profile', dataIndex: 'info', width: '200px'}],
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
            username: '',
            roleId: 0
        },
        modal: {
            visible: false,
            title: ""
        },
        loginUser: {},
        user: {
            id: "",
            username: "",
            password: "",
            headPic: "",
            phone: "",
            sex: 3,
            info: '',
            roleId: 1,
            token: ""
        },
        selectRows: []
    };


    checkLogin() {
        const _this = this;
        const { serverUrl } = _this.props;
        let token = global.tools.getLoginAdmin();
        if (global.tools.isEmpty(token)) {
            _this.props.history.push('/login');
        }else{
            // Backend token verification
            return axios.post(serverUrl+ '/admin/user/check_login',{token: token})
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        if (global.tools.isEmpty(resp.data.token)) {
                            _this.props.history.push('/login');
                        } else {
                            _this.setState({user: resp.data});
                        }
                    }else{
                        _this.props.history.push('/login');
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                _this.props.history.push('/login');
            })
        }
    }

    // Page number change
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getUserList();
        });
    }

    // Items per page change
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getUserList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("User Management/User List");
        changeSelectKey(["2-1"]);
        changeOpenKey(["2"]);
        await this.checkLogin();
        await this.getUserList();
    };

    getUserList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                username: searchParams.username,
                roleId: searchParams.roleId
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/user/list', data)
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
                    message.error("Failed to get user data");
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Failed to get user data");
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
    searchUserList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getUserList();
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
        this.setState({user: {sex: 3, roleId: 1}, modal: {visible: true, title: "Add User"}});
    }

    // Modal form content two-way binding implementation
    changeModalInput(type, e){
        // type: object member  e: changed value
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.user, {
            [type]: e
        });
        this.setState({
            user: target
        })
    }

    // Click confirm
    handleOk() {
        const { user } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/user/save', user)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    _this.setState({modal: {visible: false}, selectRows: []});
                    _this.rowSelection.selectedRowKeys = [];
                    _this.getUserList();
                    event.emit("refreshUser")
                }else{
                    message.error(resp.msg);
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to save user");
        })
    }


    // Delete user
    deleteUser() {
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
                axios.post(serverUrl+ '/admin/user/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchUserList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchUserList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("Network error, failed to delete user");
                })
            },
            onCancel() {
            }
        });

    }

    // Open edit modal
    openEditModal() {
        const { selectRows, user } = this.state;
        if(selectRows.length !== 1) {
            message.warning("Please select one item to edit")
            return false;
        }
        this.setState({user: {...selectRows[0], token: user.token }, modal: {visible: true, title: "Edit User"}});
    }



    render() {
        const { columns, tableData, paginationProps, searchParams, modal, user } = this.state;
        const { serverUrl } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const _this = this;
        const props = {
            name: 'photo',
            action: serverUrl + '/common/photo/upload_photo',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status === 'done') {
                    const response = info.fileList[info.fileList.length - 1].response;
                    if(response.code === 0) {
                        _this.setState({user: {...user, headPic: response.data}});
                        message.success(response.msg);
                    } else {
                        message.error(response.msg);
                    }
                }
                if (info.file.status === 'error') {
                    message.error("Network error, failed to upload image");
                }
            }
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
                        <Form.Item label="Username">
                            <Input placeholder="Please enter username" onChange={this.changeModalInput.bind(this, 'username')} defaultValue={user.username} value={user.username}/>
                        </Form.Item>
                        <Form.Item label="Avatar">
                            <img style={{width: '90px', height: '60px'}} src={user.headPic ? serverUrl + "/common/photo/view?filename=" + user.headPic : serverUrl + "/common/photo/view?filename=common/no_image.jpg"} alt="" />
                            <Upload {...props} showUploadList={false}>
                                <Button type="primary" style={{marginLeft: '10px'}}>
                                    <Icon type="upload" /> Upload Avatar
                                </Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Password">
                            <Input.Password placeholder="Please enter password" onChange={this.changeModalInput.bind(this, 'password')} defaultValue={user.password} value={user.password}/>
                        </Form.Item>
                        <Form.Item label="Gender">
                            <Select defaultValue={3} value={user.sex} style={{width: '100%'}} onChange={this.changeModalInput.bind(this, 'sex')}>
                                <Option value={1}>Male</Option>
                                <Option value={2}>Female</Option>
                                <Option value={3}>Unknown</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Phone">
                            <InputNumber style={{width: '100%'}} min={0} placeholder="Please enter phone number" onChange={this.changeModalInput.bind(this, 'phone')} defaultValue={user.phone} value={user.phone}/>
                        </Form.Item>
                        <Form.Item label="Role">
                            <Select defaultValue={1} value={user.roleId} style={{width: '100%'}} onChange={this.changeModalInput.bind(this, 'roleId')}>
                                <Option value={1}>Normal User</Option>
                                <Option value={2}>Admin</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Profile">
                            <TextArea placeholder="Please enter profile" onChange={this.changeModalInput.bind(this, 'info')} defaultValue={user.info} value={user.info} rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>
                <div className={userStyle.user_button} style={{width: '100%', height: '10%'}}>
                    <Button icon="plus" className={userStyle.add} onClick={this.openAddModal.bind(this)}>
                        Add
                    </Button>
                    <Button type="edit" icon="edit" className={userStyle.edit} onClick={this.openEditModal.bind(this)}>
                        Edit
                    </Button>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteUser.bind(this)}>
                        Delete
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'username')} defaultValue={searchParams.username} value={searchParams.username} placeholder="Please enter username" style={{width: '200px', margin: '0 10px'}} />
                    <Select defaultValue={0} style={{width: '200px', margin: '0 10px'}} onChange={this.changeSearchInput.bind(this, 'roleId')}>
                        <Option value={0}>All</Option>
                        <Option value={1}>Normal User</Option>
                        <Option value={2}>Admin</Option>
                    </Select>
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchUserList.bind(this)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
