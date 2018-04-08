import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import PackMain from '@/components/PackMain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PackMain',
      component: PackMain
    }
  ]
})
