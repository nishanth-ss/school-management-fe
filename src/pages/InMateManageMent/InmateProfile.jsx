import React from 'react'
import InmateProfileCard from '../../components/InmateProfileCard'
import useFetchData from '@/hooks/useFetchData'

function InmateProfile() {

    const userName = localStorage.getItem('username');
    const {data,error} = useFetchData(`student/profile/${userName}`);
    
    return (
        <div className='w-full p-20'>
            <InmateProfileCard inmate={data}/>
        </div>
    )
}

export default InmateProfile