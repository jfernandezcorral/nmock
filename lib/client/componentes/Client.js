import React from 'react'
import PropTypes from 'prop-types'
import styles from'./Client.scss'
import cn from 'classnames/bind'
import Logs from './Logs'
import Consola from './Consola'
import Config from './Config'
const cx = cn.bind(styles)
export default class Client extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {view} = this.props
        return (
        	<section className={cx('client')}>
                <Logs visible={view == 'log'}/>
                {view == 'consola' && <Consola/>}
                <Config visible={view == 'cfg'}/>
        	</section>
        );
    }
}
Client.propTypes = {
    view: PropTypes.string.isRequired
}