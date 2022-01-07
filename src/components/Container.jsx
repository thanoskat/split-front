import '../style/Container.css'

const Container = ({ children, className }) => {

  return(
    <div className={className ? `container-component ${className}` : 'container-component'}>{children}</div>
  )
}

export default Container
