import React from 'react'
import PropTypes from 'prop-types'
import styles from'./MenuBar.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
export default class MenuBar extends React.Component {
    constructor(props) {
        super(props)
        this.changeView = this.changeView.bind(this)
    }
    changeView(e){
        this.props.setView(e.target.getAttribute('data-id'))
    }
    render() {
        const {view} = this.props
        return (
        	<nav className={cx('menuBar')}>
        		<div data-id="log" title="log" onClick={this.changeView} className={cx('ico', 'logs', {sel: view=='log'})}></div>
                <div data-id="consola" title="consola" onClick={this.changeView} className={cx('ico', 'consola', {sel: view=='consola'})}></div>
                <div className={cx('espacio')}></div>
                <div data-id="cfg" title="configuración" onClick={this.changeView} className={cx('ico', 'engine', {sel: view=='cfg'})}></div>
        	</nav>
        );
    }
}
MenuBar.propTypes = {
    setView: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired
}