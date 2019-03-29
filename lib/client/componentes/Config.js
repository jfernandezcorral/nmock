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
            txt: "ghethue"
        }
        this.salvar = this.salvar.bind(this)
    }
    componentWillMount(){
        //this.setState({registros: mainProcess.getConsola()})
        //ipcRenderer.on('save-resp', this.add)
    }
    componentWillUnmount(){
        //ipcRenderer.off('save-resp', this.add)
    }
    salvar(e, txt){
        console.log(txt)
    }
    render() {
        const {txt} = this.state 
        return (
        	<section className={cx('config')}>
        		<Editor txt={txt}/>
        	</section>
        );
    }
}
