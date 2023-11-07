import Vue from 'vue'
import Router from 'vue-router'
import explore from '@/view/explore/main'
import earn from '@/view/earn/main'
import chat from '@/view/chat/main'
import home from '@/view/home/main'
import explore_details from '@/view/explore_details/main'
import followers from '@/view/followers/main'
import following from '@/view/following/main'
import TopFans from '@/view/TopFans/main'
import Succesed from '@/view/Succesed/main'
import welcome from '@/view/welcome/main'
import twitterAuth from '@/view/twitterAuth/main'
import congr from '@/view/congr/main'
import mint_select from '@/view/mint_select/main'
import mint_soulcast from '@/view/mint_soulcast/main'
import mint_shaping from '@/view/mint_shaping/main'
import mint_success from '@/view/mint_success/main'
import purchase_success from '@/view/purchase_success/main'
import list_price from '@/view/list_price/main'
import user from '@/view/user/main'
import settings from '@/view/settings/main'
import addToHome from '@/view/AddToHome/index'
import settingsBio from '@/view/settingsBio/main'
import settingsName from '@/view/settingsName/main'
import Congratulations from '@/view/Congratulations/main'
import sorry from '@/view/sorry/main'
import owner from '@/view/owner/main'
import share from '@/view/share/main'
import invite from '@/view/invite/main'
import search from "@/view/search/main"
import share_pick from "@/view/share_pick/main"
Vue.use(Router)
export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'explore',
      component: explore,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/earn',
      name: 'earn',
      component: earn,
    },
    {
      path: '/chat',
      name: 'chat',
      component: chat
    },
    {
      path: '/home',
      name: 'home',
      component: home,
    },
    {
      path: '/explore_details',
      name: 'explore_details',
      component: explore_details,
    },
    {
      path: '/followers',
      name: 'followers',
      component: followers,
    },
    {
      path: '/following',
      name: 'following',
      component: following,
    },
    {
      path: '/TopFans',
      name: 'TopFans',
      component: TopFans,
    },
    {
      path: '/Succesed',
      name: 'Succesed',
      component: Succesed,
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: welcome,
    },
    {
      path: '/twitterAuth',
      name: 'twitterAuth',
      component: twitterAuth,
    },
    {
      path: '/congr',
      name: 'congr',
      component: congr,
    },
    {
      path: '/mint_select',
      name: 'mint_select',
      component: mint_select,
    },
    {
      path: '/mint_soulcast',
      name: 'mint_soulcast',
      component: mint_soulcast,
    },
    {
      path: '/mint_shaping',
      name: 'mint_shaping',
      component: mint_shaping,
    },
    {
      path: '/mint_success',
      name: 'mint_success',
      component: mint_success,
    },
    {
      path: '/purchase_success',
      name: 'purchase_success',
      component: purchase_success,
    },
    {
      path: '/list_price',
      name: 'list_price',
      component: list_price,
    },
    {
      path: '/user',
      name: 'user',
      component: user,
    },
    {
      path: '/t/:code',
      name: 'code',
      component: user,
    },
    {
      path: '/settings',
      name: 'settings',
      component: settings,
    },
    {
      path: '/addToHome',
      name: 'addToHome',
      component: addToHome,
    },
    {
      path: '/settingsBio',
      name: 'settingsBio',
      component: settingsBio,
    },
    {
      path: '/settingsName',
      name: 'settingsName',
      component: settingsName,
    },
    {
      path: '/Congratulations',
      name: 'Congratulations',
      component: Congratulations,
    },
    {
      path: '/sorry',
      name: 'sorry',
      component: sorry,
    },
    {
      path: '/owner',
      name: 'owner',
      component: owner,
    },
    {
      path: '/share',
      name: 'share',
      component: share,
    },
    {
      path: '/invite',
      name: 'invite',
      component: invite,
    },
    {
      path: '/search',
      name: 'search',
      component: search,
    },
    {
      path: '/share_pick',
      name: 'share_pick',
      component: share_pick,
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}