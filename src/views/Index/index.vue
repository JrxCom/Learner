<template>
  <div id="index-view">
    <!-- 目录 -->
    <el-menu class="menu_view" :default-active="menuActive">
      <div class="header_view">
        <img width="30" height="30" src="@/assets/common/logo.png" />
        <h3>LeaRneR</h3>
      </div>
      <el-menu-item index="home" @click="go_menu('/home')">
        <i class="el-icon-s-home"></i>
        <span slot="title">Home</span>
      </el-menu-item>
      <el-submenu index="web">
        <template slot="title">
          <i class="el-icon-monitor"></i>
          <span>Web</span>
        </template>
        <el-menu-item
          v-for="(item, index) in menuArray"
          :key="index"
          :index="item.id.toString()"
          @click="go_menu('/web', item.id)"
        >
          <img width="20" height="20" :src="fileUrl + item.logo" alt="" />
          {{ item.name }}
        </el-menu-item>
      </el-submenu>
      <el-submenu index="manage">
        <template slot="title">
          <i class="el-icon-mouse"></i>
          <span>Manage</span>
        </template>
        <el-menu-item index="library" @click="go_menu('/library')">
          <i class="el-icon-news"></i>
          <span slot="title">Library</span>
        </el-menu-item>
        <el-menu-item index="table" @click="go_menu('/table')">
          <i class="el-icon-connection"></i>
          <span slot="title">Table</span>
        </el-menu-item>
        <el-menu-item index="field" @click="go_menu('/field')">
          <i class="el-icon-collection-tag"></i>
          <span slot="title">Field</span>
        </el-menu-item>
      </el-submenu>
      <div class="footer_view">
        <el-tooltip
          effect="dark"
          placement="top-start"
        >
          <div slot="content" style="font-family: 'eFontL';">
            <p>前端：{{$store.state.stack.front_end}}</p>
            <p>预处理器：{{$store.state.stack.preprocessor}}</p>
            <p>UI：{{$store.state.stack.ui}}</p>
            <p>后端：{{$store.state.stack.back_end}}</p>
          </div>
          <div class="code_tag">
            <img width="18" height="18" src="@/assets/index/code.png" />
          </div>
        </el-tooltip>

        <div class="github_tag" @click="go_github()">
          <img width="18" height="18" src="@/assets/index/github.png" />
        </div>

        <div class="screen_tag" @click="screenCode = !screenCode">
          <img
            v-if="!screenCode"
            width="18"
            height="18"
            src="@/assets/index/fullScreen.png"
          />
          <img
            v-else
            width="18"
            height="18"
            src="@/assets/index/exitFullScreen.png"
          />
        </div>

        <div
          class="logout_tag"
          @click="(logoutDialog = true), $bus.$emit('close-tips')"
        >
          <img width="18" height="18" src="@/assets/index/logout.png" alt="" />
        </div>
      </div>
    </el-menu>
    <!-- 窗口 -->
    <div class="path_view">
      <router-view :key="$route.fullPath"></router-view>
    </div>

    <el-collapse-transition>
      <!-- 退出登录弹窗 -->
      <div class="logout_view" v-show="logoutDialog">
        <div class="card_view">
          <div class="close_view" @click="logoutDialog = false">
            <el-link type="danger" :underline="false"
              ><i class="el-icon-close"></i
            ></el-link>
          </div>
          <div class="title_view">提示</div>
          <div class="word_view">
            <p>是否退出登录？</p>
            <span>说明：退出成功后页面跳转到登录页！</span>
          </div>
          <div class="submit_view">
            <div class="logout_button" @click="log_out()">
              <img
                width="14"
                height="14"
                src="@/assets/common/confirm.png"
                alt=""
              />
            </div>
            <div class="cancel_button" @click="logoutDialog = false">
              <img
                width="14"
                height="14"
                src="@/assets/common/cancel.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
/* 引入退出api */
import { $_logout } from "@/api/log";
/* 引入获取网站列表api */
import { $_get_web_list } from "@/api/web";
export default {
  name: "index",
  data() {
    return {
      menuActive: "home" /* 当前菜单 */,
      menuArray: [] /* 菜单列表 */,
      screenCode: false /* 全屏参数 */,
      fileUrl: process.env.VUE_APP_FILE_URL /* api路径 */,
      logoutDialog: false /* 退出弹窗显示参数 */,
    };
  },
  watch: {
    /* 监控全屏 */
    screenCode() {
      this.full_screen();
    },
  },
  beforeCreate() {
    /* 更新菜单数据 */
    this.$bus.$on("update-menu", () => {
      this.get_menu_list();
    });
  },
  created() {
    /* 页面存在id视为web下网站数据页面，则为home或者manage页面 */
    this.menuActive =
      Boolean(this.$route.query.id) === true
        ? this.$route.query.id
        : this.$route.name;
    this.get_menu_list();
  },
  mounted() {
    /* 页面大小发生变化触发：监控全屏 */
    window.onresize = () => {
      this.screenCode = Boolean(
        document.fullscreenElement ||
          document.msFullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullscreenElement
      );
    };
  },
  methods: {
    /* 获取菜单列表 */
    get_menu_list() {
      $_get_web_list().then((res) => {
        if (res.data.status === 200) {
          this.menuArray = res.data.obj.records;
        } else {
          this.$message({
            message: res.data.message,
            type: "danger",
          });
        }
      });
    },
    /* 进入web下创建的网站页面 */
    go_menu(path, id) {
      Boolean(id)
        ? this.$router.push({ path: "/web", query: { id: id } })
        : this.$router.push({ path });
    },
    /* 退出登录 */
    log_out() {
      $_logout().then((res) => {
        if (res.data.status === 200) {
          this.logoutDialog = false;
          this.$message({
            message: res.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.$router.push({ path: "/login" });
          }, 1500);
        } else {
          this.$message({
            message: res.data.message,
            type: "warn",
          });
        }
      });
    },
    /* 全屏切换 */
    full_screen() {
      if (this.screenCode) {
        const element = document.documentElement;
        if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullscreen) {
          element.mozRequestFullscreen();
        } else if (element.requestFullscreen) {
          element.requestFullscreen();
        }
      } else {
        if (document.fullscreenElement !== null) {
          document.exitFullscreen();
        }
      }
    },
    /* 跳转github网站 */
    go_github() {
      window.open(this.$store.state.github, "_blank");
    },
  },
};
</script>

<style lang='less' scoped>
@import "index.less";
</style>