import React from 'react'
import PropTypes from 'prop-types'
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
        this.add = this.add.bind(this)
    }
    componentWillMount(){
        this.setState({registros: mainProcess.getLog()})
        ipcRenderer.on('log', this.add)
    }
    componentWillUnmount(){
        ipcRenderer.off('log', this.add)
    }
    add(e, reg){
        //console.log(reg)
        if (reg=="<reset/>"){
            this.setState({registros: mainProcess.getLog()})
            return
        }
        this.setState((st)=>{return {registros: [reg, ...st.registros]}})
    }
    getClass(txt){
        if (txt.indexOf('+')==0){
            return "nuevo"
        }
        else if (txt.indexOf('#')==0){
            return "mock"
        }
        else if (txt.indexOf('&')==0){
            return "concurrente"
        }
        else if (txt.indexOf('@')==0){
            return "timeout"
        }
    }
    render() {
        const {registros} = this.state 
        return (
        	<section className={cx('logs', {noVisible: !this.props.visible})}>
        		{registros.map(r=>{return(
                    <div className={cx('registro',this.getClass(r.txt))} key={r.uniq}>
                        {`${r.obj && r.obj.method} ${r.obj && r.obj.url}`}
                    </div>
                )})}
        	</section>
        );
    }
}
Logs.propTypes = {
    visible: PropTypes.bool.isRequired
}