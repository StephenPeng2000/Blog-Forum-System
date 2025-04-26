import articleListStyle from './ArticleList.module.scss'
import {Icon, Tag, Empty} from "antd";
import {useContext} from "react";
import CommonContext from "../../context/CommonContext";
import {useHistory} from "react-router-dom";
import _ from 'lodash'
import * as React from "react";

const compare = (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps)
};

const ArticleList = (props) => {

    const commonContext = useContext(CommonContext);
    const history = useHistory();


    return (
        <>
            <div className={articleListStyle.articleList}>
                {
                    props.articleList && props.articleList.length > 0 ? (
                        <React.Fragment>
                            {
                                props.articleList.map((item, index) => {
                                    return (
                                        <div key={index} className={articleListStyle.article}>
                                            <div className={articleListStyle.title}>
                                                <div>
                                                    {
                                                        props.showEdit &&
                                                        <>
                                                            {
                                                                item.state !== 3 && <span title="Edit Article" onClick={() => history.push("/editor/edit/" + item.id)} style={{fontSize: '1rem', marginRight: '0.5rem', cursor: 'pointer'}}><Icon type="edit" /></span>
                                                            }
                                                            <span>
                                                                {item.state === 1 && <Tag color="#108ee9">Pending Review</Tag>}
                                                                {item.state === 2 && <Tag color="#108ee9">Unsolved</Tag>}
                                                                {item.state === 3 && <Tag color="#108ee9">Solved</Tag>}
                                                                {item.state === 4 && <Tag color="#108ee9">Approved</Tag>}
                                                                {item.state === 5 && <Tag color="#108ee9">Rejected</Tag>}
                                                                {item.state === 6 && <Tag color="#108ee9">Draft</Tag>}
                                                            </span>
                                                        </>

                                                    }
                                                    <span>
                                                           {
                                                               item.official === 2 && <Tag color="green">Official</Tag>
                                                           }
                                                    </span>
                                                    <span>
                                                         {
                                                             item.top === 2 && <Tag color="blue">Top</Tag>
                                                         }
                                                    </span>
                                                    <span>
                                                         {
                                                             item.essence === 2 && <Tag color="red">Featured</Tag>
                                                         }
                                                    </span>
                                                    <span onClick={() => history.push('/blog/detail/' + item.id)} className={articleListStyle.name} >{item.title}</span>
                                                </div>
                                            </div>
                                            <div className={articleListStyle.summary}>
                                                {item.summary}
                                            </div>
                                            <div className={articleListStyle.footer}>
                                                <span style={{marginRight: '0.5rem'}}>
                                                    <img src={commonContext.serverUrl + '/common/photo/view?filename=' + item.userDTO.headPic} style={{marginBottom: '0.2rem'}} alt='' width='15' height='15'/>
                                                </span>
                                                <span className={articleListStyle.username} onClick={() => history.push('/user/' + item.userId)}>
                                                    {item.userDTO.username}
                                                </span>
                                                <span style={{margin: '0 0.5rem 0 1.5rem'}} title="Publish Time">
                                                    <Icon type="history" />
                                                </span>
                                                <span>
                                                    {item.createTime}
                                                </span>
                                                <span style={{margin: '0 0.5rem 0 1.5rem'}} title="Views">
                                                    <Icon type="eye" />
                                                </span>
                                                <span>
                                                    {item.viewNum}
                                                </span>
                                                <span style={{margin: '0 0.5rem 0 1.5rem'}} title="Likes">
                                                    <Icon type="like" />
                                                </span>
                                                <span>
                                                     {item.likeNum}
                                                </span>
                                                <span style={{margin: '0 0.5rem 0 1.5rem'}} title="Comments">
                                                    <Icon type="message" />
                                                </span>
                                                <span>
                                                     {item.commentNum}
                                                </span>
                                                <span style={{margin: '0 0.5rem 0 1.5rem'}} title="Favorites">
                                                    <Icon type="heart" />
                                                </span>
                                                <span>
                                                     {item.collectNum}
                                                </span>
                                                <span style={{margin: '0 0.5rem 0 1.5rem'}} title="Category">
                                                    <Icon type="appstore" />
                                                </span>
                                                <span>{item.categoryDTO.name}</span>
                                                <span style={{margin: '0 0.5rem 0 1.5rem'}} title="Tags">
                                                    <Icon type="tag" />
                                                </span>
                                                {
                                                    item.tagDTOList && item.tagDTOList.map((tag, tagIndex) => {
                                                        return (
                                                            <span key={tagIndex} style={{marginRight: '0.5rem'}}>
                                                                {tag.name}
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </React.Fragment>
                    ) : (
                        <Empty imageStyle={{marginTop: '8rem'}} style={{height: '25rem'}} description="No Data" />
                    )
                }
            </div>

        </>
    )

};


export default React.memo(ArticleList, compare);
