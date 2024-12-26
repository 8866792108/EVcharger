import {toast} from 'react-toastify'
export const handlesuccess=(msg)=>{
    toast.success(msg,{
        position:"top-center",
        autoClose:2000
    })
}
export const handleerror=(msg)=>{
    toast.error(msg,{
        position:"top-center",
        autoClose:2000
    })
}

export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
