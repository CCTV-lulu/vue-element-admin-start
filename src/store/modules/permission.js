import { asyncRouterMap, constantRouterMap } from '@/router'
import { fetchAll } from '@/api/admin/menu/index'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus, menuDatas) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      // debugger
      route.name = menuDatas[route.authority].title
      // route.name = menuDatas[route.authority].name
      route.icon = menuDatas[route.authority].icon
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus, menuDatas)
      }
      return true
    }
    return true
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
                     commit
                   }, menus) {
      return new Promise(resolve => {
        fetchAll().then(data => {
          const menuDatas = {}
          for (let i = 0; i < data.length; i++) {
            menuDatas[data[i].code] = data[i]
          }
          const accessedRouters = filterAsyncRouter(asyncRouterMap, menus, menuDatas);
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        })
      })
    }
  }
}

export default permission
