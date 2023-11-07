<template>
  <div class="container">
    <div class="box">
      <div class="icon"></div>
      <div class="tit">Add To Home Screen</div>
      <div class="text">To install the app, you need to add this website to your home screen.</div>
      <div class="text">
        In your browser menu, tap the Share icon and choose <span class="strong">Add to Home Screen
        </span> in the options. Then open the Soulcial app on your home screen.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddToHome'
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  // background-color: rgba($color: #000000, $alpha: 0.1);
  .box {
    width: 90%;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 50px 40px;

    .icon {
      width: 200px;
      height: 70px;
      background: url('../../assets/logo_black_text.png') no-repeat center;
      background-size: 100% 100%;
      margin-bottom: 10px;
    }

    .tit {
      font-weight: 400;
      font-size: 26px;
      margin-bottom: 20px;
    }

    .text {
      font-size: 16px;
      margin-bottom: 16px;
      font-weight: 300;

    }

    .strong {
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
