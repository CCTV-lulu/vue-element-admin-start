import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  };
  return request({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/admin/user/front/info',
    method: 'get',
    params: { token }
  });
}

export function getMenus(token) {
  return fetch({
    url: '/api/admin/user/front/menus',
    method: 'get',
    params: { token }
  });
}
