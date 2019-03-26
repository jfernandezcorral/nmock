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
        this.changeMock = this.changeMock.bind(this)
        this.state = {
            iniciado: false,
            mock: true
        }
    }
    componentDidMount(){
        ipcRenderer.on('serverInit', (e)=>{
            this.setState({iniciado: true})
        })
        ipcRenderer.on('serverStop', (e)=>{
            this.setState({iniciado: false, mock: true})
        })
    }
    iniciar(){
        mainProcess.iniciaServer()
    }
    parar(){
        mainProcess.paraServer()
    }
    changeMock(){
        mainProcess.changeMock(!this.state.mock)
        this.setState((st)=>({mock: !st.mock}))
    }
    render() {
        const {iniciado, mock} = this.state
        return (
        	<div className={cx('bar')}>
        		<span className={cx('boton', {disabled: iniciado})} onClick={this.iniciar}>
                    Iniciar
                </span>
                <span className={cx('boton', {disabled: !iniciado})} onClick={this.parar}>
                    Parar
                </span>
                <span className={cx('boton', {disabled: !iniciado})} onClick={this.changeMock}>
                    Mock
                </span>
                <div></div>
                <span className={cx('status', {
                    iniciado: iniciado,
                    parado: !iniciado,
                    nomock: (iniciado && !mock)
                })}>
                    {iniciado?(mock?'iniciado': 'gateway'): 'parado'}
                </span>
        	</div>
        );
    }
}