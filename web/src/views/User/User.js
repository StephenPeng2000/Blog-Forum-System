import userStyle from './User.module.scss'
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import CommonFooter from "../../components/CommonFooter/CommonFooter";
import ArticleList from "../../components/ArticleList/ArticleList";
import {
    Card,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Radio,
    Upload,
    Skeleton,
    Avatar,
    List,
    Empty,
    Icon,
    Button,
    ConfigProvider,
    Pagination
} from "antd";
import {default as React, useContext, useEffect, useState} from "react";
import CommonContext from "../../context/CommonContext";
import {useHistory} from "react-router-dom";
import axios from "axios";
import enUS from "antd/es/locale/en_US";
import event from "../../event";
const { confirm } = Modal;
const { TextArea } = Input;


const User = (props) => {

    const [attention, setAttention] = useState(false);
    const [loginUser, setLoginUser] = useState({headPic: 'common/no_image.jpg'});
    const [user, setUser] = useState({headPic: 'common/no_image.jpg'});
    const [searchContent, setSearchContent] = useState("");
    const [editUser, setEditUser] = useState({headPic: 'common/no_mage.jpg'});
    const [pagination, setPagination] = useState({page: 1, size: 5, total: 0});
    const [paginationChange, setPaginationChange] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [attentionList, setAttentionList] = useState([]);
    const [gapAttentionList, setGapAttentionList] = useState([]);
    const [allAttentionList, setAllAttentionList] = useState([]);
    const [viewList, setViewList] = useState([]);
    const [attentionTotal, setAttentionTotal] = useState(0);
    const [fanList, setFanList] = useState([]);
    const [gapFanList, setGapFanList] = useState([]);
    const [allFanList, setAllFanList] = useState([]);
    const [fanTotal, setFanTotal] = useState(0);
    const [checkQueryType, setCheckQueryType] = useState(1);
    const commonContext = useContext(CommonContext);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [articleList, setArticleList] = useState([]);
    const { getFieldDecorator, validateFields } = props.form;
    const history = useHistory();


    useEffect( () => {
        const { match: { params = '' } } = props;
        event.addListener('searchArticle',
            (data) => {
                setSearchContent(data);
            }
        );
        // check if login
        checkLogin();
        // get user info
        getUser(params.params);
        // get attention list
        getAttentionList({page: 1, size: 8, param: {fromId: params.params}});
        // get fan list
        getFanList({page: 1, size: 8, param: {toId: params.params}});
        // get all attention list
        getAllAttentionList({fromId: params.params});
        // get all fan list
        getAllFanList({toId: params.params});
        return () => { // triggered when page is destroyed
        }
    }, [props.location.pathname, modalVisible, attention]);

    useEffect( () => {
        const { match: { params = '' } } = props;
        if(loginUser.id) {
            judgeAttention({fromId: loginUser.id, toId: params.params});
        }
        return () => { // triggered when page is destroyed
        }
    }, [loginUser, props.location.pathname, modalVisible, attention]);

    useEffect( () => {
        if(modalTitle === 'Following List') {
            setViewList(allAttentionList);
        } else if (modalTitle === 'Fans List') {
            setViewList(allFanList);
        }
        return () => { // triggered when page is destroyed
        }
    }, [allAttentionList, allFanList]);


    useEffect( () => {
        const { match: { params = '' } } = props;
        // get article data
        getArticleList(params.params);
        return () => { // triggered when page is destroyed
        }
    }, [paginationChange, searchContent, checkQueryType, props.location.pathname, modalVisible, attention, loginUser]);


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

    // get attention list
    const getAttentionList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/list', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAttentionList(resp.data.list);
                    let list = resp.data.list;
                    let gapList = [];
                    let gapNum = 0;
                    if(list.length % 4 != 0) {
                        gapNum = 4 - list.length % 4;
                    }
                    for(let i=0; i<gapNum; i++) {
                        gapList.push({});
                    }
                    setGapAttentionList(gapList);
                    setAttentionTotal(resp.data.total);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get following list!');
            })
    };

    // get all attention list
    const getAllAttentionList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/all', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAllAttentionList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get all following list!');
            })
    };

    // get all fan list
    const getAllFanList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/all', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAllFanList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get all fans list!');
            })
    };

    // get fan list
    const getFanList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/list', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setFanList(resp.data.list);
                    let list = resp.data.list;
                    let gapList = [];
                    let gapNum = 0;
                    if(list.length % 4 != 0) {
                        gapNum = 4 - list.length % 4;
                    }
                    for(let i=0; i<gapNum; i++) {
                        gapList.push({});
                    }
                    setGapFanList(gapList);
                    setFanTotal(resp.data.total);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get fans list!');
            })
    };

    // get article data
    const getArticleList = (userId) => {
        let data;
        if(loginUser.id === userId) {
            if(checkQueryType >=6 && checkQueryType <= 11) {
                data = {...pagination, param: {userId: userId, state: checkQueryType-5, title: searchContent, queryType: checkQueryType}};
            } else {
                data = {...pagination, param: {userId: userId, state: 0, title: searchContent, queryType: checkQueryType}};
            }
        } else {
            data = {...pagination, param: {userId: userId, title: searchContent, queryType: checkQueryType}};
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


    // check if login
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
                message.error('Network error, failed to check login status!');
            })
    };

    // modify personal info
    const submitEditUser = () => {
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
            axios.post(commonContext.serverUrl+ '/web/user/update', {...values, headPic: editUser.headPic, id: editUser.id, token: loginUser.token})
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        message.success(resp.msg);
                        setUser(resp.data);
                        setEditModalVisible(false)
                        event.emit("refreshUser");
                    }else{
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                console.error(error);
                message.error("Network error, failed to update profile~");
            })
        });
    };

    //  get user info
    const getUser = (id) => {
        axios.post(commonContext.serverUrl + '/web/user/get',{id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setUser(resp.data);
                    setEditUser(resp.data)
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
            })
    };

    // attention author
    const attentionAuthor = () => {
        axios.post(commonContext.serverUrl + '/web/attention/add', {fromId: loginUser.id, toId: user.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: user.id});
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
        axios.post(commonContext.serverUrl + '/web/attention/remove', {fromId: loginUser.id, toId: user.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: user.id});
                    message.success(resp.msg);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to unfollow author!');
            })
    };


    // remove fan or attention
    const removeAttention = (params) => {
        confirm({
            title: 'Tips',
            content: 'Are you sure to remove this user?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                axios.post(commonContext.serverUrl + '/web/attention/remove', params)
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            setAttention(!attention); // to refresh
                            message.success("Successfully removed");
                        } else {
                            message.error(resp.msg);
                        }
                    })
                    .catch(function (error) {
                        message.error('Network error, failed to remove!');
                    })
            },
            onCancel() {
            },
        });

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

    // 上传图片
    const uploadProps = {
        name: 'photo',
        action: commonContext.serverUrl + '/common/photo/upload_photo',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                const response = info.fileList[info.fileList.length - 1].response;
                if(response.code === 0) {
                    setEditUser({...user, headPic: response.data});
                    message.success(response.msg);
                } else {
                    message.error(response.msg);
                }
            }
            if (info.file.status === 'error') {
                message.error("Network error, failed to upload image!");
            }
        }
    };


    return (
        <>
            <Modal
                title={modalTitle}
                visible={modalVisible}
                okText="Confirm"
                onCancel={() => setModalVisible(false)}
                width={700}
                cancelButtonProps={{ style: { display: 'none' } }}
                maskClosable={false}
                onOk={() => setModalVisible(false)}
            >
                <ConfigProvider locale={enUS}>
                    <List
                        style={{maxHeight: '25rem', overflow: 'auto'}}
                        itemLayout="horizontal"
                        dataSource={viewList}
                        renderItem={item => (
                            <>
                                {
                                    modalTitle === 'Fans List' &&
                                    <List.Item
                                        actions={
                                            user.id === loginUser.id &&
                                            [<span style={{color: 'red'}} onClick={() => removeAttention({fromId: item.fromId, toId: loginUser.id})} key="list-loadmore-edit">Remove</span>]
                                        }
                                    >
                                        <Skeleton loading={false} avatar title={false}  active>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar src={commonContext.serverUrl + '/common/photo/view?filename=' + item.fromUserDTO.headPic} />
                                                }
                                                title={<span style={{cursor: 'pointer'}} onClick={() => {
                                                    setModalVisible(false);
                                                    history.push("/user/" + item.fromId);
                                                }}>{item.fromUserDTO.username}</span>}
                                                description={"Follow Time: " + item.createTime}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                }
                                {
                                    modalTitle === 'Following List' &&
                                    <List.Item
                                        actions={
                                            user.id === loginUser.id &&
                                            [<span style={{color: 'red'}} onClick={() => removeAttention({fromId: loginUser.id, toId: item.toId})} key="list-loadmore-edit">Remove</span>]
                                        }
                                    >
                                        <Skeleton loading={false} avatar title={false}  active>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar src={commonContext.serverUrl + '/common/photo/view?filename=' + item.toUserDTO.headPic} />
                                                }
                                                title={<span style={{cursor: 'pointer'}} onClick={() => {
                                                    setModalVisible(false);
                                                    history.push("/user/" + item.toId);
                                                }}>{item.toUserDTO.username}</span>}
                                                description={"Follow Time: " + item.createTime}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                }
                            </>
                        )}
                    />
                </ConfigProvider>
            </Modal>
            <CommonHeader tabKey="0" showSearch={true} />
            <div className={userStyle.top}>
                <div className={userStyle.left}></div>
                <div className={userStyle.content}>
                    <div className={userStyle.user}>
                        <div className={userStyle.summary}>
                            <div style={{width: '100%'}}>
                                <img src={commonContext.serverUrl + '/common/photo/view?filename=' + user.headPic} className={userStyle.image} alt="" />
                            </div>
                            <div className={userStyle.name}>
                                {user.username}
                            </div>

                            {
                                loginUser.id === user.id ? (
                                    <div className={userStyle.edit} onClick={() => {
                                        setEditModalVisible(true);
                                    }}>Edit</div>
                                ) : (
                                    <>
                                        {
                                            attention ? (
                                                <div onClick={() => removeAttentionAuthor()} className={userStyle.notAttention}>Unfollow</div>
                                            ) : (
                                                <div onClick={() => attentionAuthor()} className={userStyle.attention}>Follow</div>
                                            )
                                        }
                                    </>
                                )
                            }

                        </div>
                        <div className={userStyle.info}>
                            <div className={userStyle.first}>
                                <div>Registration Date: {user.registerTime}</div>
                                {user.sex === 1 && <div>Gender: Male</div>}
                                {user.sex === 2 && <div>Gender: Female</div>}
                                {user.sex === 3 && <div>Gender: Unknown</div>}
                                <div>Phone: {user.phone}</div>
                            </div>
                            <div className={userStyle.second}>
                                <div>Personal Introduction</div>
                                <div style={{marginTop: '0.3rem', fontSize: '0.9rem'}}>{user.info}</div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={userStyle.right}></div>
            </div>
            <div className={userStyle.main}>
                <div className={userStyle.left}></div>
                <div className={userStyle.detail}>
                    <div className={userStyle.article}>
                        <div className={userStyle.category}>
                            <div onClick={() => setCheckQueryType(1)} className={checkQueryType === 1 ? userStyle.selectItem : userStyle.item}>All Articles</div>
                            <div onClick={() => setCheckQueryType(2)} className={checkQueryType === 2 ? userStyle.selectItem : userStyle.item}>Blog Posts</div>
                            <div onClick={() => setCheckQueryType(3)} className={checkQueryType === 3 ? userStyle.selectItem : userStyle.item}>Q&A Posts</div>
                            <div onClick={() => setCheckQueryType(4)} className={checkQueryType === 4 ? userStyle.selectItem : userStyle.item}>Liked Articles</div>
                            <div onClick={() => setCheckQueryType(5)} className={checkQueryType === 5 ? userStyle.selectItem : userStyle.item}>Collected Articles</div>
                            {
                                loginUser.id === user.id &&
                                    <>
                                        <div onClick={() => setCheckQueryType(6)} className={checkQueryType === 6 ? userStyle.selectItem : userStyle.item}>Pending Review</div>
                                        <div onClick={() => setCheckQueryType(7)} className={checkQueryType === 7 ? userStyle.selectItem : userStyle.item}>Unsolved</div>
                                        <div onClick={() => setCheckQueryType(8)} className={checkQueryType === 8 ? userStyle.selectItem : userStyle.item}>Solved</div>
                                        <div onClick={() => setCheckQueryType(9)} className={checkQueryType === 9 ? userStyle.selectItem : userStyle.item}>Approved</div>
                                        <div onClick={() => setCheckQueryType(10)} className={checkQueryType === 10 ? userStyle.selectItem : userStyle.item}>Rejected</div>
                                        <div onClick={() => setCheckQueryType(11)} className={checkQueryType === 11 ? userStyle.selectItem : userStyle.item}>Draft</div>
                                    </>
                            }
                        </div>
                    </div>
                    <ArticleList showEdit={loginUser.id === user.id} articleList={articleList}/>
                    <div className={userStyle.pagination}>
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
                <div className={userStyle.side}>
                    <div className={userStyle.attentionList}>
                        <Card title={'Following (' + attentionTotal + ")" } extra={<span onClick={() => {
                            setModalVisible(true);
                            setViewList(allAttentionList);
                            setModalTitle("Following List")
                        }} style={{color: '#28a745', cursor: 'pointer'}}>More</span>}>
                            <div className={userStyle.attentionUser}>
                                {
                                    attentionList.length > 0 ? (
                                        <>
                                            {
                                                attentionList.map((item, index) => {
                                                    return (
                                                        <div key={index} className={userStyle.user}  onClick={() => history.push("/user/" + item.toId)}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=" + item.toUserDTO.headPic} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}>{item.toUserDTO.username}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                gapAttentionList.map((item, index) => {
                                                    return (
                                                        <div style={{visibility: 'hidden'}} key={index} className={userStyle.user}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=common/no_image.jpg"} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}></div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <Empty style={{width: '100%'}} description="No Data" />
                                    )
                                }
                            </div>
                        </Card>
                    </div>
                    <div className={userStyle.attentionList} style={{marginTop: '1rem'}}>
                        <Card title={'Fans (' + fanTotal + ")" } extra={<span onClick={() => {
                            setModalVisible(true);
                            setViewList(allFanList);
                            setModalTitle("Fans List")
                        }} style={{color: '#28a745', cursor: 'pointer'}}>More</span>}>
                            <div className={userStyle.attentionUser}>
                                {
                                    fanList.length > 0 ? (
                                        <>
                                            {
                                                fanList.map((item, index) => {
                                                    return (
                                                        <div key={index} className={userStyle.user} onClick={() => history.push("/user/" + item.fromId)}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=" + item.fromUserDTO.headPic} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}>{item.fromUserDTO.username}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                gapFanList.map((item, index) => {
                                                    return (
                                                        <div style={{visibility: 'hidden'}} key={index} className={userStyle.user}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=common/no_image.jpg"} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}></div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <Empty style={{width: '100%'}} description="No Data" />
                                    )
                                }
                            </div>
                        </Card>
                    </div>
                </div>
                <div className={userStyle.right}></div>
            </div>
            <CommonFooter />
            <Modal
                maskClosable={false}
                title="Edit Profile"
                okText="Confirm"
                destroyOnClose={true}
                onOk={() => submitEditUser()}
                cancelText="Cancel"
                onCancel={() => {
                    setEditModalVisible(false)
                }}
                visible={editModalVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="Nickname">
                        {getFieldDecorator('username', {
                            initialValue: editUser.username,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your nickname!',
                                }
                            ],
                        })(<Input placeholder="Please enter your nickname"/>)}
                    </Form.Item>
                    <Form.Item label="Avatar">
                        <img style={{width: '90px', height: '60px'}} src={commonContext.serverUrl + "/common/photo/view?filename=" + editUser.headPic} alt="" />
                        <Upload {...uploadProps} showUploadList={false}>
                            <Button type="primary" style={{marginLeft: '10px'}}>
                                <Icon type="upload" /> Upload Avatar
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Password">
                        {getFieldDecorator('password', {
                            initialValue: editUser.password,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your password!',
                                }
                            ],
                        })(<Input type="password" placeholder="Please enter your password"/>)}
                    </Form.Item>
                    <Form.Item label="Phone">
                        {getFieldDecorator('phone', {
                            initialValue: editUser.phone,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter your phone number!',
                                }
                            ],
                        })(<InputNumber style={{width: '100%'}} min={0} placeholder="Please enter your phone number"/>)}
                    </Form.Item>
                    <Form.Item label="Gender">
                        {getFieldDecorator('sex', {
                            initialValue: editUser.sex
                        })(
                            <Radio.Group>
                                <Radio value={1}>Male</Radio>
                                <Radio value={2}>Female</Radio>
                                <Radio value={3}>Unknown</Radio>
                            </Radio.Group>)}
                    </Form.Item>
                    <Form.Item label="Introduction">
                        {getFieldDecorator('info', {
                            initialValue: editUser.info
                        })(
                            <TextArea rows={4} />)}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )

};

export default Form.create()(User);
