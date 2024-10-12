<template>
  <div id="home-view">
    <div class="card_list_view">
      <div class="card_item_view" v-for="(item, index) in webData" :key="index">
        <div class="name_view">
          <img :src="fileUrl + item.logo" alt="" />
          <p>{{ item.name }}</p>
        </div>
        <div :title="item.intro" class="intro_view">
          {{ item.intro }}
        </div>
        <div class="archive_view">
          {{ item.archive }}
        </div>
        <div class="time_view">
          {{ new Date(item.creatime).toLocaleString() }}
        </div>
        <div class="link_view">{{ item.url }}</div>
      </div>
    </div>

    <el-empty
      v-if="!webData.length"
      style="height: 60vh"
      :image-size="200"
      description="No Data Available"
    ></el-empty>
  </div>
</template>

<script>
/* 引入获取网站列表api */
import { $_get_web_list } from "@/api/web";

export default {
  name: "home",
  data() {
    return {
      webData: [] /* 网站列表 */,
      fileUrl: process.env.VUE_APP_FILE_URL /* api路径 */,
    };
  },
  created() {
    this.get_web_list();
  },
  methods: {
    /* 获取网站列表 */
    get_web_list() {
      $_get_web_list().then((res) => {
        if (res.data.status === 200) {
          this.webData = res.data.obj.records;
        }
      });
    },
  },
};
</script>

<style lang="less">
@import "home.less";
</style>