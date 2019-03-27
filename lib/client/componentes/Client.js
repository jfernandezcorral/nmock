import React from 'react'
import PropTypes from 'prop-types'
import styles from'./Client.scss'
import cn from 'classnames/bind'
import Logs from './Logs'
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
        	</section>
        );
    }
}
Client.propTypes = {
    view: PropTypes.string.isRequired
}