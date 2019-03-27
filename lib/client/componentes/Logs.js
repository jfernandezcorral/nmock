import React from 'react'
import styles from'./Logs.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')
export default class Logs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            registros: []
        }
    }
    componentDidMount(){
        this.setState({registros: mainProcess.getLog()})
    }
    render() {
        return (
        	<section className={cx('logs')}>
        		logs
        	</section>
        );
    }
}
