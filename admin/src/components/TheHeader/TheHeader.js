import React, {Component} from "react";
import {Layout, Breadcrumb, Avatar, Menu, Dropdown, message } from 'antd';
import {connect} from "react-redux";
import event from "../../event";
import axios from "axios";
import { withRouter } from "react-router-dom"
import theHeaderStyle from './TheHeader.module.scss';
const { Header } = Layout;
class TheHeader extends Component{

    state = {
        user: {
            token: "",
            headPic: "common/no_image.jpg"
        }
    };

    checkLogin(){
        const _this = this;
        const { serverUrl } = _this.props;
        let token = global.tools.getLoginAdmin();
        if (global.tools.isEmpty(token)) {
            _this.props.history.push('/login');
        }else{
            // Backend token verification
            axios.post(serverUrl+ '/admin/user/check_login',{token: token})
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        if (global.tools.isEmpty(resp.data.token)) {
                            _this.props.history.push('/login');
                            message.error('Not logged in or session expired, please login again!');
                        } else {
                            _this.setState({user: resp.data});
                        }
                    }else{
                        _this.props.history.push('/login');
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                message.error('Network error, user login has expired, please login again!');
                _this.props.history.push('/login');
            })
        }
    }

    logout(){
        const _this = this;
        const { serverUrl } = _this.props;
        const { user } = _this.state;
        axios.post(serverUrl+ '/admin/user/logout',user)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({user: {}}, ()=>{
                        global.tools.setLoginAdmin("");
                        message.success(resp.msg);
                        _this.props.history.push('/login');
                    });
                }
            }).catch(function (error) {
            message.error('Network error, logout failed!');
        })
    }


    componentDidMount() {
        this.checkLogin();
        event.addListener('refreshUser',
            (msg, data) => {
                this.checkLogin();
            }
        );
    }


    render() {
        const { user } = this.state;
        const { serverUrl } = this.props;
        const menu = (
            <Menu>
                <Menu.Item onClick={this.logout.bind(this)}>
                    Logout
                </Menu.Item>
            </Menu>
        );
        const { menuName } = this.props;
        const menus = menuName.split("/");
        return (
            <React.Fragment>
                <Header className={theHeaderStyle.header} >
                    <Breadcrumb className={theHeaderStyle.breadcrumb}>
                        {menus.map((e,i) => (
                            <Breadcrumb.Item key={i}>{menus[menus.length - ( i + 1 )]}</Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <Dropdown overlay={menu} placement="bottomCenter" className={theHeaderStyle.dropdown}>
                        <div>
                            <Avatar className={theHeaderStyle.avatar} src={serverUrl + '/common/photo/view?filename=' + user.headPic} />
                            <span>{user.username}</span>
                        </div>
                    </Dropdown>

                </Header>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TheHeader));
