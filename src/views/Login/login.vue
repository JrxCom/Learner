<template>
  <div id="login-view">
    <!-- logo与网站标题 -->
    <div class="logo_view">
      <img src="@/assets/common/logo.png" width="30" height="30" />
      <h3>LeaRneR</h3>
    </div>
    <!-- 文字 -->
    <div class="word_view">
      <p>We will</p>
      <p>Continue</p>
      <p>To working hard<b>.</b></p>
      <span>{{ year }}y.</span>
      <span>{{ month }}m.</span>
      <span>{{ date }}d.</span>
    </div>
    <!-- 点修饰 -->
    <div class="dot_view">
      <span>·</span>
      <span>·</span>
      <span>·</span>
      <span>·</span>
      <span>·</span>
      <span>·</span>
      <span>·</span>
      <span>·</span>
      <span>·</span>
    </div>
    <!-- 登录按钮 -->
    <div
      class="login_btn"
      @click="
        loginDialog = true;
        get_code();
      "
    >
      <img width="20" height="20" src="@/assets/login/login.png" />
      Log in
    </div>
    <!-- 星星 -->
    <div class="star_view">
      <el-rate v-model="showValue.rate"></el-rate>
    </div>
    <!-- linux -->
    <div class="linux_view">
      <img src="@/assets/login/Linux.png" />
    </div>
    <!-- pc -->
    <div class="windows_view">
      <img src="@/assets/login/Windows.png" />
    </div>
    <!-- react -->
    <div class="react_view">
      <img src="@/assets/login/React.png" />
      <p><span>React</span>用于构建 Web 和原生交互界面的库</p>
    </div>
    <!-- angular -->
    <div class="angular_view">
      <img src="@/assets/login/Angular.png" />
      <p><span>Angular</span>构建未来的 Web 开发框架</p>
    </div>
    <!-- javascript -->
    <div class="javascript_view">
      <el-switch
        active-text="JavaScript"
        inactive-text="TypeScript"
        v-model="showValue.switch"
      >
      </el-switch>
    </div>
    <!-- java -->
    <div class="java_view">
      <el-checkbox> Java </el-checkbox>
      <el-checkbox> Node.js </el-checkbox>
      <el-checkbox> Python </el-checkbox>
      <el-checkbox> Go </el-checkbox>
      <el-checkbox> PHP </el-checkbox>
      <el-checkbox> Ruby </el-checkbox>
    </div>
    <!-- browser -->
    <div class="browser_view">
      <img src="@/assets/login/Chrome.png" />
      <img src="@/assets/login/Edge.png" />
      <img src="@/assets/login/Firefox.png" />
      <img src="@/assets/login/360.png" />
      <img src="@/assets/login/QQ.png" />
      <img src="@/assets/login/Quark.png" />
    </div>
    <!-- homelogo -->
    <div class="homelogo_view">
      <img src="@/assets/login/home.png" />
    </div>
    <!-- vue -->
    <div class="vue_view">
      <img src="@/assets/login/Vue.png" />
      <p><span>Vue</span>是一套用于构建用户界面的渐进式框架</p>
    </div>
    <!-- html -->
    <div class="html_view">
      <img src="@/assets/login/HTML.png" />
      <img src="@/assets/login/CSS.png" />
    </div>
    <!-- less -->
    <div class="less_view">
      <el-radio v-model="showValue.radio" label="Less">Less</el-radio>
      <el-radio v-model="showValue.radio" label="Sass">Sass</el-radio>
      <el-radio v-model="showValue.radio" label="Stylus">Stylus</el-radio>
      <el-radio v-model="showValue.radio" label="PostCSS">PostCSS</el-radio>
    </div>
    <!-- ios -->
    <div class="ios_view">
      <img src="@/assets/login/IOS.png" />
    </div>
    <!-- ui -->
    <div class="ui_view">
      <el-table
        :data="showValue.table"
        size="mini"
        :show-header="false"
        border
        stripe
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="UI"> </el-table-column>
      </el-table>
    </div>
    <!-- compiler -->
    <div class="compiler_view">
      <el-input
        placeholder="HBuilderX"
        suffix-icon="el-icon-star-off"
        size="small"
      >
      </el-input>
      <el-input
        placeholder="Vs Code"
        suffix-icon="el-icon-star-off"
        size="small"
      >
      </el-input>
      <el-input
        placeholder="Intellij IDEA"
        suffix-icon="el-icon-star-off"
        size="small"
      >
      </el-input>
      <el-input
        placeholder="Navicat Premium"
        suffix-icon="el-icon-star-off"
        size="small"
      >
      </el-input>
    </div>
    <!-- android -->
    <div class="android_view">
      <img src="@/assets/login/Android.png" />
    </div>

    <el-collapse-transition>
      <!-- 登录弹窗 -->
      <div class="dialog_view" v-show="loginDialog">
        <div class="card_view">
          <div class="close_view" @click="loginDialog = false">
            <el-link type="primary" :underline="false"
              ><i class="el-icon-close"></i
            ></el-link>
          </div>
          <div class="title_view">Log In</div>
          <div class="form_view">
            <el-input
              placeholder="User id"
              v-model="loginForm['userid']"
              prefix-icon="el-icon-user"
              size="small"
              @keyup.enter.native="log_in()"
            >
            </el-input>

            <el-input
              placeholder="Password"
              v-model="loginForm['password']"
              prefix-icon="el-icon-lock"
              show-password
              size="small"
              @keyup.enter.native="log_in()"
            >
            </el-input>

            <div class="code">
              <el-input
                placeholder="Code"
                v-model="loginForm['code']"
                prefix-icon="el-icon-c-scale-to-original"
                size="small"
                @keyup.enter.native="log_in()"
              >
              </el-input>
              <div v-html="authSvgUrl" @click="get_code()"></div>
            </div>
            <el-checkbox v-model="loginForm['remember']">
              Remember me
            </el-checkbox>
          </div>
          <div class="submit_view">
            <div class="login_button" @click="log_in()">
              <img width="14" height="14" src="@/assets/login/login.png" />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
