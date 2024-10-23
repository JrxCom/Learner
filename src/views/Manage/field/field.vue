<template>
  <div
    id="field-view"
    @contextmenu.prevent.stop="show_controls_menu"
    @click="controlsMenu.dialog = false"
  >
    <div class="tree_view">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="searchText"
        size="small"
      >
      </el-input>

      <el-tree
        style="margin-top: 10px"
        ref="webTreeRef"
        empty-text="No Data Available"
        :data="treeData"
        :props="{
          children: 'children',
          label: 'name',
        }"
        :filter-node-method="filter_node"
        :highlight-current="true"
        :node-click="click_node"
      >
        <div
          style="font-family: 'eFontL'; color: rgba(44, 62, 80, 1); width: 100%"
          slot-scope="{ data }"
          @click="click_node(data.sid, data.id)"
        >
          <div style="font-size: 14px">
            {{ data.name }}
            <span style="font-size: 12px; color: rgba(144, 147, 153, 1)"
              >({{ data.archive }})</span
            >
          </div>
        </div>
      </el-tree>
    </div>

    <div class="table_view">
      <el-table
        :data="tableData"
        border
        height="95vh"
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
        <el-table-column prop="id" label="id"> </el-table-column>
        <el-table-column
          prop="name"
          label="字段名称"
          width="140"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="iscontact"
          label="是否关联"
          width="100"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.iscontact === "0" ? "否" : "是" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="字段类型"
          width="100"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="size"
          label="字段大小"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="creatway"
          label="创建方式"
          width="100"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="archive"
          label="数据库信息"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="200">
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
              <span>字段名称</span>
              <el-input v-model="tableForm['name']" size="small"> </el-input>
            </div>
            <div class="input_view">
              <span>是否关联其他表</span>
              <el-select
                v-model="tableForm['iscontact']"
                placeholder="请选择"
                size="small"
                @change="is_contact"
              >
                <el-option label="否" value="0"> </el-option>
                <el-option label="是" value="1"> </el-option>
              </el-select>
            </div>
            <div
              class="input_view"
              v-show="controlsDialog.iscontact.type === 0"
            >
              <span>字段类型</span>
              <el-select
                v-model="tableForm['type']"
                placeholder="请选择"
                size="small"
                :disabled="controlsDialog.disabled"
              >
                <el-option
                  v-for="item in controlsDialog.typeOption"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div class="input_view" v-if="controlsDialog.iscontact.type === 0">
              <span>字段大小</span>
              <el-input v-model="tableForm['size']" size="small"> </el-input>
            </div>

            <div class="input_view" v-if="controlsDialog.iscontact.type === 1">
              <span>关联表</span>
              <el-select
                v-model="controlsDialog.iscontact.table"
                placeholder="请选择"
                size="small"
                @change="is_table"
              >
                <el-option
                  v-for="item in controlsDialog.iscontact.iscontactTableOption"
                  :key="item.id"
                  :label="item.name + '(' + item.id + ')'"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.id
                  }}</span>
                </el-option>
              </el-select>
            </div>
            <div class="input_view" v-if="controlsDialog.iscontact.type === 1">
              <span>关联字段</span>
              <el-select
                v-model="tableForm['size']"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in controlsDialog.iscontact.iscontactFieldOption"
                  :key="item.id"
                  :label="item.name + '(' + item.id + ')'"
                  :value="item.name + '(' + item.id + ')'"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.id
                  }}</span>
                </el-option>
              </el-select>
            </div>

            <div class="input_view">
              <span>创建方式</span>
              <el-select
                v-model="tableForm['creatway']"
                placeholder="请选择"
                size="small"
                :disabled="controlsDialog.disabled"
              >
                <el-option
                  v-for="item in controlsDialog.creatOption"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
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
import { $_get_sitoweb_tree } from "@/api/web";
import {
  $_get_field_list,
  $_get_select_table,
  $_get_select_field,
  $_add_field_info,
  $_get_field_info,
  $_edit_field_info,
  $_remove_field_info,
  $_get_relate_info,
} from "@/api/field";
export default {
  name: "field",
  data() {
    return {
      treeData: [],
      webId: "",
      searchText: "",
      tableId: "",
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
        disabled: false,
        iscontact: {
          type: 0,
          table: "",
          iscontactTableOption: [],
          field: "",
          iscontactFieldOption: [],
        },
        typeOption: ["varchar", "bigint", "double", "enum", "set", "datetime"],
        creatOption: ["文本", "图片", "音频", "视频", "下拉", "单选", "多选"],
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
    searchText(newvalue) {
      this.$refs.webTreeRef.filter(newvalue);
    },
  },
  created() {
    this.get_web_tree();
  },
  methods: {
    /* 获取网站树列表 */
    get_web_tree() {
      $_get_sitoweb_tree().then((res) => {
        if (res.data.status === 200) {
          this.treeData = res.data.obj;
          
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    /* 筛选网站 */
    filter_node(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /* 点击树信息 */
    click_node(sid, id) {
      if (sid) {
        this.tableId = id;
        this.webId = sid;
        this.get_field_data();
      }
    },
    /* 获取字段信息 */
    get_field_data() {
      $_get_field_list(this.tableId).then((res) => {
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
      type === "add"
        ? ((this.tableForm = {}),
          (this.controlsDialog.iscontact.type = 0),
          (this.controlsDialog.disabled = false))
        : this.get_edit_info();
      type === "add";
      this.controlsDialog.title = type === "add" ? "Add Info" : "Edit Info";
      this.controlsDialog.type = type === "add" ? "primary" : "success";
      this.controlsDialog.color =
        type === "add" ? "rgba(25, 91, 255, 1)" : "rgba(70,201,58,1)";
    },
    is_contact(value) {
      if (value === "1") {
        this.controlsDialog.disabled = true;
        this.controlsDialog.iscontact.type = 1;
        this.controlsDialog.iscontact.table = "";
        this.tableForm.size = "";
        this.tableForm.creatway = "下拉";
        this.get_select_table();
      } else {
        this.controlsDialog.disabled = false;
        this.controlsDialog.iscontact.type = 0;
      }
    },
    get_select_table() {
      $_get_select_table(this.webId, this.tableId).then((res) => {
        if (res.data.status === 200) {
          this.controlsDialog.iscontact.iscontactTableOption =
            res.data.obj.records;
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    is_table(value) {
      this.get_select_field(value);
    },
    get_select_field(id) {
      $_get_select_field(id).then((res) => {
        if (res.data.status === 200) {
          this.controlsDialog.iscontact.iscontactFieldOption =
            res.data.obj.records;
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
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
      $_get_field_info(this.checkBoxData[0].id).then((res) => {
        if (res.data.status === 200) {
          this.tableForm = res.data.obj;
          if (this.tableForm.type === "contact") {
            this.controlsDialog.disabled = true;
            this.controlsDialog.iscontact.type = 1;
            this.controlsDialog.iscontact.table = "";
            this.get_select_table();
            this.get_table_info(this.tableForm.id);
          }
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    get_table_info(id) {
      $_get_relate_info(id).then((res) => {
        this.controlsDialog.iscontact.table = res.data.contactId;
      });
    },
    /* 添加修改数据 */
    controls_data() {
      this.tableForm.tid = this.tableId;
      this.tableForm.sid = this.webId;
      if (this.controlsDialog.type === "primary") {
        $_add_field_info(this.tableForm).then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.get_field_data();
            this.controlsDialog.code = false;
          } else {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
          }
        });
      } else {
        $_edit_field_info(this.checkBoxData[0].id, this.tableForm).then(
          (res) => {
            if (res.data.status === 200) {
              this.$message({
                message: res.data.message,
                type: "success",
              });
              this.get_field_data();
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
        duration:0,
        message: "删除中请勿其他操作！",
        type: "info",
      });
      this.checkBoxData.forEach((item) => {
        $_remove_field_info(item.id, this.tableId, this.webId).then((res) => {
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
            this.get_field_data();
          }
        });
      });
    },
  },
};
</script>

<style lang="less">
@import "field.less";
</style>