import React from 'react'
import styles from'./App.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
export default class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
        	<div className={cx('app')}>
        		<section className={cx('toolBar')}>
                    tool bar
                </section>
                <section className={cx('principal')}>
                    hola
                </section>
        	</div>
        );
    }
}