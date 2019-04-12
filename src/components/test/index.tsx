import * as React from 'react';
import { Button, Icon } from 'antd';

@log
class Test extends React.Component{
    render(){
        return (
            <div>
                test
                <Icon type="bar-chart" />
                <Button type="primary" />
            </div>
        )
    }
}
function log(target: any){
    console.log(target)
}

export default Test;