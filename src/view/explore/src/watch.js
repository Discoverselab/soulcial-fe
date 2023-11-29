/* attribute value monitoring
1. It cannot be defined by () = > {} arrow function.
ps: https://cn.vuejs.org/v2/api/#watch
*/
export default {
    watch: {
        $route(to, from) {
            console.log(to,from)
        }
    },
    loginStatus(newVal) {
        if (newVal) {
          // 执行刷新操作
          this.changeTab(1, "refresh");
          this.$store.commit('updateLoginStatus', false);
        }
      },
};