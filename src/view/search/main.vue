<template>
  <div class="search">
    <div class="header">
      <van-row type="flex">
        <van-col span="2">
          <img class="back" src="@/assets/back.png" @click="$router.go(-1)" alt />
        </van-col>
        <van-col span="22">
          <van-search
            v-model="keyword"
            placeholder="SEARCH"
            background="transparent"
            shape="round"
            @input="handleSearch"
            :clearable="true"
            left-icon
          >
            <template #right-icon>
              <div class="searchImg">
                <img src="@/assets/search.png" alt />
              </div>
            </template>
          </van-search>
        </van-col>
      </van-row>
    </div>
    <div class="body">
      <van-tabs v-model="active" background="transparent" line-height="0" @click="change">
        <van-tab title="Soulcast" class="soulcast"></van-tab>
        <van-tab title="user" class="user"></van-tab>
      </van-tabs>
      <div class="listBox">
        <template v-if="active === 0">
          <van-list
            v-model="loading"
            offset="200"
            :finished="finished"
            loading-text="Loading"
            finished-text=""
            :immediate-check="true"
            @load="onLoad"
            v-if="soulcastList.length > 0"
          >
            <van-cell
              :center="true"
              v-for="item in soulcastList"
              :key="item.id"
              @click="linkNft(item.realTokenId)"
            >
              <template #title>
                <img class="img" :src="item.squarePictureUrl" alt />
              </template>
              <template #default>
                <div class="ellipsis">{{ item.soul }}</div>
                <div>SoulCast #{{ item.realTokenId }}</div>
              </template>
            </van-cell>
          </van-list>
        </template>
        <template v-else>
          <van-list
            v-model="loading"
            offset="200"
            :finished="finished"
            finished-text=""
            loading-text="Loading"
            :immediate-check="true"
            @load="onLoad"
            v-if="userList.length > 0"
          >
            <van-cell
              :center="true"
              v-for="item in userList"
              :key="item.id"
              @click="linkUser(item.id)"
            >
              <template #title>
                <img class="userimg" :src="item.avatar" alt />
              </template>
              <template #default>
                <div class="ellipsis">{{ item.userName }}</div>
                <div>{{ substring(item.address) }}</div>
              </template>
            </van-cell>
          </van-list>
        </template>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  data() {
    return {
      keyword: "",
      searchList: [],
      current: 1,
      active: 0,
      type: 0,
      pageSize: 10,
      loading: false,
      finished: false,
      abortController: new AbortController()
    };
  },
  methods: {
    linkNft(id) {
      this.$router.push(`/explore_details?id=${id}`);
    },
    linkUser(userId) {
      this.$router.push(`user?id=${userId}`);
    },
    onLoad() {
      this.current++;
      this.getList(
        this.abortController.signal,
        this.keyword,
        this.type,
        this.pageSize
      );
    },
    substring(address) {
      return (
        address.substring(0, 6) +
        "..." +
        address.substring(address.length - 4, address.length)
      );
    },
    change(e) {
      this.type = e;
      this.current = 1;
      this.searchList = [];
      this.handleSearch();
    },
    handleSearch() {
      this.finished = false;
      this.current = 1;
      this.searchList = [];
      this.abortController.abort();
      this.abortController = new AbortController();
      this.getList(
        this.abortController.signal,
        this.keyword,
        this.type,
        this.pageSize
      );
    },

    async getList(signal, keyword, type, pageSize) {
      let url =
        this.$api.infor.getSearchList +
        `?keyword=${keyword}&type=${type}&current=${this.current}&size=${pageSize}`;
      try {
        let response = await fetch(url, {
          signal
        });
        if (response.ok) {
          const responseData = await response.json();
          const { code, data } = responseData;
          if (code === 200 && data.records && data.records.length > 0) {
            this.searchList = this.searchList.concat(data.records);
            this.loading = false;
            if (this.searchList.length >= data.total) {
              this.finished = true;
            }
          } else {
            this.loading = false;
          }
        } else {
          // 如果请求不成功，你可以根据需要处理错误
          throw new Error(`error: ${response.status}`);
        }
      } catch (err) {
        if (err.name == "AbortError") {
          // handle abort()
          // alert("Aborted!");
        } else {
          throw err;
        }
      }
    }
  },
  computed: {
    soulcastList() {
      return this.searchList.filter(item => !("address" in item));
    },
    userList() {
      return this.searchList.filter(item => "address" in item);
    }
  }
};
</script>
<style lang="scss">
.search {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding-top: 68px !important;
  ::-webkit-scrollbar {
/*隐藏滚轮*/
display: none;
}
  .header {
    padding: 0px 24px;
    height: 48px;
    position: fixed;
    top: 20px;
    width: 390px;
    z-index: 99;
  }

  .body {
    padding: 0 24px;
    height: calc(100vh - 68px);

    .listBox {
      height: calc(100% - 44px);
      overflow: auto;
      .userimg {
        border: 1px solid #000 !important;
        border-radius: 50%;
      }
    }
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .van-row--flex {
    align-items: center;
  }

  .back {
    cursor: pointer;
    width: 16px;
  }

  .van-search {
    padding: 0;

    .van-cell {
      padding: 8px 20px;
    }

    .van-search__content {
      padding-left: 0px;

      .van-field__control {
        color: #000;
        font-family: Inter;
        font-size: 18px;
        font-weight: 700;
      }
    }
  }

  .van-search__content--round {
    border: 2px solid #000;
  }

  .searchImg {
    display: flex;
    align-items: center;

    img {
      width: 20px;
    }
  }

  .van-tabs {
    .van-tabs__wrap {
      width: 157px;

      .van-tab {
        padding: 0;
      }

      .van-tab--active {
        .van-tab__text {
          font-weight: 900;
          color: #000;
        }
      }

      .van-tab__text {
        color: rgba(0, 0, 0, 0.5);
        text-align: center;
        font-family: Inter;
        font-weight: 600;
        font-size: 16px;
        text-transform: uppercase;
      }
    }

    .van-tabs__content {
      width: 298px;
    }
  }

  .van-list {
    .van-cell {
      cursor: pointer;
      height: 100%;
      background-color: transparent;
      padding: 0;
      margin-bottom: 16px;

      &:after {
        border: 0;
      }

      .van-cell__title {
        flex: none;
        margin-right: 14px;

        img {
          display: block;
          width: 44px;
          height: 44px;
          border: 1px solid #dfdfce;
        }
      }

      .van-cell__value {
        text-align: left;

        > div {
          color: #000;
          font-family: Inter;
          font-size: 16px;
          font-weight: 700;

          &:nth-child(2) {
            font-size: 12px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }

  // .van-cell__title {
  //   .img {
  //     border-radius: 50%;
  //     border: 1px solid #000;
  //   }
  // }
}
</style>
