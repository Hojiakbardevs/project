import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Users from '../views/Users.vue'
import UserProfile from '../views/UserProfile.vue'
import Posts from '../views/Posts.vue'
import PostDetail from '../views/PostDetail.vue'
import Todos from '../views/Todos.vue'
import Photos from '../views/Photos.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/users/:id',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetail
  },
  {
    path: '/todos',
    name: 'Todos',
    component: Todos
  },
  {
    path: '/photos',
    name: 'Photos',
    component: Photos
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router