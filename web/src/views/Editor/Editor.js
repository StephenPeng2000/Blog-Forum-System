import {Input, message, Modal, Select, ConfigProvider} from 'antd';
import editorStyle from './Editor.module.scss'
import hljs from "highlight.js";
import 'highlight.js/styles/base16/onedark.css';
import zhCN from "antd/es/locale/zh_CN";
import { marked } from 'marked'
import {useContext, useEffect, useRef, useState} from 'react'
import EditorContent from 'for-editor'
import { useHistory } from 'react-router-dom';
import axios from "axios";
import CommonContext from '../../context/CommonContext';
const { TextArea } = Input;
const { confirm } = Modal;

const Editor = (props) => {

    const inputTitle = useRef();
    const editor = useRef();
    const [loginUser, setLoginUser] = useState({});
    const [imgUpload, setImgUpload] = useState(false);
    const [article, setArticle] = useState({});
    const [categoryList, setCategoryList] = useState([]);
    const [tagList, setTagList] = useState([]);
    const commonContext = useContext(CommonContext);
    const history = useHistory();

    // focus on title, initialize markdown editor
    useEffect(() => {
        inputTitle.current.focus();
        // configure marked
        let renderer = new marked.Renderer();
        // configure link, open new browser window when clicking link
        renderer.link = function( href, title, text ) {
            return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
        };
        marked.setOptions({
            renderer: renderer,
            highlight: function(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
        return () => { // triggered when page is destroyed
        }
    }, []);


    useEffect(() => {
        // check if login
        checkLogin();
        // get article category data
        getAllCategory();
        // get article tag data
        getAllTag();
        return () => { // triggered when page is destroyed
        }
    }, []);

    useEffect(() => {
        if(imgUpload) {
            let markDown = article.contentMarkdown + "\n";
            setArticle({...article, contentHtml: marked.parse(markDown), contentMarkdown: markDown});
            setImgUpload(false);
        }
        return () => { // triggered when page is destroyed
        }
    }, [imgUpload]);

    useEffect(() => {
        const { match: { params = "" } } = props;
        if(params.operate !== 'add' && params.operate !== 'edit') {
            message.error("Invalid parameter!");
            history.push("/index");
        }
        if(params.operate === 'add' && params.id != 1 && params.id != 2) {
            message.error("Invalid parameter!");
            history.push("/index");
        }
        if(params.operate === 'edit') {
            // get article data by id
            getArticleById(params.id)
        }
        return () => { // triggered when page is destroyed
        }
    }, [tagList, categoryList]);


    // check if login
    const checkLogin = () => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/check_login',{token: token})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if (global.tools.isNotEmpty(resp.data.token)) {
                        setLoginUser(resp.data);
                        setArticle({...article, userId: resp.data.id});
                    } else {
                        message.error('User login has expired, please log in again!');
                        history.push("/index");
                    }
                } else {
                    message.error('User login has expired, please log in again!');
                    history.push("/index");
                }
            })
            .catch(function (error) {
                message.error('Network error, user login has expired, please log in again!');
                history.push("/index");
            })
    };

    // get article category data
    const getAllCategory = () => {
        axios.post(commonContext.serverUrl + '/web/category/all')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setCategoryList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get article category data!');
            })
    };

    // get article data by id
    const getArticleById = (id) => {
        axios.post(commonContext.serverUrl + '/web/article/get', {id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    let tagList = [];
                    resp.data.tagDTOList.forEach(item => {
                        tagList.push(item.id);
                    });
                    resp.data.tagList = tagList;
                    resp.data.contentMarkdown = resp.data.contentMarkdown + "\n";
                    setArticle(resp.data);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get article data by id!');
            })
    };

    // get article tag data
    const getAllTag = () => {
        axios.post(commonContext.serverUrl + '/web/tag/all')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setTagList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to get article tag data!');
            })
    };

    // save article info
    const saveArticle = (state, type) => {
        const { match: { params = '' } } = props;
        let data = {};
        if(params.operate === 'add') {
            data = {
                ...article,
                state,
                type: params.id,
                tagList: article.tagList ? article.tagList.join(";") : ''
            };
        }
        if(params.operate === 'edit') {
            data = {
                ...article,
                state,
                tagList: article.tagList ? article.tagList.join(";") : ''
            };
        }

        axios.post(commonContext.serverUrl + '/web/article/save', data)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if(type === 1) {
                        let tagList = [];
                        resp.data.tagDTOList.forEach(item => {
                            tagList.push(item.id);
                        });
                        resp.data.tagList = tagList;
                        resp.data.contentMarkdown = resp.data.contentMarkdown + "\n";
                        setArticle(resp.data);
                        message.success(resp.msg);
                    } else if(type === 2) {
                        message.success("Publish successfully!");
                        history.push("/index");
                    }
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to save article info!');
            })
    };

    // when the content of the editor changes
    const handleChange = (value) => {
        setArticle({...article, contentHtml: marked.parse(value), contentMarkdown: value});
    };

    // upload image
    const addImg = (file) => {
        let config = {
            headers:{'Content-Type':'multipart/form-data'}
        };
        let formData = new FormData();
        formData.append('photo', file);
        axios.post(commonContext.serverUrl + '/common/photo/upload_photo', formData, config)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    editor.current.$img2Url(file.name, commonContext.serverUrl + '/common/photo/view?filename=' + resp.data);
                    setImgUpload(true);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('Network error, failed to upload image!');
            })
    };

    // back to home page
    const backHome = () => {
        confirm({
            title: 'Notice',
            content: 'Are you sure to return to the home page?',
            okText: 'Yes',
            cancelText: 'Cancel',
            onOk() {
                history.push("/index")
            },
            onCancel() {
            },
        });
    };


    return (
        <div className={editorStyle.editor}>
            <div className={editorStyle.title}>
                <div className={editorStyle.back} onClick={() => backHome()}>
                    Back to Home Page
                </div>
                <div style={{width: '80%', paddingTop: '0.5rem'}}>
                    <Input defaultValue={article.title} value={article.title} onChange={ e => setArticle({...article, title: e.target.value}) } ref={inputTitle} className={editorStyle.input} placeholder="Please enter the article title here"/>
                </div>
            </div>
            <div className={editorStyle.content}>
                <EditorContent onSave={() => saveArticle(6, 1)} ref={editor} preview={true} subfield={true}
                   addImg={($file) => addImg($file)}
                   value={article.contentMarkdown} onChange={handleChange}/>
            </div>
            <div className={editorStyle.footer}>
                <div className={editorStyle.left}>
                    <div style={{width: '50%'}}>
                        <Select defaultValue={article.categoryId} value={article.categoryId} onChange={ e => setArticle({...article, categoryId: e}) }  style={{width: '100%'}} placeholder="Please select the article category">
                            {
                                categoryList && categoryList.map((item, index) => {
                                    return (
                                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div style={{width: '50%', marginLeft: '1rem'}} >
                        <ConfigProvider locale={zhCN}>
                            <Select mode="multiple" defaultValue={article.tagList} value={article.tagList} onChange={ e => {
                                if(e.length > 3) {
                                    message.warning("You can only select up to 3 tags!")
                                } else {
                                    setArticle({...article, tagList: e});
                                }
                            } } style={{width: '100%'}} placeholder="Please select the article tags">
                                {
                                    tagList && tagList.map((item, index) => {
                                        return (
                                            <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </ConfigProvider>
                    </div>

                </div>
                <div className={editorStyle.center}>
                    <TextArea rows={1} defaultValue={article.summary} value={article.summary} onChange={ e => setArticle({...article, summary: e.target.value}) } placeholder="Please enter the article summary" />
                </div>
                <div className={editorStyle.right}>
                    <div className={editorStyle.save} onClick={() => saveArticle(6, 1)}>
                        Save to Draft
                    </div>
                    <div className={editorStyle.submit} onClick={() => saveArticle(1, 2)}>
                        Publish
                    </div>
                </div>
            </div>

        </div>
    )

};

export default Editor;
