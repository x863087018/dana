


import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
export const useRouterCheck = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
     console.log(1123);
     

      next()
    
  }