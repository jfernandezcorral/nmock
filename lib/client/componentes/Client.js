import React from 'react'
import PropTypes from 'prop-types'
import styles from'./Client.scss'
import cn from 'classnames/bind'
import Logs from './Logs'
import Consola from './Consola'
const cx = cn.bind(styles)
export default class Client extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {view} = this.props
        return (
        	<section className={cx('client')}>
                {view == 'log' && <Logs/>}
                {view == 'consola' && <Consola/>}
        	</section>
        );
    }
}
Client.propTypes = {
    view: PropTypes.string.isRequired
}