import React from 'react'
import ReactDOM from 'react-dom'
import styles from'./Modal.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
const Modal = ({children, onClose=()=>{}, open})=>{
    if (open){
        return ReactDOM.createPortal(<div className={cx('modal')}>
            <div className={cx('velo')}></div>
            <div className={cx('pop')}>
                <div className={cx('head')}>
                    <div className={cx('aspa')} onClick={onClose}></div>
                </div>
                <div className={cx('content')}>
                    {children}
                </div>
            </div>
        </div>, document.body)
    }
    return null
}

export default Modal