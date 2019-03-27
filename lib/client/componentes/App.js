import React from 'react'
import styles from'./App.scss'
import cn from 'classnames/bind'
import ToolBar from './ToolBar'
import MenuBar from './MenuBar'
import Client from './Client'
const cx = cn.bind(styles)
export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            view: 'log'
        }
        this.setView = this.setView.bind(this)
    }
    setView(view){
        this.setState({view})
    }
    render() {
        return (
        	<div className={cx('app')}>
        		<section className={cx('toolBar')}>
                    <ToolBar/>
                </section>
                <section className={cx('principal')}>
                    <MenuBar setView={this.setView} view={this.state.view}/>
                    <Client view={this.state.view}/>
                </section>
        	</div>
        );
    }
}