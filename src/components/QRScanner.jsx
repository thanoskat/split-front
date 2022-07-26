import QrScanner from 'qr-scanner'
import IonIcon from '@reacticons/ionicons'
import { useState, useRef, useEffect } from 'react'

export default function QRScanner() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading')
  const videoRef = useRef(null)

  useEffect(() => {

    const qrScanner = new QrScanner(
      videoRef.current,
      result => handleResult(result),
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true
      }
    )

    const handleResult = (result) => {
      if(/https:\/\/splita\.xyz\/i\/[a-z0-9]{8}$/.test(result.data)) {
        window.location = (result.data)
        qrScanner.stop()
        // setMessage(result.data)
      }
    }

    qrScanner.start().then(() => {
      setLoading(false)
      setMessage('')
    }).catch((error) => {
      setLoading(false)
      setMessage(error)
    })
    return () => {
      qrScanner.destroy()
    }
  }, [])


  return (
    <div
      className='bottom-menu top-radius flex column'
      style={{ zIndex: '2', gap: '14px', padding: '14px', maxHeight: 'calc(80%)' }}
    >
      {loading &&
      <div className='flex row alignitems-center'>
        <IonIcon name='sync' className='spin' />
      </div>}
      {!loading && <>{message}</>}
      <video ref={videoRef} />
    </div>
  )

}