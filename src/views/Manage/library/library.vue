  <template>
  <div
    id="libraryView"
    @contextmenu.prevent.stop="show_controls_menu"
    @click="controlsMenu.dialog = false"
  >
    <div class="table-view">
      <el-table
        :data="webData"

        border
        empty-text="No Data Available"
        :header-cell-style="{
          background: '#EBEEF5',
          color: '#2C3E50',
          'font-size': '14px',
          'font-family': 'eFontL',
          'font-weight': 100,
        }"
        :cell-style="{
          'font-size': '14px',
          'font-family': 'eFontL',
        }"
        :highlight-selection-row="true"
        @select="select_data"
        @select-all="select_data"
      >
        <el-table-column type="selection" width="40" align="center">
        </el-table-column>
        <el-table-column prop="id" label="id" width="130"> </el-table-column>
        <el-table-column prop="name" label="网站名称" width="80" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="网站logo" width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img
              :src="fileUrl + scope.row.logo"
              width="20"
              height="20"
              style="
                padding: 10px;
                border: 1px solid rgba(217, 236, 255, 1);
                border-radius: 4px;
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="网站标签" align="center" width="110" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.title"
              placement="bottom"
            >
              <el-tag><i class="el-icon-success"></i></el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="intro"
          label="网站简介"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.intro"
              placement="bottom"
            >
              <el-tag><i class="el-icon-success"></i></el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="网站地址" align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.url"
              placement="bottom"
            >
              <el-tag><i class="el-icon-success"></i></el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="grl" label="git地址" align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.grl"
              placement="bottom"
            >
              <el-tag><i class="el-icon-success"></i></el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="version"
          label="网站版本"
          align="center"
          width="90"
        >
          <template slot-scope="scope">
            <el-tag type="success">{{ "@" + scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="网站开发信息" align="center">
        </el-table-column>
        <el-table-column
          prop="archive"
          label="数据库信息"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="statement"
          label="底部声明"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.statement"
              placement="bottom"
            >
              <el-tag><i class="el-icon-success"></i></el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <el-tag type="info">{{
              new Date(scope.row.creatime).toLocaleString()
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <transition name="el-zoom-in-top">
      <div
        class="controls-view"
        v-show="controlsMenu.dialog"
        :style="controlsMenu.style"
      >
        <div class="add_button" @click="show_controls_dialog('add')">
          <i class="el-icon-plus"></i>添加信息
        </div>
        <div class="edit_button" @click="show_controls_dialog('edit')">
          <i class="el-icon-edit"></i>修改信息
        </div>
        <div class="remove_button" @click="show_remove_dialog('remove')">
          <i class="el-icon-close"></i>删除信息
        </div>
      </div>
    </transition>

    <el-collapse-transition>
      <div class="dialog-view" v-if="controlsDialog.code">
        <div class="card-view">
          <div class="close-view" @click="controlsDialog.code = false">
            <el-link :type="controlsDialog.type" :underline="false"
              ><i class="el-icon-close"></i
            ></el-link>
          </div>
          <div class="title-view">{{ controlsDialog.title }}</div>
          <div class="form-view">
            <div class="input-view">
              <span>网站名称</span>
              <el-input v-model="webForm['name']" size="small"> </el-input>
            </div>
            <div class="upload-view">
              <span>网站logo</span>
              <div @click="$refs.uploadRef.click()">
                <img
                  v-if="controlsDialog.logoSrc"
                  :src="fileUrl + controlsDialog.logoSrc"
                  width="100"
                  height="100"
                />
                <i v-else class="el-icon-upload"></i>
              </div>
              <input
                v-show="false"
                ref="uploadRef"
                type="file"
                accept="image/*"
                @change="upload_logo"
              />
            </div>
            <div class="input-view">
              <span>网站标签</span>
              <el-input v-model="webForm['title']" size="small"> </el-input>
            </div>
            <div class="textarea-view">
              <span>网站简介</span>
              <el-input type="textarea" :rows="2" v-model="webForm['intro']">
              </el-input>
            </div>
            <div class="input-view">
              <span>网站地址</span>
              <el-input v-model="webForm['url']" size="small"> </el-input>
            </div>
            <div class="input-view">
              <span>git地址</span>
              <el-input v-model="webForm['grl']" size="small"> </el-input>
            </div>
            <div class="input-view">
              <span>网站版本</span>
              <el-input v-model="webForm['version']" size="small"> </el-input>
            </div>
            <div class="input-view">
              <span>网站开发信息</span>
              <el-input v-model="webForm['code']" size="small"> </el-input>
            </div>
            <div class="input-view">
              <span>数据库信息</span>
              <el-input v-model="webForm['archive']" size="small"> </el-input>
            </div>
            <div class="textarea-view">
              <span>底部声明</span>
              <el-input
                type="textarea"
                :rows="2"
                v-model="webForm['statement']"
              >
              </el-input>
            </div>
          </div>
          <div class="submit-view">
            <div
              class="controls-button"
              :style="{ 'background-color': controlsDialog.color }"
              @click="controls_data()"
            >
              <img width="14" height="14" src="@/assets/common/confirm.png" />
            </div>
            <div class="cancel-button" @click="controlsDialog.code = false">
              <img width="14" height="14" src="@/assets/common/cancel.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-view" v-if="removeDialog.code">
        <div class="card-view">
          <div class="close-view" @click="removeDialog.code = false">
            <el-link type="danger" :underline="false"
              ><i class="el-icon-close"></i
            ></el-link>
          </div>
          <div class="title-view">Remove Info</div>
          <div class="word-view">
            <p>是否确认删除该数据？</p>
            <span>说明：该操作不可逆，请谨慎删除！</span>
          </div>
          <div class="submit-view">
            <div
              style="background-color: rgba(255, 71, 87, 1)"
              class="controls-button"
              @click="remove_data()"
            >
              <img width="14" height="14" src="@/assets/common/confirm.png" />
            </div>
            <div class="cancel-button" @click="removeDialog.code = false">
              <img width="14" height="14" src="@/assets/common/cancel.png" />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
/* 引入upload api */
import {
  $_get_web_list,
  $_add_web_info,
  $_get_web_info,
  $_edit_web_info,
  $_remove_web_info,
} from "@/api/web";
import { $_upload } from "@/api/upload";
export default {
  name: "library",
  data() {
    return {
      fileUrl: process.env.VUE_APP_FILE_URL,
      webData: [],
      checkBoxData: [],
      controlsMenu: {
        style: {
          top: "0px",
          left: "0px",
        },
        dialog: false,
      },
      controlsDialog: {
        code: false,
        type: "",
        title: "",
        color: "",
        logoSrc: "",
      },
      webForm: {},
      logoa: "",
      removeDialog: {
        code: false,
        sCount: 0,
        eCount: 0,
        message: null,
      },
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
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    /* 获取选择的数据 */
    select_data(selection) {
      this.checkBoxData = selection;
    },
    /* 右键显示操作数据目录 */
    show_controls_menu(event) {
      event.clientY >= 590
        ? (this.controlsMenu.style.top = "590px")
        : (this.controlsMenu.style.top = event.clientY + "px");
      event.clientX >= 1370
        ? (this.controlsMenu.style.left = "1370px")
        : (this.controlsMenu.style.left = event.clientX + "px");
      this.controlsMenu.dialog = true;
    },
    /* 显示添加修改弹窗 */
    show_controls_dialog(type) {
      if (this.checkBoxData.length === 0 && type === "edit") {
        this.$message({
          message: "请选择一条数据修改！",
          type: "warning",
        });
        return;
      } else if (this.checkBoxData.length > 1 && type === "edit") {
        this.$message({
          message: "一次只能修改一条数据！",
          type: "warning",
        });
        return;
      } else {
        this.controlsDialog.code = true;
        this.controlsMenu.dialog = false;
      }
      type === "add"
        ? ((this.webForm = {}), (this.controlsDialog.logoSrc = ""))
        : this.get_edit_info();
      this.controlsDialog.title = type === "add" ? "Add Info" : "Edit Info";
      this.controlsDialog.type = type === "add" ? "primary" : "success";
      this.controlsDialog.color =
        type === "add" ? "rgba(25, 91, 255, 1)" : "rgba(70,201,58,1)";
    },
    /* 显示删除弹窗 */
    show_remove_dialog() {
      if (this.checkBoxData.length === 0) {
        this.$message({
          message: "请选择一条数据删除！",
          type: "warning",
        });
        return;
      }
      this.removeDialog.code = true;
      this.controlsMenu.dialog = false;
    },
    /* 获取数据详细信息 */
    get_edit_info() {
      $_get_web_info(this.checkBoxData[0].id).then((res) => {
        if (res.data.status === 200) {
          this.webForm = res.data.obj;
          this.controlsDialog.logoSrc = res.data.obj.logo;
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    /* 上传logo图 */
    upload_logo(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("resource", file);
      $_upload(formData).then((res) => {
        if (res.data.status === 200) {
          this.webForm["logo"] = this.controlsDialog.logoSrc = res.data.path;
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    /* 添加修改数据 */
    controls_data() {
      if (this.controlsDialog.type === "primary") {
        $_add_web_info(this.webForm).then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.get_web_list();
            this.controlsDialog.code = false;
            this.$bus.$emit("update-menu");
          } else {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
          }
        });
      } else {
        $_edit_web_info(this.checkBoxData[0].id, this.webForm).then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.get_web_list();
            this.controlsDialog.code = false;
            this.$bus.$emit("update-menu");
          } else {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
          }
        });
      }
    },
    /* 删除数据 */
    remove_data() {
      this.removeDialog.message = this.$message({
        duration:0,
        message: "删除中请勿其他操作！",
        type: "success",
      });
      this.checkBoxData.forEach((item) => {
        $_remove_web_info(item.id).then((res) => {
          if (res.data.status === 200) {
            this.removeDialog.sCount++;
          } else {
            this.removeDialog.eCount++;
          }
          if (
            this.removeDialog.sCount + this.removeDialog.eCount ===
            this.checkBoxData.length
          ) {
            this.removeDialog.message.close();
            this.$message({
              message: `存在${this.removeDialog.sCount}条数据删除成功,存在${this.removeDialog.eCount}条数据删除失败。`,
              type: "success",
            });
            this.removeDialog.code = false;
            this.get_web_list();
            this.$bus.$emit("update-menu");
          }
        });
      });
    },
  },
};
</script>

<style lang="less">
@import "library.less";
</style>