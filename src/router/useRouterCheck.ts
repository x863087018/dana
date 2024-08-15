


import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
export const useRouterCheck = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  let login: any = sessionStorage.getItem('isLogin')
  if (to.path !== '/login') {
    if (!login) {
      next('/login')
    } else {
      next()
    }
  } else {
    if (login) {
      next('/')
    } else {
      next()
    }
  }
}