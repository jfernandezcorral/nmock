import React from 'react'
import styles from'./Editor.scss'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
const rg1 = /^\t/gm
const rg2 = /^/gm
export default class Editor extends React.Component {
    constructor(props) {
        super(props)
        this.el = undefined
        this.state = {
            txt: this.props.txt
        }
        this.keydown = this.keydown.bind(this)
    }
    keydown(e){
        const key = e.keyCode
        if (key == 9){
            e.preventDefault()
            let val = this.el.value
            const start = this.el.selectionStart
            const end = this.el.selectionEnd
            let selected = val.substring(start, end)
            let count
            if (e.shiftKey){
                count = -selected.match(rg1).length
                this.el.value = val.substring(0, start) + selected.replace(rg1, '') + val.substring(end);
            }
            else{
                count = selected.match(rg2).length;
                this.el.value = val.substring(0, start) + selected.replace(rg2, '\t') + val.substring(end);
            }
            if(start === end) {
                this.el.selectionStart = end + count
            } else {
                this.el.selectionStart = start
            }
            this.el.selectionEnd = end + count
        }
    }
    componentDidMount(){
        this.el.addEventListener('keydown', this.keydown)
    }
    componentWillUnmount(){
        this.el.removeEventListener('keydown', this.keydown)
    }
    render() {
        return (
        	<textarea defaultValue={this.state.txt} className={cx('editor')} ref={el=>this.el=el}></textarea>
        )
    }
}

Editor.propTypes = {
    txt: PropTypes.string.isRequired
}