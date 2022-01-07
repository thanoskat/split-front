import '../style/Container.css'

const Container = ({ children, className }) => {

  // const aClassName
  // if(className) {
  //   aClassName = `container-component ${className}`
  // }

  return(
    <div className={className ? `container-component ${className}` : 'container-component'}>{children}</div>
  )
}

export default Container
