import React from 'react'
import PropTypes from 'prop-types'
import styles from'./Logs.scss'
import cn from 'classnames/bind'
import Modal from './Modal'
const cx = cn.bind(styles)
const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')
export default class Logs extends React.Component {
    constructor(props) {
        super(props)
        this.open = true
        this.state = {
            registros: [],
            modalOpened: false,
            selected: undefined
        }
        this.add = this.add.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.ver = this.ver.bind(this)
    }
    componentWillMount(){
        this.setState({registros: []})
        ipcRenderer.on('log', this.add)
    }
    componentWillUnmount(){
        ipcRenderer.off('log', this.add)
    }

    add(e, reg){
        if (!this.open){
            setTimeout(()=>this.add(e, reg), 10)
            return
        }
        this.open = false
        if (reg=="<reset/>"){
            this.setState({registros: []}, ()=>{this.open=true})
            return
        }
        else if(reg.obj.pending){
            this.setState((st)=>{return {registros: [reg, ...st.registros]}}, ()=>{this.open=true})
        }
        else{
            this.setState((st)=>{
                    let encontrado = false
                    const newState = st.registros.map(r=>{
                        if (r.hash == reg.hash && r.obj.pending && !encontrado){
                            encontrado = true
                            return reg
                        }
                        else{
                            return r
                        }
                    })
                    return {registros: newState}
                },
                ()=>{this.open=true}
            )
        }
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
        else{
            return "pending"
        }
    }
    closeModal(){
        this.setState({modalOpened: false, selected: undefined})
    }
    ver(e){
        const hash = e.target.getAttribute('data-id')
        const data = mainProcess.verHash(hash)
        data && this.setState({modalOpened: true, selected: data})
    }
    render() {
        const {registros, modalOpened, selected} = this.state 
        return (
        	<section className={cx('logs', {noVisible: !this.props.visible})}>
        		{registros.map(r=>{return(
                    <div data-id={r.hash} onClick={this.ver}
                        className={cx('registro',this.getClass(r.txt), {warning: r.obj.warning})}
                    key={r.uniq}>
                        {`${r.obj && r.obj.method} ${r.obj && r.obj.url}`}
                    </div>
                )})}
                <Modal open={modalOpened} onClose={this.closeModal}>
                    {selected?
                        (<div>
                            <div className={cx('caption')}>Method:{selected.method}</div>
                            <div className={cx('caption')}>Url:{selected.url}</div>
                            <div className={cx('caption')}>Remoto:
                                {selected.remoto && JSON.stringify(selected.remoto)}
                            </div>
                            <div className={cx('caption')}>Body:{selected.body}</div>
                            <div style={{whiteSpace: 'pre-line'}} className={cx('caption')}>{selected.respuesta}</div>
                        </div>):
                    null}
                </Modal>
        	</section>
        );
    }
}
Logs.propTypes = {
    visible: PropTypes.bool.isRequired
}
