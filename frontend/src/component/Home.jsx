import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleerror, handlesuccess } from '../assets/utility'
import { ToastContainer } from 'react-toastify'
import ResponsiveSidebar from './ResponsiveSidebar'
import MainContent from './MainContent'
import Profile from './Profile'
import DashboardTasks from './DashboardTasks'
import Maps from './Maps'
const Home = () => {
    
    const [loggeduser, setloggeduser] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        setloggeduser(localStorage.getItem('loggeduser'))
    }, [])

    setTimeout(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
    }, 10)

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:8080/products/"
            const headers = {
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers)
            const result = await response.json()
            console.log(result);

        } catch (error) {
            handleerror(error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handlelogout = (e) => {
        localStorage.removeItem('loggeduser')
        localStorage.removeItem('token')
        handlesuccess('User Loggedout')
        setTimeout(() => {
            navigate('/login')
        }, 1000);
    }


    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (

        <div className='home md:grid grid-cols-header'>
            <ResponsiveSidebar />
            <main className="md:pl-16 md:transition-all md:duration-300 md:data-[expanded=true]:pl-64">
                home
            </main>
        </div>




    )
}

export default Home