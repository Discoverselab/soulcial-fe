<template>
  <div class="vsoul_introduce">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" />
      <div class="nav_name">
        PUMP Epoch Rules
      </div>
    </div>
    <div class="banner">
      <img src="../../assets/banner_epoch.jpg" alt="">
    </div>
    <div class="introduce">
      <div class="title">PUMP Epoch</div>
      <div class="content">
        <p>Nov 14 - Nov 28</p>
      </div>
      <div class="title">Double vSOUL</div>
      <div class="content">
        <p>1. PUMP SoulCast NFT, and win double vSOUL rewards.</p>
        <p>2. Top 10 Pumpers on leaderboard share <span class="bold">$2100</span> rewards pool.</p>
        <p class="sec"> · 1st: <span class="bold">$800</span></p>
        <p class="sec"> · 2nd: <span class="bold">$400</span></p>
        <p class="sec"> · 3rd: <span class="bold">$200</span></p>
        <p class="sec"> · 4th-10th: <span class="bold">$100</span></p>
      </div>

      <div class="title">Lucky 3-in-a-row</div>
      <div class="content">
        <p>If you win 3 Pump in a row, you can receive a full refund in the form of ETH.</p>
      </div>

      <div class="title">Get OG Badge</div>
      <div class="content" style="border: none;">
        <p>1. Participants in PUMP in the Epoch will be rewarded OG Badge. </p>
        <p>2. OG Badge holders have early access to future features, exclusive content, and more. </p>
      </div>
    </div>
    <div @click="$router.push('/vsoul_introduce')" class="btn">Learn more about vSOUL</div>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

.vsoul_introduce {
  padding: 20px 24px 40px;

  .back {
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .banner {
    margin-bottom: 30px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .navigate {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    top: 0px;
    z-index: 9;
    margin-bottom: 18px;

    .nav_name {
      justify-content: center;
      flex: 1;
      font-family: "Inter";
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      color: #000;
    }
  }

  .introduce {
    .title {
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 6px;
    }

    .content {
      line-height: 20px;
      border-bottom: 1px solid #dfdfce;
      margin-bottom: 10px;
      padding-bottom: 10px;
      .bold{
        font-weight: 600;
      }
    }
  }

  .btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: 2px solid #000;
    background: #dadac6;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 26px;
    border-radius: 45px;
    font-family: "Inter";
  }

  .sec {
    text-indent: 1em;
  }
}
</style>