/* 引入log api */
import { $_get_code, $_login } from "@/api/log";
export default {
  name: "login",
  data() {
    return {
      year: new Date().getFullYear().toString().slice(2) /* 年份 */,
      month: (new Date().getMonth() + 1).toString().padStart(2, "0") /* 月份 */,
      date: new Date().getDate().toString().padStart(2, "0") /* 日期 */,
      showValue: {
        radio: "" /* 单选展示参数 */,
        switch: true /* 开关展示参数 */,
        table: [
          { UI: "Element UI" },
          { UI: "Ant Design" },
          { UI: "Vant 4" },
          { UI: "Vuesax" },
        ] /* 表格展示参数 */,
        rate: null /* 星星数据 */,
      },
      authSvgUrl: "" /* 验证码 svg 路径 */,
      loginDialog: false /* 登录弹窗显示参数 */,
      loginForm: {
        userid: localStorage.getItem("userid") || "",
        password: localStorage.getItem("password") || "",
        code: "",
        remember: Boolean(localStorage.getItem("remember")),
      } /* 用户登录表单 */,
    };
  },
  methods: {
    /* 获取验证码 */
    get_code() {
      $_get_code().then((res) => {
        this.authSvgUrl = res.data;
      });
    },
    /* 登录 */
    log_in() {
      $_login(this.loginForm).then((res) => {
        if (res.data.status === 200) {
          if (this.loginForm["remember"]) {
            localStorage.setItem("userid", this.loginForm["userid"]);
            localStorage.setItem("password", this.loginForm["password"]);
            localStorage.setItem("remember", this.loginForm["remember"]);
          } else {
            localStorage.removeItem("userid");
            localStorage.removeItem("password");
            localStorage.removeItem("remember");
          }
          this.$message({
            message: res.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.loginDialog = false;
            this.$router.push({ path: "/" });
          }, 2000);
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
          this.get_code();
        }
      });
    },
  },
};
</script>

<style lang='less'>
@import "login.less";
</style>