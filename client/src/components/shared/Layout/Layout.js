import React from 'react'
import Header from './Header';
import Sildebar from './Menus/Sildebar';

const Layout = ({children}) => {
  return (
    <>
      <div className='header'>
        <Header />
      </div>
      <div className='row g-0'>
        <div className='col-md-3'>
          <Sildebar />
        </div>
        <div className='col-md-9'>{children}</div> 
      </div>
    </>
  )
}

export default Layout
