import Sessionmain from '@/components/Sessionmain'
import SessionRules from '@/components/SessionRules'
import Footer from "../components/footer.tsx"
import React from 'react'

function Session() {
  return (
    <div>
        <SessionRules/>
        <Sessionmain/>
        <Footer/>
    </div>
  )
}

export default Session