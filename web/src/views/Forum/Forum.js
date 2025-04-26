import forumStyle from './Forum.module.scss'
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import ArticleList from "../../components/ArticleList/ArticleList";
import {Card, ConfigProvider, message, Pagination, Empty} from "antd";
import CommonFooter from "../../components/CommonFooter/CommonFooter";
import {default as React, useContext, useEffect, useState} from "react";
import enUS from "antd/es/locale/en_US";
import CommonContext from "../../context/CommonContext";
import {useHistory} from "react-router-dom";
import axios from "axios";
import event from "../../event";
import homeStyle from "../Home/Home.module.scss";
import Weather from "../../components/Weather/Weather";

const Forum = () => {

    const [searchContent, setSearchContent] = useState("");
    const [articleList, setArticleList] = useState([]);
    const [hotArticleList, setHotArticleList] = useState([]);
    const [pagination, setPagination] = useState({page: 1, size: 5, total: 0});
    const [paginationChange, setPaginationChange] = useState(false);
    const commonContext = useContext(CommonContext);
    const [checkState, setCheckState] = useState(0);
    const history = useHistory();

    useEffect(() => {
        event.addListener('searchArticle',
            (data) => {
                setSearchContent(data);
            }
        );
        // get hot article data
        getHotArticle()
        return () => { // triggered when page is destroyed
        }
    }, []);

    useEffect( () => {
        // get article data
        getArticleList();
        return () => { // triggered when page is destroyed
        }
    }, [paginationChange, checkState, searchContent]);

    // get hot article data
    const getHotArticle = () => {
        axios.post(commonContext.serverUrl + '/web/article/hot', {type: 2})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setHotArticleList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get hot articles!');
            })
    };

    // get article data
    const getArticleList = () => {
        let data = {...pagination, param: {title: searchContent, type: 2}};
        if(checkState !== 0) {
            data.param.state = checkState;
        }
        axios.post(commonContext.serverUrl + '/web/article/list', data)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setArticleList(resp.data.list);
                    setPagination({...pagination, total: resp.data.total});
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get articles!');
            })
    };

    return (
        <>
            <CommonHeader showSearch={true} tabKey="2" />
            <div className={forumStyle.container}>
                <div className={forumStyle.left}></div>
                <div className={forumStyle.content}>
                    <div className={forumStyle.category}>
                        <div onClick={() => setCheckState(0)} className={checkState === 0 ? forumStyle.selectItem : forumStyle.item}>All</div>
                        <div onClick={() => setCheckState(2)} className={checkState === 2 ? forumStyle.selectItem : forumStyle.item}>Unsolved</div>
                        <div onClick={() => setCheckState(3)} className={checkState === 3 ? forumStyle.selectItem : forumStyle.item}>Solved</div>
                    </div>
                    <ArticleList articleList={articleList} />
                    <div className={forumStyle.pagination}>
                        <ConfigProvider locale={enUS}>
                            <Pagination pageSizeOptions={['5', '10', '20']} showSizeChanger={true}
                                        onShowSizeChange={(page, size) => {
                                            setPagination({page, size});
                                            setPaginationChange(!paginationChange);
                                        }}
                                        onChange={(page, size) => {
                                            setPagination({page, size});
                                            setPaginationChange(!paginationChange);
                                        }}
                                        showTotal={(total, range) => `Total ${total} items`} current={pagination.page} pageSize={pagination.size} total={pagination.total} />
                        </ConfigProvider>
                    </div>
                </div>
                <div className={forumStyle.side}>
                    <div className={forumStyle.quick}>
                        <div className={forumStyle.leftButton} onClick={() => history.push("/editor/add/1")}>Write Article</div>
                        <div className={forumStyle.rightButton} onClick={() => history.push("/editor/add/2")}>Ask Question</div>
                    </div>
                    <Weather />
                    <div className={forumStyle.quickArticle}>
                        <Card title="Hot Q&A">
                            {
                                hotArticleList.length > 0 ? (
                                    <React.Fragment>
                                        {
                                            hotArticleList.map((item, index) => {
                                                return (
                                                    <div key={index} className={forumStyle.quickArticleItem}>
                                                        <div onClick={() => history.push("/blog/detail/" + item.id)} className={forumStyle.name} title={item.title}>{item.title}</div>
                                                        <div className={forumStyle.date}>{item.createTime}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </React.Fragment>
                                ) : (
                                    <Empty description="No Data" />
                                )
                            }
                        </Card>
                    </div>
                </div>
                <div className={forumStyle.right}></div>
            </div>
            <CommonFooter/>
        </>
    );
};

export default Forum;
