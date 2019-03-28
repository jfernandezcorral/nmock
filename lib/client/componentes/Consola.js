import React from 'react'
import styles from'./Consola.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')
export default class Consola extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            registros: []
        }
        this.add = this.add.bind(this)
    }
    componentWillMount(){
        this.setState({registros: mainProcess.getConsola()})
        ipcRenderer.on('consola', this.add)
    }
    componentWillUnmount(){
        ipcRenderer.off('consola', this.add)
    }
    add(e, reg){
        //console.log(reg)
        if (reg=="<reset/>"){
            this.setState({registros: []})
            return
        }
        this.setState((st)=>{return {registros: [reg, ...st.registros]}})
    }
    render() {
        const {registros} = this.state 
        return (
        	<section className={cx('consola')}>
        		{registros.map(r=>{return(
                    <div className={cx('registro')} key={r.u}>
                        {r.txt}
                    </div>
                )})}
        	</section>
        );
    }
}
