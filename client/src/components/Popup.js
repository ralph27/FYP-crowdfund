import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoadingSpinner from './HomeComponents/LoadingSpinner'

function Popup({setUploading}) {
  const transaction = useSelector(state => state?.transaction)

  const handleClose = () => {
    setUploading(prev => !prev);
  }

  return (
    <div className='popup-wrapper'>
       {transaction?.pending && <LoadingSpinner />}
       {transaction?.pending && <h2 className='popup-title'>Transaction is pending</h2>}
       {!transaction?.pending && <h2 className='popup-title'>{transaction.status ? "Transaction is successfull" : "Transaction failed"}</h2>}
       {transaction?.pending && <a className='etherscan-link' href={`https://rinkeby.etherscan.io/tx/${transaction.tx}`} target="_blank" >Check transaction status here</a>}
       {!transaction?.pending && <p className='etherscan-link' onClick={handleClose}>Close</p>}
    </div>
  )
}

export default Popup