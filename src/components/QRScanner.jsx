import QrScanner from 'qr-scanner'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QRScanner() {
  const navigate = useNavigate()
  const [data, setData] = useState('No result')
  const videoRef = useRef(null)

  useEffect(() => {
    const handleResult = (result) => {
      setData(result)
      navigate(result)
    }

    const qrScanner = new QrScanner(
      videoRef.current,
      result => handleResult(result),
      {
        highlightScanRegion: true,
        highlightCodeOutline: true
      }
    )
    qrScanner.start()
    return(
      qrScanner.destroy()
    )
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