import Vue from 'vue'
import Router from 'vue-router'
//左边侧边栏
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

let head = document.getElementsByTagName('head');
let meta = document.createElement('meta');
meta.name = 'referrer';
//根据实际情况修改referrer的值，可选值参考上文
meta.content = 'no-referrer';
head[0].appendChild(meta);

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/sign',
    component: () => import('@/views/sign/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },


  {
    path: '/submit',
    component: () => import('@/views/submit/submit'),
    meta: { roles: ['admin', 'teacher', 'student', "assistant"] },
    hidden: true
  },

  
  {
    path: '/check',
    component: () => import('@/views/submit/check'),
    meta: { roles: ['admin', 'teacher', 'student', "assistant"] },
    hidden: true
  },

  {
    path: '/details',
    name: 'details',
    component: () => import('@/views/record/details'),
    meta: { roles: ['student'] },
    props: true,
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '胶SDN', icon: 'dashboard' }
    }]
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/homework',
  //   name: 'homework',
  //   meta: { title: '我的作业', roles:['student'] },
  //   children: [
  //     {
  //       path: '/submit',
  //       component: Layout,
  //       meta: {roles:['student']},
  //       children: [
  //         {
  //           path: 'index',
  //           name: 'Submit',
  //           component: () => import('@/views/submit/index'),
  //           meta: { title: '作业提交', icon: 'submit',roles:['student'] }
  //         }
  //       ]
  //     },

  //     {
  //       path: '/record',
  //       component: Layout,
  //       meta: {roles:['student']},
  //       children: [
  //         {
  //           path: 'index',
  //           name: 'Record',
  //           component: () => import('@/views/record/index'),
  //           meta: { title: '批改情况', icon: 'record',roles:['student'] }
  //         }
  //       ]
  //     },
  //   ]
  // },

  {
    path: '/form',
    component: Layout,
    meta: { roles: ['student'] },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '作业批改', icon: 'form', roles: ['student'] }
      }
    ]
  },


  {
    path: '/submit',
    component: Layout,
    meta: { roles: ['student'] },
    children: [
      {
        path: 'index',
        name: 'Submit',
        component: () => import('@/views/submit/index'),
        meta: { title: '作业提交', icon: 'submit', roles: ['student'] }
      }
    ]
  },

  // {
  //   path: '/submit',
  //   component: Layout,
  //   meta: {roles:['student']},
  //   children: [
  //     {
  //       path: 'submit',
  //       name: 'submit',
  //       component: () => import('@/views/submit/submit'),
  //       meta: { title: '作业提交', icon: 'el-icon-circle-plus' }
  //     }
  //   ]
  // },

  {
    path: 'prior/assignmentInfo',
    name: 'AssignmentInfo',
    component: Layout,
    meta: { roles: ['teacher'] },
    hidden: true,
    props: true,
    children: [
      {
        path: '/assignmentInfo',
        name: 'assignmentInfo',
        component: () => import('@/views/teacher/assignmentInfo'),
      }
    ]
  },

  {
    path: '/record',
    component: Layout,
    meta: { roles: ['student'] },
    children: [
      {
        path: 'index',
        name: 'Record',
        component: () => import('@/views/record/index'),
        meta: { title: '批改情况', icon: 'record', roles: ['student'] }
      }
    ]
  },

  {
    path: '/grade',
    component: Layout,
    meta: { roles: ['student'] },
    children: [
      {
        path: 'index',
        name: 'Grade',
        component: () => import('@/views/grade/index'),
        meta: { title: '成绩分布', icon: 'grade', roles: ['student'] }
      }
    ]
  },


  {
    path: '/publish',
    component: Layout,
    meta: { roles: ['teacher'] },
    children: [
      {
        path: 'index',
        name: 'Publish',
        component: () => import('@/views/publish/index'),
        meta: { title: '发布作业', icon: 'publish', roles: ['teacher'] }
      }
    ]
  },

  {
    path: '/homeworkDetails',
    component: Layout,
    meta: { roles: ['teacher'] },
    children: [
      {
        path: 'index',
        name: 'Details',
        component: () => import('@/views/teacher/details'),
        meta: { title: '已发布作业', icon: 'publish', roles: ['teacher'] }
      },
    ]
  },

  {
    path: '/grade',
    component: Layout,
    meta: { roles: ['teacher'] },
    children: [
      {
        path: 'index',
        name: 'Grade',
        component: () => import('@/views/grade/index'),
        meta: { title: '成绩分布', icon: 'grade', roles: ['teacher'] }
      }
    ]
  },

  {
    path: '/teacher/detailsforStu',
    name: 'detailsforStu',
    component: Layout,
    meta: { roles: ['teacher'] },
    hidden: true,
    props: true,
    children: [
      {
        name: 'DetailsforStu',
        path: '/teacher/detailsforStu',
        component: () => import('@/views/teacher/detailsforStu'),
      },
      {
        name: 'homeworkDetails',
        path: '/teacher/homeworkDetails',
        component: () => import('@/views/teacher/homeworkDetails'),
      },
      {
        name: 'allocateAssign',
        path: '/teacher/allocateAssign',
        component: () => import('@/views/teacher/allocateAssign'),
      }
    ]
  },
  
  {
    path: '/deal',
    component: Layout,
    meta: { roles: ['teacher'] },
    children: [
      {
        path: 'index',
        name: 'Deal',
        component: () => import('@/views/deal/index'),
        meta: { title: '作业处理', icon: 'deal', roles: ['teacher'] }
      }
    ]
  },

  {
    path: '/deal/check',
    name: 'check',
    component: Layout,
    meta: { roles: ['teacher'] },
    hidden: true,
    props: true,
    children: [
      {
        name: 'check',
        path: '/deal/check',
        component: () => import('@/views/deal/check'),
      },
      {
        name: 'appeal',
        path: '/deal/appeal',
        component: () => import('@/views/deal/appeal'),
      },
      {
        name: 'homework',
        path: '/deal/homework',
        component: () => import('@/views/deal/homework'),
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '个人中心',
      icon: 'nested',
      roles: ['admin', 'teacher', 'student', "assistant"]
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1'), // Parent router-view
        name: 'Menu1',
        meta: { title: '个人信息' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1/index'),
            name: 'Menu1-1',
            meta: { title: '隐私设置' }
          },
        ]
      },
      {
        path: 'menu1-2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu1-2',
        meta: { title: '修改密码' }
      },
      {
        path: 'Comment',
        component: () => import('@/views/nested/menu1/menu1-1/index.vue'),
        name: 'comment',
        hidden: true,
        meta: {title: '评论区'}
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/role',
    name: 'Example',
    meta: { title: '用户管理', icon: 'el-icon-s-help', roles: ['admin'] },
    children: [{
      path: 'role',
      name: 'Role',
      component: () => import('@/views/manager/students'),
      meta: { title: '学生管理', icon: 'dashboard' }
    },
    {
      path: 'role1',
      name: 'Role1',
      component: () => import('@/views/manager/teachers'),
      meta: { title: '老师管理', icon: 'dashboard' }
    },
    {
      path: 'role2',
      name: 'Role2',
      component: () => import('@/views/manager/assistants'),
      meta: { title: '助教管理', icon: 'dashboard' }
    },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
