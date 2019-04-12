import * as React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import * as Loadable from 'react-loadable';

function Loading(){
    return <div>Loading...</div>
}

const Home = Loadable({
    loader: ()=> import('@views/home'),
    loading: Loading
})

const Page = Loadable({
    loader: ()=> {
        console.log('11111111， import page 文件')
        return import('@views/page')
    },
    loading: Loading
})
console.log(Page)

class App extends React.Component{
    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/page" component={Page} />
                    <Redirect to="/home"/>
                </Switch>
            </Router>
        )
    }
}
export default App;