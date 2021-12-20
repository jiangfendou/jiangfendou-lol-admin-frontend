import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
// import Login from '../views/login.vue'
import Index from '../views/index.vue'
import axios from 'axios'
import store from '../store'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home,
        children: [{
                path: '/index',
                name: 'index',
                component: Index
            },
            {
                path: '/userCenter',
                name: 'userCenter',
                component: () =>
                    import ('../views/userCenter.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/login.vue')
    }

]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {

    let hasRoute = store.state.menus.hasRoutes
    if (!hasRoute) {
        let userId = localStorage.getItem("userId");
        axios.get('/sys/menu/nav?userId=' + userId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res => {
            console.log("res");
            console.log(res);
            console.log(res.data.data.authorities);
            // 拿到menuList
            store.commit("setMenuList", res.data.data.nav)
                // 拿到用户权限
            store.commit("setPermList", res.data.data.authorities)

            // 动态绑定的路由
            let newRoutes = router.options.routes
            res.data.data.nav.forEach(menus => {
                if (menus.children) {
                    menus.children.forEach(e => {
                        // 转成路由
                        let route = menuToRoute(e)
                            // 把路由添加到路由管理中
                        if (route) {
                            newRoutes[0].children.push(route)
                        }
                    })
                }
            })
            router.addRoutes(newRoutes)
            hasRoute = true
            store.commit("changeRouteStatus", hasRoute)
        })
    }
    next()
})

// 导航转成路由
const menuToRoute = (menus) => {
    if (!menus.component) {
        return null
    }
    let route = {
        name: menus.name,
        path: menus.path,
        meta: {
            icon: menus.icon,
            title: menus.title
        }
    }
    route.component = () =>
        import ('../views/' + menus.component + '.vue')
    return route
}
export default router