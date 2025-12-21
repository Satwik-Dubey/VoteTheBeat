import Sessionmain from '@/components/Sessionmain'
import SessionRules from '@/components/SessionRules'
import Navbar from '@/components/navbar'
import Footer from "@/components/footer"
import React from 'react'
import { useParams } from "react-router-dom"

function Session() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div>
      <Navbar />
      <SessionRules />
      <Sessionmain />
      <Footer />
    </div>
  )
}

export default Session