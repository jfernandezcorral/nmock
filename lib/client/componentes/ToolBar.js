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
        this.save = this.save.bind(this)
        this.load = this.load.bind(this)
        this.changeMock = this.changeMock.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            iniciado: false,
            mock: true,
            cfg: [],
            selected:''
        }
    }
    componentDidMount(){
        const cfg = Object.keys(mainProcess.getCfgParsed())
        this.setState({cfg,  selected: cfg[0]})
        ipcRenderer.on('serverInit', (e)=>{
            this.setState({iniciado: true})
        })
        ipcRenderer.on('serverStop', (e)=>{
            this.setState({iniciado: false, mock: true})
        })
        ipcRenderer.on('cfgChange', (e, cfg)=>{
            cfg = Object.keys(cfg)
            this.setState({cfg, selected: cfg[0]})
        })
    }
    iniciar(){
        mainProcess.iniciaServer(this.state.selected)
    }
    parar(){
        mainProcess.paraServer()
    }
    save(){
        mainProcess.salvarActual()
    }
    load(){
        mainProcess.loadActual()
    }
    changeMock(){
        mainProcess.changeMock(!this.state.mock)
        this.setState((st)=>({mock: !st.mock}))
    }
    handleChange(e){
        this.setState({selected: e.target.value})
    }
    render() {
        const {iniciado, mock, cfg, selected} = this.state
        return (
        	<div className={cx('bar')}>
        		<span className={cx('boton', {disabled: iniciado})} onClick={this.iniciar}>
                    Iniciar
                </span>
                <span className={cx('boton', {disabled: !iniciado})} onClick={this.parar}>
                    Parar
                </span>
                <span className={cx('boton')} onClick={this.save}>
                    Guardar mock
                </span>
                <span className={cx('boton')} onClick={this.load}>
                    Cargar mock
                </span>
                <select disabled={iniciado} value={selected} onChange={this.handleChange}>
                    {cfg.map(k=><option key={k} value={k}>{k}</option>)}
                </select>
                <div></div>
                <span className={cx('boton', {disabled: !iniciado})} onClick={this.changeMock}>
                    Mock/gateway
                </span>
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