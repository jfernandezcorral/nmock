import React from 'react'
import styles from'./Config.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
import Editor from './Editor'
const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')
export default class Config extends React.Component {
    constructor(props) {
        super(props)
        this.original = ""
        this.state = {
            txt: "",
            mod: false,
            error: false,
            text_error: ""
        }
        this.salvar = this.salvar.bind(this)
        this.update = this.update.bind(this)
    }
    componentWillMount(){
        this.original = mainProcess.getCfg()
        this.setState({txt: this.original})
    }
    componentWillUnmount(){
        //ipcRenderer.off('save-resp', this.add)
    }
    salvar(){
        mainProcess.salvar(this.state.txt).then(txt=>{
            this.original = txt
            this.setState({txt, mod: false, error: false, text_error: ""})
        })
        .catch(e=>{
            this.setState({text_error: e})
        })
    }
    isParse(txt){
        let ret = false
        try{
            const kk = JSON.parse(txt)
            ret = true
        }
        catch(e){console.log("Error parseando", e)}
        return ret
    }
    update(txt){
        this.setState({txt, mod: this.original != txt, error: !this.isParse(txt)})
    }
    render() {
        const {txt, error, mod, text_error} = this.state 
        return (
        	<section className={cx('config')}>
        		<Editor txt={txt} update={this.update} error={error}/>
                <div className={cx('botones')}>
                    <div onClick={this.salvar} className={cx('boton', {disabled: error || !mod})}>Guardar</div>
                    <div className={cx('error')}>{text_error}</div>
                </div>
        	</section>
        );
    }
}
