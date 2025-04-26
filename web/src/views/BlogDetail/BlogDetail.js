import blogDetailStyle from './BlogDetail.module.scss'
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import CommonFooter from "../../components/CommonFooter/CommonFooter";
import {Card, Input, Icon, Pagination, message, Button, ConfigProvider, Modal, Form, Empty} from "antd";
import enUS from 'antd/es/locale/en_US';
import pickImg from "../../assets/pick.png";
import 'highlight.js/styles/base16/onedark.css';
import {default as React, useContext, useEffect, useState} from "react";
import axios from "axios";
import CommonContext from "../../context/CommonContext";
import {useHistory} from "react-router-dom";
const { confirm } = Modal;

const BlogDetail = (props) => {

    const [article, setArticle] = useState({ contentMarkdown: '', categoryDTO: {}, userDTO: {headPic: 'common/no_image.jpg'}});
    const [pagination, setPagination] = useState({page: 1, size: 5, total: 0});
    const [paginationChange, setPaginationChange] = useState(false);
    const [attention, setAttention] = useState(false);
    const [content, setContent] = useState("");
    const [total, setTotal] = useState(0);
    const [replyContent, setReplyContent] = useState("");
    const [like, setLike] = useState(false);
    const [collect, setCollect] = useState(false);
    const [replyVisible, setReplyVisible] = useState(false);
    const [comment, setComment] = useState({ toUser: {} });
    const [commentList, setCommentList] = useState([]);
    const [authorArticleList, setAuthorArticleList] = useState([]);
    const [loginUser, setLoginUser] = useState({headPic: 'common/no_image.jpg'});
    const commonContext = useContext(CommonContext);
    const history = useHistory();


    useEffect(() => {
        const { match: { params = '' } } = props;
        // check if login
        checkLogin(params.params);
        // get article detail info by article id
        getArticleDetail(params.params, '/web/article/view');
        // get author's other articles
        getAuthorArticleList(params.params);
        return () => { // triggered when page is destroyed
        }
    }, [props.location.pathname]);


    useEffect( () => {
        if(loginUser.id && article.userId) {
            judgeAttention({fromId: loginUser.id, toId: article.userId});
        }
        return () => { // triggered when page is destroyed
        }
    }, [loginUser, article, props.location.pathname]);

    useEffect( () => {
        const { match: { params = '' } } = props;
        // get comment data when pagination changes
        getCommentList([], params.params);
        return () => { // triggered when page is destroyed
        }
    }, [paginationChange, props.location.pathname]);


    // get article detail info by article id
    const getArticleDetail = (id, url) => {
         axios.post(commonContext.serverUrl + url, {id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setArticle(resp.data);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get article details!');
            })
    };

    // get author's other articles
    const getAuthorArticleList = (id) => {
        axios.post(commonContext.serverUrl + '/web/article/author', {id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAuthorArticleList(resp.data);
                } else {
                    message.error('Network error, failed to get author\'s other articles!');
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get author\'s other articles!');
            })
    };


    // judge if following author
    const judgeAttention = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/judge', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAttention(resp.data);
                } else {
                    setAttention(false);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to check if following author!');
            })
    };

    // judge if liked article
    const judgeLike = (params) => {
        axios.post(commonContext.serverUrl + '/web/like/judge', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setLike(resp.data);
                } else {
                    setLike(false);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to check if liked article!');
            })
    };

    // judge if collected article
    const judgeCollect = (params) => {
        axios.post(commonContext.serverUrl + '/web/collect/judge', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setCollect(resp.data);
                } else {
                    setCollect(false);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to check if collected article!');
            })
    };

    // get comment data total count
    const countCommentTotal = (articleId) => {
         axios.post(commonContext.serverUrl + '/web/comment/total', {articleId})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setTotal(resp.data);
                } else {
                    message.error('Network error, failed to get comment total count!');
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get comment total count!');
            })
    };

    // like article
    const likeArticle = () => {
        axios.post(commonContext.serverUrl + '/web/like/like', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setLike(true);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to like article!');
            })
    };

    // attention author
    const attentionAuthor = () => {
        axios.post(commonContext.serverUrl + '/web/attention/add', {fromId: loginUser.id, toId: article.userId})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: article.userId});
                    message.success(resp.msg);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to follow author!');
            })
    };

    // remove attention author
    const removeAttentionAuthor = () => {
        axios.post(commonContext.serverUrl + '/web/attention/remove', {fromId: loginUser.id, toId: article.userId})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: article.userId});
                    message.success(resp.msg);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to unfollow author!');
            })
    };

    // pick comment
    const pickComment = (id) => {
        confirm({
            title: 'Notice',
            content: 'Are you sure to accept this comment?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                axios.post(commonContext.serverUrl + '/web/comment/pick', {id})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            getArticleDetail(article.id, '/web/article/get');
                            getCommentList([], article.id);
                        } else {
                            message.error(resp.msg);
                        }
                    })
                    .catch(function (error) {
                        message.error('Network error, failed to accept comment!');
                    })
            },
            onCancel() {
            },
        });
    };

    // collect article
    const collectArticle = () => {
        axios.post(commonContext.serverUrl + '/web/collect/add', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setCollect(true);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to collect article!');
            })
    };

    // unlike article
    const unlikeArticle = () => {
        axios.post(commonContext.serverUrl + '/web/like/unlike', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setLike(false);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to unlike article!');
            })
    };

    // remove collect article
    const removeCollectArticle = () => {
        axios.post(commonContext.serverUrl + '/web/collect/remove', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setCollect(false);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to remove collection!');
            })
    };

    // get comment data
    const getCommentList = (oldCommentList, articleId) => {
        return axios.post(commonContext.serverUrl + '/web/comment/list', {...pagination, param: {articleId}})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if(oldCommentList.length > 0) {
                        let newCommentList = resp.data.list;
                        newCommentList.forEach((item, index) => {
                            item.collapse = oldCommentList[index].collapse;
                        });
                        setCommentList(JSON.parse(JSON.stringify(newCommentList)));
                    } else {
                        setCommentList(resp.data.list);
                    }
                    setPagination({...pagination, total: resp.data.total});
                    countCommentTotal(articleId);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get comment list!');
            })
    };

    // check if login
    const checkLogin = (articleId) => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/check_login',{token: token})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if (global.tools.isNotEmpty(resp.data.token)) {
                        setLoginUser(resp.data);
                        judgeLike({articleId: articleId, userId: resp.data.id});
                        judgeCollect({articleId: articleId, userId: resp.data.id})
                    }
                }
            })
            .catch(function (error) {
            })
    };

    // submit or reply comment info
    const submitComment = (type, parentId, toId, submitContent) => {
        let data = {
            content: submitContent,
            fromId: loginUser.id,
            articleId: article.id,
            type,
            parentId,
            toId
        };
        axios.post(commonContext.serverUrl + '/web/comment/submit', data)
            .then( (response) => {
                let resp = response.data;
                if(resp.code === 0){
                    setContent('');
                    setReplyVisible(false);
                    setReplyContent("");
                    message.success(resp.msg);
                    let newCommentList = JSON.parse(JSON.stringify(commentList));
                    if(type === 1) {
                        newCommentList.unshift({fromUserDTO: {headPic: 'common/no_image.jpg'}});
                    }
                    getCommentList(newCommentList, article.id);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to submit comment!');
            })
    };

    // delete comment info
    const deleteComment = (id) => {
        confirm({
            title: 'Notice',
            content: 'Are you sure to delete this comment?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                axios.post(commonContext.serverUrl + '/web/comment/delete', {id})
                    .then( (response) => {
                        let resp = response.data;
                        if(resp.code === 0){
                            let newCommentList = JSON.parse(JSON.stringify(commentList));
                            newCommentList = newCommentList.filter(item => item.id !== id);
                            getCommentList(newCommentList, article.id);
                            // get article detail info by article id
                            getArticleDetail(article.id, '/web/article/get');
                        } else {
                            message.error(resp.msg);
                        }
                    })
                    .catch(function (error) {
                        message.error('Network error, failed to delete comment!');
                    })
            },
            onCancel() {
            },
        });
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 19 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };


    return (
        <>
            <Modal
                maskClosable={false}
                title={"Reply " + comment.toUser.username + ":"}
                onCancel={() => setReplyVisible(false)}
                okText="Confirm"
                onOk={() => submitComment(2, comment.parentId, comment.toUser.id, replyContent)}
                cancelText="Cancel"
                visible={replyVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="Comment Content">
                        <Input.TextArea placeholder="Please enter comment content" defaultValue={replyContent} value={replyContent} onChange={ e => setReplyContent(e.target.value) } autoSize={{ minRows: 4 }}/>
                    </Form.Item>
                </Form>
            </Modal>
            <CommonHeader showSearch={false} />
            <div className={blogDetailStyle.container}>
                <div className={blogDetailStyle.left}></div>
                <div className={blogDetailStyle.content}>
                    <div className={blogDetailStyle.blog}>
                        <div className={blogDetailStyle.title}>{article.title}</div>
                        <div className={blogDetailStyle.info}>
                            <span style={{marginRight: '0.5rem'}}>
                                <img src={commonContext.serverUrl + '/common/photo/view?filename=' + article.userDTO.headPic} style={{marginBottom: '0.2rem'}} alt='' width='15' height='15'/>
                            </span>
                            <span className={blogDetailStyle.username} onClick={() => history.push("/user/" + article.userId)}>
                                {article.userDTO.username}
                            </span>
                            <span title="Release Time" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="history" />
                            </span>
                            <span>
                                {article.createTime}
                            </span>
                            <span title="View Count" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="eye" />
                            </span>
                            <span>
                               {article.viewNum}
                            </span>
                            <span title="Like Count" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="like" />
                            </span>
                            <span>
                                {article.likeNum}
                            </span>
                            <span title="Comment Count" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="message" />
                            </span>
                            <span>
                                {article.commentNum}
                            </span>
                            <span title="Collect Count" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="heart" />
                            </span>
                            <span>
                                {article.collectNum}
                            </span>
                            <span title="Category" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="appstore" />
                            </span>
                            <span>
                                {article.categoryDTO.name}
                            </span>
                            <span title="Tag" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="tag" />
                            </span>
                            {
                                article.tagDTOList && article.tagDTOList.map((tag, tagIndex) => {
                                    return (
                                        <span key={tagIndex} style={{marginRight: '0.5rem'}}>
                                            {tag.name}
                                        </span>
                                    )
                                })
                            }
                        </div>
                        <div className={blogDetailStyle.operate}>
                            {
                                collect ? (
                                    <div title="Remove Collection" onClick={() => removeCollectArticle()}><Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /></div>
                                ) : (
                                    <div title="Collect" onClick={() => collectArticle()}><Icon type="heart" /></div>
                                )
                            }
                            {
                                like ? (
                                    <div title="Remove Like" onClick={() => unlikeArticle()}><Icon type="like" theme="twoTone" twoToneColor="#eb2f96" /></div>
                                ) : (
                                    <div title="Like" onClick={() => likeArticle()}><Icon type="like" /></div>
                                )
                            }
                        </div>
                        <div className={blogDetailStyle.text}>
                            <div className="for-container">
                                <div className="for-markdown-preview">
                                    <div style={{padding: '1.5rem'}}  dangerouslySetInnerHTML={{
                                        __html: article.contentHtml
                                    }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={blogDetailStyle.footer}>
                             Last Edited: {article.updateTime}
                        </div>

                    </div>
                    <div className={blogDetailStyle.submitComment}>
                        <div><img src={commonContext.serverUrl + '/common/photo/view?filename=' + loginUser.headPic} className={blogDetailStyle.image} alt="" /></div>
                        <div style={{width: '90%'}}><Input.TextArea placeholder="Please enter comment content" defaultValue={content} value={content} onChange={ e => setContent(e.target.value) } autoSize={{ minRows: 1 }}/></div>
                        <div style={{width: '10%', marginLeft: '1rem'}}>
                            <Button onClick={() => submitComment(1, '', '', content)} type="primary">Submit</Button>
                        </div>
                    </div>
                    <div className={blogDetailStyle.commentList}>

                        {
                            commentList.map((item, index) => {
                                return (
                                    <div key={index} className={blogDetailStyle.comment}>
                                        {
                                            item.pick === 2 &&
                                            <div className={blogDetailStyle.pick}>
                                                <img src={pickImg} alt="" style={{width:'50%'}} />
                                            </div>
                                        }
                                        <div><img src={commonContext.serverUrl + '/common/photo/view?filename=' +item.fromUserDTO.headPic} className={blogDetailStyle.image} alt="" /></div>
                                        <div style={{width: '100%', borderBottom: '1px solid #00000020'}}>
                                            <div className={blogDetailStyle.username}>{item.fromUserDTO.username}</div>
                                            <div className={blogDetailStyle.content}>{item.content}</div>
                                            <div className={blogDetailStyle.footer}>
                                                <div>
                                                    <span>{item.createTime}</span>
                                                    {
                                                        item.childrenList && item.childrenList.length > 0 &&
                                                        (
                                                            <>
                                                                {
                                                                    item.collapse ? (
                                                                        <span onClick={() => {
                                                                            let newCommentList = commentList;
                                                                            newCommentList[index].collapse = !newCommentList[index].collapse;
                                                                            setCommentList(JSON.parse(JSON.stringify(newCommentList)));
                                                                        }} style={{cursor: 'pointer', color: '#40a9ff', marginLeft: '1rem'}}>Expand {item.childrenList.length} Replies</span>
                                                                    ) : (
                                                                        <span onClick={() => {
                                                                            let newCommentList = commentList;
                                                                            newCommentList[index].collapse = !newCommentList[index].collapse;
                                                                            setCommentList(JSON.parse(JSON.stringify(newCommentList)));
                                                                        }} style={{cursor: 'pointer', color: '#40a9ff', marginLeft: '1rem'}}>Fold Replies</span>
                                                                    )
                                                                }

                                                            </>
                                                        )
                                                    }
                                                </div>

                                                <div className={blogDetailStyle.button} >
                                                    {
                                                        article.type === 2 && article.state === 2 && article.userId === loginUser.id &&
                                                        <div style={{cursor: 'pointer'}} onClick={() => pickComment(item.id)}>
                                                            <span style={{marginRight: '0.3rem'}}>
                                                                <Icon type="smile" />
                                                            </span>
                                                            <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                 Accept
                                                            </span>
                                                        </div>
                                                    }
                                                    {
                                                        loginUser.id === item.fromUserDTO.id &&
                                                        <div style={{cursor: 'pointer'}} onClick={() => deleteComment(item.id)}>
                                                            <span style={{marginRight: '0.3rem'}}>
                                                                <Icon type="delete" />
                                                            </span>
                                                            <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                 Delete
                                                            </span>
                                                        </div>
                                                    }
                                                    <div style={{cursor: 'pointer'}} onClick={() => {
                                                        setComment({...comment, parentId: item.id, toUser: item.fromUserDTO});
                                                        setReplyVisible(true);
                                                    }}>
                                                        <span style={{marginRight: '0.3rem'}}>
                                                            <Icon type="message" />
                                                        </span>
                                                        <span style={{fontSize: '0.75rem'}}>
                                                             Reply
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                            {
                                                !item.collapse &&
                                                <div className={blogDetailStyle.reply}>
                                                    {
                                                        item.childrenList && item.childrenList.map((child, childIndex) => {
                                                            return (
                                                                <div key={childIndex} className={blogDetailStyle.comment}>
                                                                    {
                                                                        child.pick === 2 &&
                                                                        <div className={blogDetailStyle.pick}>
                                                                            <img src={pickImg} alt="" style={{width:'50%'}} />
                                                                        </div>
                                                                    }
                                                                    <div><img src={commonContext.serverUrl + '/common/photo/view?filename=' +child.fromUserDTO.headPic} className={blogDetailStyle.image} alt="" /></div>
                                                                    <div style={{width: '100%'}}>
                                                                        <div className={blogDetailStyle.username}><span>{child.fromUserDTO.username}</span><span style={{margin: '0 0.5rem'}}>Reply</span><span>{child.toUserDTO.username}</span></div>
                                                                        <div className={blogDetailStyle.content}>{child.content}</div>
                                                                        <div className={blogDetailStyle.footer}>
                                                                            <div>{child.createTime}</div>

                                                                            <div className={blogDetailStyle.button} >
                                                                                {
                                                                                    article.type === 2 && article.state === 2 && article.userId === loginUser.id &&
                                                                                    <div style={{cursor: 'pointer'}} onClick={() => pickComment(child.id)}>
                                                                                        <span style={{marginRight: '0.3rem'}}>
                                                                                            <Icon type="smile" />
                                                                                        </span>
                                                                                        <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                                             Accept
                                                                                        </span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    loginUser.id === child.fromUserDTO.id &&
                                                                                    <div style={{cursor: 'pointer'}} onClick={() => deleteComment(child.id)}>
                                                                                        <span style={{marginRight: '0.3rem'}}>
                                                                                            <Icon type="delete" />
                                                                                        </span>
                                                                                        <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                                             Delete
                                                                                        </span>
                                                                                    </div>
                                                                                }
                                                                                <div style={{cursor: 'pointer'}} onClick={() => {
                                                                                    setComment({...comment, parentId: item.id, toUser: child.fromUserDTO});
                                                                                    setReplyVisible(true);
                                                                                }}>
                                                                                    <span style={{marginRight: '0.3rem'}}>
                                                                                        <Icon type="message" />
                                                                                    </span>
                                                                                    <span style={{fontSize: '0.75rem'}}>
                                                                                         Reply
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                            }

                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className={blogDetailStyle.pagination}>
                        <ConfigProvider locale={enUS}>
                            <Pagination showTotal={() => 'Total ' + total + ' Comments'} current={pagination.page}
                                        onChange={(page, size) => {
                                            setPagination({page, size});
                                            setPaginationChange(!paginationChange);
                                        }}
                                        pageSize={pagination.size} total={pagination.total} />
                        </ConfigProvider>
                    </div>
                </div>
                <div className={blogDetailStyle.side}>
                    <div className={blogDetailStyle.author}>
                        <div style={{width: '100%'}}>
                            <img src={commonContext.serverUrl + '/common/photo/view?filename=' + article.userDTO.headPic} className={blogDetailStyle.image} alt="" />
                        </div>
                        <div className={blogDetailStyle.name} onClick={() => history.push("/user/" + article.userId)}>
                            {article.userDTO.username}
                        </div>
                        {
                            attention ? (
                                <div onClick={() => removeAttentionAuthor()} className={blogDetailStyle.notAttention}>Unfollow</div>
                            ) : (
                                <div onClick={() => attentionAuthor()} className={blogDetailStyle.attention}>Follow</div>
                            )
                        }
                    </div>
                    <div className={blogDetailStyle.quickArticle}>
                        <Card title="Author's Other Articles" extra={<a href={'/#/user/' + article.userId} style={{color: '#28a745'}}>More</a>}>
                            {
                                authorArticleList.length > 0 ? (
                                    <React.Fragment>
                                        {
                                            authorArticleList.map((item, index) => {
                                                return (
                                                    <div key={index} className={blogDetailStyle.quickArticleItem}>
                                                        <div onClick={() => history.push("/blog/detail/" + item.id)} className={blogDetailStyle.name} title={item.title}>{item.title}</div>
                                                        <div className={blogDetailStyle.date}>{item.createTime}</div>
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
                <div className={blogDetailStyle.right}></div>
            </div>
            <CommonFooter />
        </>
    )

};

export default BlogDetail;
