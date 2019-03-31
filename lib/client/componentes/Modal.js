import React from 'react'
import ReactDOM from 'react-dom'
import styles from'./Modal.scss'
import cn from 'classnames/bind'
const cx = cn.bind(styles)
const Modal = ({children, onClose=()=>{}, open})=>{
    const close = (e)=>{
        const target = e.target
        target.closest('.' + cx('pop')).style.transform = 'scale(.1)'
        target.closest('.' + cx('modal')).querySelector('.' + cx('velo')).style.opacity = 0
        setTimeout(onClose, 300)
    }
    if (open){
        return ReactDOM.createPortal(<div className={cx('modal')}>
            <div className={cx('velo')}></div>
            <div className={cx('pop')}>
                <div className={cx('head')}>
                    <div className={cx('aspa')} onClick={close}></div>
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