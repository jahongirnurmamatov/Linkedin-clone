import React from 'react'
import Layout from './components/Layout'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
const App = () => {
  return (
    <Layout >
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} />
      </Routes>
    </Layout>
  )
}

export default App