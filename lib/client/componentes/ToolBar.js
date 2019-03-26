import React from 'react'
import styles from'./ToolBar.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')
export default class ToolBar extends React.Component {
    constructor(props) {
        super(props)
        this.iniciar = this.iniciar.bind(this)
        this.parar = this.parar.bind(this)
    }
    componentDidMount(){
        ipcRenderer.on('serverInit', (e)=>{
            console.log('serverInit')
        })
        ipcRenderer.on('serverStop', (e)=>{
            console.log('serverStop')
        })
        ipcRenderer.on('running', (e)=>{
            console.log('running')
        })
        ipcRenderer.on('stopped', (e)=>{
            console.log('stopped')
        })
    }
    iniciar(){
        mainProcess.iniciaServer()
    }
    parar(){
        mainProcess.paraServer()
    }
    render() {
        return (
        	<div className={cx('bar')}>
        		<span className={cx('boton')} onClick={this.iniciar}>
                    Iniciar
                </span>
                <span className={cx('boton')} onClick={this.parar}>
                    Parar
                </span>
        	</div>
        );
    }
}