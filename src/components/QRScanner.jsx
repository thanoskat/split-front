import QrScanner from 'qr-scanner'
import { useState, useRef, useEffect } from 'react'

export default function QRScanner() {

  const [data, setData] = useState('No result')
  const videoRef = useRef(null)
  useEffect(() => {
    QrScanner.listCameras(true)
    const qrScanner = new QrScanner(
      videoRef.current,
      result => setData(result),
      { returnDetailedScanResult: true }
    )
    qrScanner.start()

  }, [])


  return (
    <div
      className='bottom-menu top-radius flex column'
      style={{ zIndex: '2', gap: '14px', padding: '14px' }}
    >
      <video ref={videoRef}>
      </video>
      {data}
    </div>
  )

}