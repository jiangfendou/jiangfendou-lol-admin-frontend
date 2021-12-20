const { Random } = require('mockjs')
const Mock = require('mockjs')
const Rancom = Mock.Random

let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}

Mock.mock('/captcha', 'get', () => {
    Result.data = {
        token: Random.string(32),
        captchaImg: Random.dataImage('120x40', 'p7n5w')
    }
    return Result
})

Mock.mock('/login', 'post', () => {
    // 无法再header中传入数据
    // Result.code = 400;
    // Result.msg = "验证码错误";
    return Result;
})

Mock.mock('/sys/userInfo', 'get', () => {
    Result.data = {
        id: "1",
        username: "jiangfendou",
        avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    }
    return Result
})

Mock.mock('/logout', 'post', () => {

    return Result
})

Mock.mock('/sys/menu/nav', 'get', () => {

    let nav = [{
            title: '系统管理',
            name: 'sysMange',
            icon: 'el-icon-s-operation',
            component: '',
            path: '',
            children: [{
                    name: 'sysUser',
                    title: '用户管理',
                    icon: 'el-icon-s-custom',
                    component: 'sys/user',
                    path: '/sys/users',
                    children: []
                },
                {
                    name: 'sysRole',
                    title: '角色管理',
                    icon: 'el-icon-rank',
                    component: 'sys/role',
                    path: '/sys/roles',
                    children: []
                },
                {
                    name: 'sysMenu',
                    title: '菜单管理',
                    icon: 'el-icon-menu',
                    component: 'sys/menu',
                    path: '/sys/menus',
                    children: []
                },
            ]
        },
        {
            name: 'sysTools',
            title: '系统工具',
            icon: 'el-icon-s-tools',
            component: '',
            path: '',
            children: [{
                name: 'sysDict',
                title: '数字字典',
                icon: 'el-icon-s-order',
                component: '',
                path: '/sys/dicts',
            }]
        }
    ]
    let authoritys = ['sys:user:list', 'sys:user:save']
    Result.data = {
        nav: nav,
        authoritys: authoritys
    }
    return Result
})

Mock.mock('/sys/menu/list', 'get', () => {

    let menus = [{
            id: 1,
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: 1,
            type: 0
        },
        {
            id: 2,
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            status: 0,
            type: 1
        },
        {
            id: 3,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            status: 0,
            type: 2,
            children: [{
                    id: 31,
                    date: '2016-05-01',
                    name: '王小虎555',
                    address: '上海市普陀区金沙江路 1519 弄',
                    status: 0,
                    type: 0
                },
                {
                    id: 32,
                    date: '2016-05-01',
                    name: '王小虎555',
                    address: '上海市普陀区金沙江路 1519 弄',
                    status: 1,
                    type: 1
                }
            ]
        },
        {
            id: 4,
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            status: 1,
            type: 2
        }
    ]
    Result.data = menus
    return Result
})

Mock.mock('/sys/menu/info/1', 'get', () => {

    let menuInfo = {
        id: 1,
        date: '2016-05-01',
        name: '王小虎555',
        address: '上海市普陀区金沙江路 1519 弄',
        status: 1,
        type: 1
    }
    Result.data = menuInfo
    return Result
})

Mock.mock('/sys/menu/update', 'post', () => {

    return Result
})

Mock.mock('/sys/menu/delete/1', 'post', () => {

    return Result
})

// role
Mock.mock(RegExp('/sys/role/list*'), 'get', () => {

    Result.data = {
        records: [{
                id: 3,
                created: "2021-01-16T13:29:03",
                updated: "2021-01-16T13:29:03",
                status: 1,
                name: "普通用户",
                code: "ormal",
                remark: "只有基本查看功能",
                menuIds: []
            },
            {
                id: 6,
                created: "2021-01-16T13:29:03",
                updated: "2021-01-16T13:29:03",
                status: 1,
                name: "超级管理员",
                code: "admin",
                remark: "系统默认最高权限，不可编辑和任意修改",
                menuIds: []
            }
        ],
        total: 2,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1
    }
    return Result
})

Mock.mock(RegExp('/sys/role/*'), 'post', () => {

    return Result
})

Mock.mock(RegExp('/sys/role/info/*'), 'get', () => {
    Result.data = {
        id: 6,
        created: "2021-01-16T13:29:03",
        updated: "2021-01-16T13:29:03",
        status: 1,
        name: "超级管理员",
        code: "admin",
        remark: "系统默认最高权限，不可编辑和任意修改",
        menuIds: [3, 5, 6]
    }
    return Result
})

// user list
Mock.mock(RegExp('/sys/user/list*'), 'get', () => {
    Result.data = {
        records: [{
                id: 1,
                avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                userName: "姜奋斗",
                roles: [{
                        roleName: "超级管理员"
                    },
                    {
                        roleName: "无敌超级管理员"
                    }
                ],
                email: "49323245@qq.com",
                phone: "13644094332",
                status: 1,
                creationTime: "2021-10-31T16:43",
            },
            {
                id: 2,
                avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                userName: "姜奋斗",
                roles: [{
                        roleName: "超级管理员"
                    },
                    {
                        roleName: "无敌超级管理员"
                    }
                ],
                email: "49323245@qq.com",
                phone: "13644094332",
                status: 1,
                creationTime: "2021-10-31T16:43",
            }
        ],
        total: 2,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1
    }
    return Result
})

Mock.mock(RegExp('/sys/user/'), 'post', () => {

    return Result
})

Mock.mock(RegExp('/sys/user/info/*'), 'get', () => {
    Result.data = {
        id: 1,
        avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        userName: "姜奋斗",
        roles: [{
                roleName: "超级管理员"
            },
            {
                roleName: "无敌超级管理员"
            }
        ],
        roleIds: [3, 6],
        email: "49323245@qq.com",
        phone: "13644094332",
        status: 1,
        creationTime: "2021-10-31T16:43",
    }
    return Result
})