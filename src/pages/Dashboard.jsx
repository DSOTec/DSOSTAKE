import React from 'react'
import StakingNavbar from '../components/StakingNavbar'
import StakingOverview from '../components/StakingOverview'
import StakeWithdrawal from '../components/StakeWithdrawInterface'
import Protocol from '../components/Protocol'
import EmergencyWithdrawModal from '../components/EmergencyWithdrawModal'
import RecentStakes from '../components/RecentStakes'

const Dashboard = () => {
  return (
   <>
   <StakingNavbar />
   
   <StakeWithdrawal />
   {/* <EmergencyWithdrawModal /> */}
   {/* <div className='flex justify-between gap-4'>
    <div><RecentStakes /></div>
    <div> <Protocol /></div>
    
   </div> */}

   </>
  )
}

export default Dashboard