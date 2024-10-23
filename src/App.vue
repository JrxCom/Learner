<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { $_logis } from "@/api/log";
export default {
  data() {
    return {};
  },
  mounted() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        console.log(this.$route.path);
        if (this.$route.path != "/login") {
          $_logis().then((res) => {
            if (res.data.status === 403) {
              this.$message.error({
                duration: 2000,
                message: "登录失效，即将跳转登录页面！",
              });
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 2000);
            }
          });
        }
      }
    });
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
