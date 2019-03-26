import React from 'react'
import styles from'./App.scss'
import cn from 'classnames/bind'
import ToolBar from './ToolBar'
const cx = cn.bind(styles)
export default class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
        	<div className={cx('app')}>
        		<section className={cx('toolBar')}>
                    <ToolBar/>
                </section>
                <section className={cx('principal')}>
                    hola
                </section>
        	</div>
        );
    }
}