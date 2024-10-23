<template>
  <div
    id="table-view"
    @contextmenu.prevent.stop="show_controls_menu"
    @click="controlsMenu.dialog = false"
  >
    <div class="select_view">
      <el-select v-model="webId" size="small">
        <el-option
          v-for="item in webData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
          <p style="float: left; color: rgba(44, 62, 80, 1)">{{ item.name }}</p>
          <span
            style="float: right; color: rgba(132, 146, 166, 1); font-size: 12px"
            >{{ item.archive }}</span
          >
        </el-option>
      </el-select>
    </div>

    <div class="table_view">
      <el-table
        :data="tableData"
        border
        empty-text="No Data Available"
        height="85vh"
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
        <el-table-column prop="id" label="id" width="180"> </el-table-column>
        <el-table-column
          prop="name"
          label="表名称"
          width="160"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="intro"
          label="表简介"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="archive"
          label="数据库信息"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="240">
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
        class="controls_view"
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
      <div class="dialog_view" v-if="controlsDialog.code">
        <div class="card_view">
          <div class="close_view" @click="controlsDialog.code = false">
            <el-link :type="controlsDialog.type" :underline="false"
              ><i class="el-icon-close"></i
            ></el-link>
          </div>
          <div class="title_view">{{ controlsDialog.title }}</div>
          <div class="form_view">
            <div class="input_view">
              <span>表名称</span>
              <el-input v-model="tableForm['name']" size="small"> </el-input>
            </div>
            <div class="textarea_view">
              <span>表简介</span>
              <el-input type="textarea" :rows="2" v-model="tableForm['intro']">
              </el-input>
            </div>
            <div class="input_view">
              <span>数据库信息</span>
              <el-input v-model="tableForm['archive']" size="small"> </el-input>
            </div>
          </div>
          <div class="submit_view">
            <div
              class="controls_button"
              :style="{ 'background-color': controlsDialog.color }"
              @click="controls_data()"
            >
              <img width="14" height="14" src="@/assets/common/confirm.png" />
            </div>
            <div class="cancel_button" @click="controlsDialog.code = false">
              <img width="14" height="14" src="@/assets/common/cancel.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="dialog_view" v-if="removeDialog.code">
        <div class="card_view">
          <div class="close_view" @click="removeDialog.code = false">
            <el-link type="danger" :underline="false"
              ><i class="el-icon-close"></i
            ></el-link>
          </div>
          <div class="title_view">Remove Info</div>
          <div class="word_view">
            <p>是否确认删除该数据？</p>
            <span>说明：该操作不可逆，请谨慎删除！</span>
          </div>
          <div class="submit_view">
            <div
              style="background-color: rgba(255, 71, 87, 1)"
              class="controls_button"
              @click="remove_data()"
            >
              <img width="14" height="14" src="@/assets/common/confirm.png" />
            </div>
            <div class="cancel_button" @click="removeDialog.code = false">
              <img width="14" height="14" src="@/assets/common/cancel.png" />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
/* 引入api */
import { $_get_web_list } from "@/api/web";
import {
  $_get_table_list,
  $_add_table_info,
  $_get_table_info,
  $_edit_table_info,
  $_remove_table_info,
} from "@/api/table";
export default {
  name: "library",
  data() {
    return {
      webData: [],
      webId: "",
      tableData: [],
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
      },
      tableForm: {},
      removeDialog: {
        code: false,
        sCount: 0,
        eCount: 0,
        message: null,
      },
    };
  },
  watch: {
    webId(newvalue) {
      this.get_table_list(newvalue);
    },
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
    /* 获取表列表 */
    get_table_list(id) {
      $_get_table_list(id).then((res) => {
        this.tableData = res.data.obj.records;
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
      type === "add" ? (this.tableForm = {}) : this.get_edit_info();
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
      $_get_table_info(this.checkBoxData[0].id).then((res) => {
        if (res.data.status === 200) {
          this.tableForm = res.data.obj;
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
        this.tableForm.sid = this.webId;
        $_add_table_info(this.tableForm).then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.get_table_list(this.webId);
            this.controlsDialog.code = false;
          } else {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
          }
        });
      } else {
        $_edit_table_info(this.checkBoxData[0].id, this.tableForm).then(
          (res) => {
            if (res.data.status === 200) {
              this.$message({
                message: res.data.message,
                type: "success",
              });
              this.get_table_list(this.webId);
              this.controlsDialog.code = false;
            } else {
              this.$message({
                message: res.data.message,
                type: "warning",
              });
            }
          }
        );
      }
    },
    /* 删除数据 */
    remove_data() {
      this.removeDialog.message = this.$message({
        duration: 0,
        message: "删除中请勿其他操作！",
        type: "success",
      });
      this.checkBoxData.forEach((item) => {
        $_remove_table_info(item.id).then((res) => {
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
            this.get_table_list(this.webId);
          }
        });
      });
    },
  },
};
</script>

<style lang="less">
@import "table.less";
</style>