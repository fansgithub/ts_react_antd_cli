import * as React from 'react';
import { Icon } from 'antd';
import {observer} from 'mobx-react';
import store from './store';

@observer
class Counter extends React.Component{
    constructor(props:any){
        super(props);
    }
    render(){
        return (
            <div>
                <p>当前数量为： {store.num}</p>
                <div onClick={()=>{store.increase()}}>
                    <Icon type="caret-up" />
                </div>
                <div onClick={()=>{store.decrease()}}>
                    <Icon type="caret-down" />
                </div>
            </div>
        )
    }
}
export default Counter;