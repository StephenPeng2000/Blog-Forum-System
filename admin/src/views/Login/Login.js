import React, {Component} from "react";
import {Card, Form, Input, Icon, Button, Radio, message} from 'antd';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import loginStyle from "./Login.module.scss";
import axios from "axios";
class Login extends Component{

    state = {
        user: {
            username: "",
            password: ""
        }
    };


    handleSubmit = e => {
        e.preventDefault();
        const { serverUrl } = this.props;
        const { user } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // Normal
                const _this = this;
                axios.post(serverUrl+ '/admin/user/login', user)
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            global.tools.setLoginAdmin(resp.data.token);
                            _this.props.history.push('/home');
                        } else {
                            message.error(resp.msg);
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("Network error, login failed");
                })
            }
        });
    };

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


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <React.Fragment>
                <div className={loginStyle.login}>
                    <Card title="Blog Forum Admin System" hoverable={true} headStyle={{textAlign: 'center'}} className={loginStyle.card}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Username cannot be empty!' }],
                                })(
                                    <Input
                                        onChange={this.changeModalInput.bind(this, "username")}
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Please enter username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Password cannot be empty!' }],
                                })(
                                    <Input.Password
                                        onChange={this.changeModalInput.bind(this, "password")}
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Please enter password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={loginStyle.form_button}>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
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


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login));
