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
        this.state = {
            txt: "",
            mod: false,
            error: false
        }
        this.salvar = this.salvar.bind(this)
        this.update = this.update.bind(this)
    }
    componentWillMount(){
        this.setState({txt: mainProcess.getCfg()})
    }
    componentWillUnmount(){
        //ipcRenderer.off('save-resp', this.add)
    }
    salvar(){
        console.log("dgfs")
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
        this.setState({txt, mod: true, error: !this.isParse(txt)})
    }
    render() {
        const {txt, error} = this.state 
        return (
        	<section className={cx('config')}>
        		<Editor txt={txt} update={this.update} error={error}/>
        	</section>
        );
    }
}
