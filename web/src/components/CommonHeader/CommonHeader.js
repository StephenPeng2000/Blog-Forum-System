import {Input, Tabs, Modal, Form, Radio, message, InputNumber, Menu, Dropdown, Avatar, Button } from 'antd';
import commonHeaderStyle from './CommonHeader.module.scss'
import logoImg from "../../assets/logo.jpg";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import CommonContext from '../../context/CommonContext';
import {useState, useContext, useEffect } from "react";
import event from "../../event";
const { TabPane } = Tabs;
const { TextArea } = Input;

const CommonHeader = (props) => {

    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [searchContent, setSearchContent] = useState("");
    const [loginUser, setLoginUser] = useState({});
    const { getFieldDecorator, validateFields } = props.form;
    const commonContext = useContext(CommonContext);
    const history = useHistory();


    useEffect(() => {
        event.addListener('refreshUser',
            () => {
                checkLogin();
            }
        );
        checkLogin();
        return () => {
        }
    }, []);

    const checkLogin = () => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/check_login',{token: token})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if (global.tools.isNotEmpty(resp.data.token)) {
                        setLoginUser(resp.data);
                    }
                }
            })
            .catch(function (error) {
            })
    };


    const submitRegister = () => {
        validateFields((err, values) => {
            if (err) {
                const errs = Object.keys(err);
                if (errs.includes('username')) {
                    message.warn("Please enter your nickname!");
                    return
                }
                if (errs.includes('password')) {
                    message.warn("Please enter your password!");
                    return
                }
                if (errs.includes('phone')) {
                    message.warn("Please enter your phone number!");
                    return
                }
            }
            axios.post(commonContext.serverUrl+ '/web/user/register', values)
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        message.success(resp.msg);
                        setRegisterVisible(false)
                    }else{
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                console.error(error);
                message.error("Network error, failed to register user information~");
            })
        });
    };

    const submitLogin = () => {
        validateFields((err, values) => {
            if (err) {
                const errs = Object.keys(err);
                if (errs.includes('username')) {
                    message.warn("Please enter your nickname!");
                    return
                }
                if (errs.includes('password')) {
                    message.warn("Please enter your password!");
                    return
                }
            }
            axios.post(commonContext.serverUrl+ '/web/user/login', values)
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        message.success(resp.msg);
                        global.tools.setLoginUser(resp.data.token);
                        setLoginUser(resp.data);
                        setLoginVisible(false);
                        window.location.reload();
                    }else{
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                console.error(error);
                message.error("Network error, login failed~");
            })
        });
    };

    // logout operation
    const logoutUser = () => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/logout', {token: token})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    global.tools.setLoginUser("");
                    setLoginUser({});
                    message.success(resp.msg);
                    window.location.reload();
                }
            }).catch(function (error) {
            message.error('Network error, logout failed!');
        })
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 20 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const dropdownMenu = (
        <Menu>
            <Menu.Item>
                <div style={{cursor: 'pointer'}} onClick={() => history.push("/user/" + loginUser.id)}>
                    Profile
                </div>
            </Menu.Item>
            <Menu.Item>
                <div style={{cursor: 'pointer'}} onClick={() => logoutUser()}>
                    Logout
                </div>
            </Menu.Item>
        </Menu>
    );



    return (
        <>
            <div className={commonHeaderStyle.header}>
                <div className={commonHeaderStyle.title} onClick={() => history.push("/index")}>
                    <div style={{marginRight: '1rem'}}>
                        <img src={logoImg} alt='' width='30' height='30'/>
                    </div>
                    <div style={{marginTop: '0.1rem'}}>
                        Zhenhai's Blog Forum System
                    </div>
                </div>
                <div className={commonHeaderStyle.menu}>
                    <Tabs defaultActiveKey={props.tabKey} activeKey={props.tabKey} onChange={(e) => {
                        if(e === "1") {
                            history.push("/index");
                        } else if (e === "2") {
                            history.push("/forum");
                        }
                    }} >
                        <TabPane tab="Blog Articles" key="1">
                        </TabPane>
                        <TabPane tab="Q&A Forum" key="2">
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '15%'}}></div>
                <div className={commonHeaderStyle.user}>
                    {
                        props.showSearch &&
                            <>
                                <div style={{marginRight: '1rem', marginTop: '0.2rem'}}>
                                    <Input defaultValue={searchContent} value={searchContent} onChange={(e) => setSearchContent(e.target.value)} placeholder="Enter what you want to search" />
                                </div>
                                <div>
                                    <Button style={{marginTop: '0.2rem', marginRight: '1rem'}} type="primary" onClick={() => {
                                        event.emit("searchArticle", searchContent);
                                    }}>Search</Button>
                                </div>
                            </>
                    }
                    {
                        loginUser.id ? (
                            <Dropdown overlay={dropdownMenu}>
                                <div className={commonHeaderStyle.loginUser}>
                                    <div>
                                        <Avatar style={{marginTop: '0.2rem'}} src={commonContext.serverUrl + '/common/photo/view?filename=' + loginUser.headPic} />
                                    </div>
                                    <div className={commonHeaderStyle.name}>
                                        <span>{loginUser.username || ''}</span>
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <>
                                <div onClick={() => setLoginVisible(true)} className={commonHeaderStyle.button}>Login</div>
                                <div onClick={() => setRegisterVisible(true)} className={commonHeaderStyle.button}>Register</div>
                            </>
                        )
                    }

                </div>
            </div>
            <Modal
                destroyOnClose={true}
                maskClosable={false}
                title="Login"
                okText="Confirm"
                onOk={() => submitLogin()}
                onCancel={() => setLoginVisible(false)}
                cancelText="Cancel"
                visible={loginVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="Nickname">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your nickname!',
                                }
                            ],
                        })(<Input placeholder="Please enter your nickname"/>)}
                    </Form.Item>
                    <Form.Item label="Password">
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your password!',
                                }
                            ],
                        })(<Input placeholder="Please enter your password" type="password"/>)}
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                destroyOnClose={true}
                maskClosable={false}
                title="Register"
                okText="Confirm"
                onOk={() => submitRegister()}
                cancelText="Cancel"
                onCancel={() => setRegisterVisible(false)}
                visible={registerVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="Nickname">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your nickname!',
                                }
                            ],
                        })(<Input placeholder="Please enter your nickname"/>)}
                    </Form.Item>
                    <Form.Item label="Password">
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your password!',
                                }
                            ],
                        })(<Input type="password" placeholder="Please enter your password"/>)}
                    </Form.Item>
                    <Form.Item label="Phone Number">
                        {getFieldDecorator('phone', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your phone number!',
                                }
                            ],
                        })(<InputNumber style={{width: '100%'}} min={0} placeholder="Please enter your phone number"/>)}
                    </Form.Item>
                    <Form.Item label="User Gender">
                        {getFieldDecorator('sex', {
                            initialValue: 3
                        })(
                        <Radio.Group>
                            <Radio value={1}>Male</Radio>
                            <Radio value={2}>Female</Radio>
                            <Radio value={3}>Unknown</Radio>
                        </Radio.Group>)}
                    </Form.Item>
                    <Form.Item label="Personal Introduction">
                        {getFieldDecorator('info', {
                            initialValue: ''
                        })(
                            <TextArea rows={4} />)}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )

};

export default Form.create()(CommonHeader);
