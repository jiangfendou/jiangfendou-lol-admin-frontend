import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus"

Vue.use(Vuex)

export default new Vuex.Store({


    state: {
        token: '',
        userId: ''
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
            localStorage.setItem("token", token);
        },

        USER_ID: (state, userId) => {
            state.userId = userId;
            localStorage.setItem("userId", userId);
        }

    },
    actions: {},
    modules: {
        menus
    }
})