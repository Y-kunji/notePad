import Home from '../pages/Home'

export default class Router {
  constructor() {
    this.model = {
      pathName: location.pathname,
    }

    this.initRouting()
  }

  initRouting() {
    const pathName = this.model.pathName
    switch (pathName) {
      case '/':
        new Home()
        break
      default:
        break
    }
  }

}
