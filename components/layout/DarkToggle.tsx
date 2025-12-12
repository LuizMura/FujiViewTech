'use client'
import { useEffect, useState } from 'react'

export default function DarkToggle(){
  const [mode, setMode] = useState<'dark'|'light'>('light')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if(saved === 'dark') {
      document.documentElement.classList.add('dark')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode('dark')
    }
    setMounted(true)
  },[])
  
  if (!mounted) return null
  
  function toggle(){
    if(mode === 'dark'){
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme','light')
      setMode('light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme','dark')
      setMode('dark')
    }
  }
  return <button onClick={toggle} className="px-2 py-1 border rounded">{mode==='dark' ? '☀️' : '🌙'}</button>
}
