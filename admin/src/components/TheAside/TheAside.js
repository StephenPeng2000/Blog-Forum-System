import React, {Component} from "react";
import {Layout, Icon, Menu, message} from 'antd';
import {connect} from "react-redux";
import { Link, withRouter } from "react-router-dom";
import theAsideStyle from './TheAside.module.scss';
import axios from "axios";
const { SubMenu } = Menu;
const { Sider } = Layout;
class TheAside extends Component{

    state = {
        collapsed: false,
        title: 'Blog Forum Management System',
        authorityList: []
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

    componentDidMount() {
        this.checkLogin();
    }

    onCollapse = collapsed => {
        const { changeOpenKey } = this.props;
        changeOpenKey([]);
        if(collapsed) {
            this.setState({title: 'System'});
        } else {
            this.setState({title: 'Blog Forum Management System'});
        }
        this.setState({ collapsed });
    };

    setSubmenu = openKeys => {
        const { changeOpenKey } = this.props;
        changeOpenKey(openKeys);
    };

    render() {
        const { title } = this.state;
        const { selectKey, openKey } = this.props;
        return (
            <React.Fragment>
                <Sider className={theAsideStyle.aside} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className={theAsideStyle.logo}>{title}</div>
                    <Menu theme="dark" selectedKeys={selectKey} mode="inline" openKeys={openKey} onOpenChange={(openKeys) => {this.setSubmenu(openKeys)}}>
                        <Menu.Item key="1">
                            <Link to="/home" style={{textDecoration: 'none'}}>
                                <Icon type="home" /><span>Home</span>
                            </Link>
                        </Menu.Item>
                        <SubMenu key="2" title={<span><Icon type="team" /><span>User Management</span></span>}>
                            <Menu.Item key="2-1">
                                <Link to="/home/user-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />User List
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="3" title={<span><Icon type="appstore" /><span>Category Management</span></span>}>
                            <Menu.Item key="3-1">
                                <Link to="/home/category-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />Category List
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="4" title={<span><Icon type="tags" /><span>Tag Management</span></span>}>
                            <Menu.Item key="4-1">
                                <Link to="/home/tag-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />Tag List
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="5" title={<span><Icon type="snippets" /><span>Article Management</span></span>}>
                            <Menu.Item key="5-1">
                                <Link to="/home/article-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />Article List
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="6" title={<span><Icon type="message" /><span>Comment Management</span></span>}>
                            <Menu.Item key="6-1">
                                <Link to="/home/comment-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />Comment List
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TheAside));
