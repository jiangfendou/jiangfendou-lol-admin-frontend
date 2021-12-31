import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {
        menuList: [],
        authorities: [],
        hasRoutes: false,

        editableTabsValue: 'index',
        editableTabs: [{
            title: "首页",
            name: "index"
        }]
    },
    mutations: {
        setMenuList(state, menus) {
            state.menuList = menus
            console.log(this);
        },
        setPermList(state, perms) {
            state.permList = perms
            state.authorities = perms
        },
        changeRouteStatus(state, hasRoutes) {
            state.hasRoutes = hasRoutes
        },
        addTab(state, tab) {
            console.log("tab");
            console.log(state, tab);
            let index = state.editableTabs.findIndex(e => e.name === tab.name)
            console.log(index);
            if (index === -1) {
                console.log("tab11111");
                state.editableTabs.push({
                    title: tab.title,
                    name: tab.name
                });
            }
            console.log(tab.name)
            state.editableTabsValue = tab.name;
        },
        resetState: (state) => {
            state.menuList = []
            state.permList = []
            state.hasRoutes = false
            state.editableTabsValue = 'index'
            state.editableTabs = [{
                title: '首页',
                name: 'index'
            }]
        }
    },
    actions: {}
}