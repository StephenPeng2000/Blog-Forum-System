import React, {Component} from "react";
import { Empty } from 'antd';
import notFoundStyle from './NotFound.module.scss'

class NotFound extends Component {

    render() {
        return (
            <React.Fragment>
                <Empty className={notFoundStyle.empty} description="Page not found" imageStyle={{width:'200px', height: '200px'}} />
            </React.Fragment>
        );
    }
}

export default NotFound;
