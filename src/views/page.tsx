import * as React from 'react';
import Test from '@components/test';
import Counter from '@views/counter/counter';

export default class Page extends React.Component{
    render(){
        return (
            <div>
                page
                <Test />
                <Counter />
            </div>
        )
    }
}