import QrScanner from 'qr-scanner'
import IonIcon from '@reacticons/ionicons'
import { useState, useRef, useEffect } from 'react'

export default function QRScanner() {
  const [loading, setLoading] = useState(true)
  const videoRef = useRef(null)

  useEffect(async () => {
    const handleResult = (result) => {
      window.location.replace(result.data)
    }

    const qrScanner = new QrScanner(
      videoRef.current,
      result => handleResult(result),
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true
      }
    )
    await qrScanner.start()
    setLoading(false)
    return () => {
      qrScanner.destroy()
    }
  }, [])


  return (
    <div
      className='bottom-menu top-radius flex column'
      style={{ zIndex: '2', gap: '14px', padding: '14px' }}
    >
      {loading && <IonIcon name='sync' className='spin' />}
      <video ref={videoRef} />
    </div>
  )

}