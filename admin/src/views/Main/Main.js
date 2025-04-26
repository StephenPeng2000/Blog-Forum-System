import React, {Component} from "react";
import { Layout } from 'antd';
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import mainStyle from './Main.module.scss';
import TheAside from "../../components/TheAside/TheAside";
import TheHeader from "../../components/TheHeader/TheHeader";
import TheFooter from "../../components/TheFooter/TheFooter";
import Home from '../Home/Home';
import UserList from '../UserManage/UserList/UserList';
import CategoryList from "../CategoryManage/CategoryList/CategoryList";
import TagList from "../TagManage/TagList/TagList";
import ArticleList from "../ArticleManage/ArticleList/ArticleList";
import CommentList from "../CommentManage/CommentList/CommentList";
const { Content } = Layout;
class Main extends Component{

    state = {
    };

    render() {
        return (
            <React.Fragment>
                <Layout style={{height: '100vh'}}>
                    <TheAside />
                    <Layout>
                        <TheHeader/>
                        <Content style={{margin: '1.3rem 1.5rem'}}>
                            <div style={{ padding: '2rem', background: '#fff', height: '100%' }}>
                                <Router>
                                    <Switch>
                                        <Route exact path="/home/user-list" component={UserList}></Route>
                                        <Route exact path="/home/category-list" component={CategoryList}></Route>
                                        <Route exact path="/home/tag-list" component={TagList}></Route>
                                        <Route exact path="/home/article-list" component={ArticleList}></Route>
                                        <Route exact path="/home/comment-list" component={CommentList}></Route>
                                        <Route path="/home" component={Home}></Route>
                                    </Switch>
                                </Router>
                            </div>
                        </Content>
                        <TheFooter/>
                    </Layout>
                </Layout>
            </React.Fragment>
        );
    }
}

export default Main;
