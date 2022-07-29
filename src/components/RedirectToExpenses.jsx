import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const RedirectToExpenses = () => {

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(`/${params.groupid}/expenses`)
  }, [])

  return (
    <></>
  )
}

export default RedirectToExpenses
