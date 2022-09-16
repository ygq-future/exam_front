import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import cookies from 'vue-cookies'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'layout',
    redirect: "/content",
    component: () => import('@/components/Layout.vue'),
    children: [
      {
        path: '/content',
        name: 'content',
        component: () => import('@/components/Content.vue')
      },
      //老师管理
      {
        path: '/teacher-list',
        name: 'teacherList',
        component: () => import('@/views/teacher/TeacherList.vue')
      },
      {
        path: '/teacher-dashboard',
        name: 'teacherDashboard',
        component: () => import('@/views/teacher/TeacherDashboard.vue')
      },
      //专业管理
      {
        path: '/major-list',
        name: 'majorList',
        component: () => import('@/views/major/MajorList.vue')
      },
      //题库列表
      {
        path: '/question-list',
        name: 'questionList',
        component: () => import('@/views/question/QuestionList.vue')
      },
      /* {
        path: '/question-edit',
        name: 'questionEdit',
        component: () => import('@/views/question/QuestionEdit.vue')
      }, */
      //试卷管理
      {
        path: '/paper-list',
        name: 'paperList',
        component: () => import('@/views/paper/PaperList.vue')
      },
      {
        path: '/examing-paper',
        name: 'examingPaper',
        component: () => import('@/views/paper/ExamingPaperList.vue')
      },
      {
        path: '/scoring',
        name: 'scoring',
        component: () => import('@/views/paper/Scoring.vue')
      },
      {
        path: '/paper-edit',
        name: 'paperEdit',
        component: () => import('@/views/paper/PaperEdit.vue')
      },
      //学生管理
      {
        path: '/student-list',
        name: 'studentList',
        component: () => import('@/views/student/StudentList.vue')
      },
      //统计数据
      {
        path: '/statistics-score',
        name: 'statisticsScore',
        component: () => import('@/views/statistics/StatisticsScore.vue')
      },
      //系统配置
      {
        path: '/role-authority',
        name: 'roleAuthority',
        component: () => import('@/views/system/RoleAuthority.vue')
      },
      {
        path: '/admin-function',
        name: 'adminFunction',
        component: () => import('@/views/system/AdminFunction.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  //如果获取不到用户信息就去登录
  let user = store.getters.user
  let userCookie = cookies.get('user')

  if (!user && !userCookie) {
    return next('/login')
  }

  if (!user) {
    store.commit('userCommit', userCookie || {})
  }
  if (!userCookie) {
    cookies.set('user', JSON.stringify(user))
  }

  next()
})

export default router
