import React, {Component} from "react";
import {Card, Statistic, Icon, message} from 'antd';
import homeStyle from './Home.module.scss';
import {connect} from "react-redux";
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import axios from "axios";
const { Meta } = Card;
class Home extends Component{

    state = {
        seriesData: [],
        userTotal: 0,
        blogTotal: 0,
        questionTotal: 0,
        commentTotal: 0,
        user: {
            headPic: "common/no_image.jpg"
        }
    };

    componentDidMount() {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("Home");
        changeSelectKey(["1"]);
        changeOpenKey(["1"]);
        this.checkLogin();
        this.getUserTotal();
        this.getBlogTotal();
        this.getQuestionTotal();
        this.getCommentTotal();
        this.getArticleTotalByDay();
    }

    getUserTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/user/total')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({userTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to get user total data");
        })
    }

    // Get blog total
    getBlogTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/total', {type: 1})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({blogTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to get blog total data");
        })
    }

    // Get question total
    getQuestionTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/total', {type: 2})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({questionTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to get question total data");
        })
    }

    // Get comment total
    getCommentTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/comment/total')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({commentTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to get comment total data");
        })
    }



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

    // Get article total by date
    getArticleTotalByDay() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/total_day')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({seriesData: resp.data}, function () {
                        // Initialize echarts instance based on prepared DOM
                        let myChart = echarts.init(document.getElementById('lineChart'));
                        _this.initChart(myChart);
                    });
                }
            }).catch(function (error) {
            console.error(error);
            message.error("Network error, failed to get article total data by date");
        })
    }




    initChart(myChart){
        // Draw chart
        myChart.setOption({
            title: {
                text: 'Article Count Line Chart (Last 3 Days)',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            color: ['#FF9F7F'],
            legend: {
                // orient sets layout method, default horizontal, options: 'horizontal' (horizontal) ¦ 'vertical' (vertical)
                orient: 'horizontal',
                // x sets horizontal position, default center, options: 'center' ¦ 'left' ¦ 'right' ¦ {number} (x coordinate, unit px)
                x: 'left',
                // y sets vertical position, default top, options: 'top' ¦ 'bottom' ¦ 'center' ¦ {number} (y coordinate, unit px)
                y: 'top',
                data: ['Article Count']
            },
            xAxis: {
                data: [ this.getDate(3), this.getDate(2), this.getDate(1)]
            },
            yAxis: {},
            series: [{
                name: 'Article Count',
                type: 'line',
                data: this.state.seriesData
            }]
        });
    }

    getDate(i) {
        let date;
        switch (i) {
            case 1:
                // Current date
                date = new Date();
                break;
            case 2:
                // Yesterday's date
                date = new Date(new Date() - 60000*60*24);
                break;
            case 3:
                // Day before yesterday's date
                date = new Date(new Date() - 60000*60*24*2);
                break;
            default:
                date = new Date();
                break;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentDate = year + "-" + month + "-" + strDate;
        return currentDate;
    }

    render() {
        const { questionTotal, userTotal, commentTotal, blogTotal, user } = this.state;
        const { serverUrl } = this.props;
        return (
            <React.Fragment>
                <div className={homeStyle.top}>
                    <div className={homeStyle.left}>
                        <Card
                            hoverable
                            style={{ width: '90%'}}
                            cover={<img style={{width: '100%', height: '16rem'}} alt="example" src={serverUrl + "/common/photo/view?filename=" + user.headPic} />}
                        >
                            <Meta title={user.username} description={
                                user.roleId === 1 ? "User Role: Regular User" :
                                user.roleId === 2 ? "User Role: Administrator" : ''
                            } />
                        </Card>
                    </div>
                    <div id="lineChart" className={homeStyle.right}>

                    </div>
                </div>

                <div className={homeStyle.bottom}>
                    <div className={homeStyle.item}>
                        <Statistic title="Total Users" value={userTotal} prefix={<Icon type="user" />} />
                    </div>
                    <div className={homeStyle.item}>
                        <Statistic title="Total Blogs" value={blogTotal} prefix={<Icon type="snippets" />} />
                    </div>
                    <div className={homeStyle.item}>
                        <Statistic title="Total Questions" value={questionTotal} prefix={<Icon type="question-circle" />} />
                    </div>
                    <div className={homeStyle.item}>
                        <Statistic title="Total Comments" value={commentTotal} prefix={<Icon type="message" />} />
                    </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Home);
