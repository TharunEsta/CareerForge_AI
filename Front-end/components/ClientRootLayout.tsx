'use client'

import React from 'react'
import SplashScreen from '@/components/ui/SplashScreen'

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = React.useState(true)

  React.useEffect(() => {
    const splashShown = sessionStorage.getItem('splash_shown')
    if (!splashShown) {
      setShowSplash(true)
      setTimeout(() => {
        setShowSplash(false)
        sessionStorage.setItem('splash_shown', 'true')
      }, 2000)
    } else {
      setShowSplash(false)
    }
  }, [])

  return (
    <>
      <SplashScreen show={showSplash} />
      <div style={{ display: showSplash ? 'none' : 'block' }}>{children}</div>
    </>
  )
}
