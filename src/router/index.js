import Home from '@/pages/Home'
import ThreadShow from '@/pages/ThreadShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import Forum from '@/pages/Forum'
import NotFound from '@/pages/NotFound'
import Category from '@/pages/Category'
import store from '@/store'
import Profile from '@/pages/Profile'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/me',
  name: 'Profile',
  component: Profile,
  meta: {
    toTop: true,
    smoothScroll: true
  }
}, {
  path: '/me/edit',
  name: 'ProfileEdit',
  component: Profile,
  props: {
    edit: true
  }
}, {
  path: '/category/:id',
  name: 'Category',
  component: Category,
  props: true
}, {
  path: '/forum/:id',
  name: 'Forum',
  component: Forum,
  props: true
}, {
  path: '/thread/:id',
  name: 'ThreadShow',
  component: ThreadShow,
  props: true,
  beforeEnter (to, from, next) {
    const threadExists = store.state.threads.find(thread => thread.id === to.params.id)

    if (threadExists) {
      return next()
    } else {
      next({
        name: 'NotFound',
        params: {
          pathMatch: to.path.substring(1).split('/')
        },
        // preserve existing query and hash
        query: to.query,
        hash: to.hash
      })
    }
  }
}, {
  path: '/forum/:forumId/thread/create',
  name: 'ThreadCreate',
  component: ThreadCreate,
  props: true
}, {
  path: '/thread/:id/edit',
  name: 'ThreadEdit',
  component: ThreadEdit,
  props: true
}, {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFound
}]
export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}

    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
