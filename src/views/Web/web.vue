<template>
  <div id="web-view">
    <div class="nav_view">
      <el-menu
        style="font-family: 'eFontL'"
        :default-active="navActive"
        mode="horizontal"
        background-color="rgba(235,238,245, 1)"
        text-color="rgba(44, 62, 80, 1)"
        active-text-color="rgba(64,158,255,1)"
      >
        <el-menu-item
          @click="navActive = item.id + ''"
          v-for="item in navData"
          :key="item.id"
          :index="item.id + ''"
          >{{ item.name }}</el-menu-item
        >
      </el-menu>
    </div>
    <div
      style="padding: 20px; box-sizing: border-box; height: 91vh"
      @contextmenu.prevent.stop="show_controls_menu"
      @click="controlsMenu.dialog = false"
    >
      <div class="table_view">
        <el-table
          :data="dataList"
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
          <el-table-column prop="id" label="id" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p style="font-size: 12px; color: #409eff">{{ scope.row.id }}</p>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in headerData"
            :key="item.id"
            :prop="item.archive"
            :label="item.name"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="item.creatway === '文本'">
                <div v-if="item.type === 'datetime'">
                  <p style="color: black; font-size: 12px">
                    {{ new Date(scope.row[item.archive]).toLocaleString() }}
                  </p>
                </div>
                <div v-else>
                  <p style="color: black; text-decoration: underline">
                    {{ scope.row[item.archive] }}
                  </p>
                </div>
              </div>
              <div v-else-if="item.creatway === '图片'">
                <el-popover placement="bottom" trigger="click">
                  <img width="150" :src="fileUrl + scope.row[item.archive]" />
                  <el-button type="primary" plain slot="reference" size="small"
                    ><i class="el-icon-picture-outline-round"></i
                  ></el-button>
                </el-popover>
              </div>
              <div v-else-if="item.creatway === '音频'">
                <el-popover placement="bottom" trigger="click">
                  <audio
                    controls
                    :src="fileUrl + scope.row[item.archive]"
                  ></audio>
                  <el-button type="primary" plain slot="reference" size="small"
                    ><i class="el-icon-headset"></i
                  ></el-button>
                </el-popover>
              </div>
              <div v-else-if="item.creatway === '视频'">
                <el-popover placement="bottom" trigger="click">
                  <video
                    width="300"
                    controls
                    :src="fileUrl + scope.row[item.archive]"
                  ></video>
                  <el-button type="primary" plain slot="reference" size="small"
                    ><i class="el-icon-video-play"></i
                  ></el-button>
                </el-popover>
              </div>
              <div v-else>
                <div v-if="item.type === 'contact'">
                  <p style="color: #67c23a">{{ scope.row[item.archive] }}</p>
                </div>
                <div v-else>
                  <p style="color: black">{{ scope.row[item.archive] }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <p style="font-size: 12px; color: #909399">
                {{ new Date(scope.row.creatime).toLocaleDateString() }}
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page_view" v-show="dataList.length">
        <el-pagination
          background
          @size-change="data_size_change"
          @current-change="data_page_change"
          :current-page.sync="dataPagination.page"
          :page-sizes="[5, 10]"
          :page-size="dataPagination.size"
          layout="sizes, prev, pager, next"
          :total="dataTotal"
        >
        </el-pagination>
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
              <div v-for="(item, index) in headerData" :key="item.id">
                <div class="input_view" v-if="item.creatway === '文本'">
                  <span>{{ item.archive }}</span>
                  <el-date-picker
                    size="small"
                    v-if="item.type === 'datetime'"
                    v-model="dataForm[item.archive]"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                  <el-input
                    v-else
                    placeholder="请输入内容"
                    size="small"
                    v-model="dataForm[item.archive]"
                  >
                  </el-input>
                </div>

                <div class="image_view" v-else-if="item.creatway === '图片'">
                  <span>{{ item.archive }}</span>
                  <div @click="$refs.imageUploadRef[0].click()">
                    <img
                      v-if="dataForm[item.archive]"
                      :src="fileUrl + dataForm[item.archive]"
                      width="100"
                      height="100"
                    />
                    <i v-else class="el-icon-upload"></i>
                  </div>
                  <input
                    v-show="false"
                    ref="imageUploadRef"
                    type="file"
                    accept="image/*"
                    @change="upload_image($event, item.archive)"
                  />
                </div>

                <div class="audio_view" v-else-if="item.creatway === '音频'">
                  <span>{{ item.archive }}</span>
                  <div @click="$refs.audioUploadRef[0].click()">
                    <audio
                      controls
                      v-if="dataForm[item.archive]"
                      :src="fileUrl + dataForm[item.archive]"
                      style="width: 100%"
                    ></audio>
                    <i v-else class="el-icon-upload"></i>
                  </div>
                  <input
                    v-show="false"
                    ref="audioUploadRef"
                    type="file"
                    accept="audio/*"
                    @change="upload_audio($event, item.archive)"
                  />
                </div>

                <div class="video_view" v-else-if="item.creatway === '视频'">
                  <span>{{ item.archive }}</span>
                  <div @click="$refs.videoUploadRef[0].click()">
                    <video
                      controls
                      v-if="dataForm[item.archive]"
                      :src="fileUrl + dataForm[item.archive]"
                      style="width: 100%"
                    ></video>
                    <i v-else class="el-icon-upload"></i>
                  </div>
                  <input
                    v-show="false"
                    ref="videoUploadRef"
                    type="file"
                    accept="video/*"
                    @change="upload_video($event, item.archive)"
                  />
                </div>

                <div class="select_view" v-else-if="item.creatway === '下拉'">
                  <span>{{ item.archive }}</span>

                  <el-select
                    size="small"
                    v-model="dataForm[item.archive]"
                    placeholder="请选择"
                    v-if="item.type === 'contact'"
                  >
                    <el-option
                      v-for="(item_, index_) in dataOption[item.archive]"
                      :key="index_"
                      :value="item_"
                    >
                      <span style="float: left">{{ item_.value }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item_.id }}</span
                      >
                    </el-option>
                  </el-select>

                  <el-select
                    v-else
                    v-model="dataForm[item.archive]"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="(item_, index_) in dataOption[item.archive]"
                      :key="index_"
                      :label="item_"
                      :value="item_"
                    >
                    </el-option>
                  </el-select>
                </div>

                <div class="radio_view" v-else-if="item.creatway === '单选'">
                  <span>{{ item.archive }}</span>
                  <div class="content_view">
                    <el-radio-group v-model="dataForm[item.archive]">
                      <el-radio
                        v-for="(item_, index_) in dataOption[item.archive]"
                        :key="index_"
                        :label="item_"
                        >{{ item_ }}</el-radio
                      >
                    </el-radio-group>
                  </div>
                </div>

                <div class="checkbox_view" v-else-if="item.creatway === '多选'">
                  <span>{{ item.archive }}</span>
                  <div class="content_view">
                    <el-checkbox
                      v-model="checkValue[index]"
                      v-for="(item_, index_) in dataOption[item.archive]"
                      :key="index_"
                      :label="item_"
                      :value="item_"
                      @change="convert_check_data(item.archive, index)"
                    ></el-checkbox>
                  </div>
                </div>
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
  </div>
</template>

<script>
/* 引入upload api */
import { $_get_web_list } from "@/api/web";
import { $_get_table_list } from "@/api/table";
import { $_get_field_list } from "@/api/field";
import {
  $_get_data_list,
  $_get_relate_data,
  $_add_data_info,
  $_get_data_info,
  $_edit_data_info,
  $_remove_data_info,
} from "@/api/data";
import { $_upload } from "@/api/upload";
export default {
  name: "library",
  data() {
    return {
      checkValue: [],
      fileUrl: process.env.VUE_APP_FILE_URL,
      navData: [],
      navActive: "1",
      headerData: [],
      tableId: "",
      dataList: [],
      dataTotal: 0,
      dataPagination: {
        page: 1,
        size: 10,
      },
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
        imageSrc: "",
      },
      removeDialog: {
        code: false,
        sCount: 0,
        eCount: 0,
        message: null,
      },
      dataForm: [],
      dataOption: {},
    };
  },
  watch: {
    navActive(newvalue) {
      $_get_field_list(newvalue).then((res) => {
        this.tableId = newvalue;
        this.headerData = res.data.obj.records;
        this.get_data_list(
          this.$route.query.id,
          newvalue,
          this.dataPagination.page,
          this.dataPagination.size
        );
      });
    },
    dataPagination: {
      deep: true,
      handler(newvalue) {
        this.get_data_list(
          this.$route.query.id,
          this.tableId,
          newvalue.page,
          newvalue.size
        );
      },
    },
  },
  created() {
    this.get_nav_list();
  },
  methods: {
    /* 菜单列表 */
    get_nav_list() {
      $_get_table_list(this.$route.query.id).then((res) => {
        this.navData = res.data.obj.records;
        this.navActive = res.data.obj.records[0].id + "";
      });
    },
    /* 数据列表 */
    get_data_list(sid, tid, page, size) {
      $_get_data_list(sid, tid, page, size).then((res) => {
        this.dataList = res.data.obj.records;
        this.dataTotal = res.data.obj.total;
      });
    },
    /* 更改数据展示条数 */
    data_size_change(value) {
      this.dataPagination.size = value;
      this.dataPagination.page = 1;
    },
    /* 更改数据展示页数 */
    data_page_change(value) {
      this.dataPagination.page = value;
    },
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
    /* 上传图片 */
    upload_image(event, param) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("resource", file);
      $_upload(formData).then((res) => {
        if (res.data.status === 200) {
          this.$set(this.dataForm, param, res.data.path);
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    /* 上传音频 */
    upload_audio(event, param) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("resource", file);
      $_upload(formData).then((res) => {
        if (res.data.status === 200) {
          this.$set(this.dataForm, param, res.data.path);
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      });
    },
    /* 上传视频 */
    upload_video(event, param) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("resource", file);
      $_upload(formData).then((res) => {
        if (res.data.status === 200) {
          this.$set(this.dataForm, param, res.data.path);
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
      this.get_data_option();
      this.controlsDialog.title = type === "add" ? "Add Info" : "Edit Info";
      this.controlsDialog.type = type === "add" ? "primary" : "success";
      this.controlsDialog.color =
        type === "add" ? "rgba(25, 91, 255, 1)" : "rgba(70,201,58,1)";
      type === "add" ? (this.dataForm = {}) : this.get_edit_info();
    },

    get_data_option() {
      this.headerData.forEach((item) => {
        if (item.type === "contact") {
          $_get_relate_data(
            this.$route.query.id,
            item.size.substring(
              item.size.indexOf("(") + 1,
              item.size.indexOf(")")
            )
          ).then((res) => {
            this.$set(this.dataOption, item.archive, res.data.obj.records);
          });
        } else {
          this.$set(this.dataOption, item.archive, item.size.split(","));
        }
        this.checkValue.push([]);
      });
    },
    convert_check_data(param, index) {
      this.dataForm[param] = this.checkValue[index].join();
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
      $_get_data_info(
        this.$route.query.id,
        this.tableId,
        this.checkBoxData[0].id
      ).then((res) => {
        if (res.data.status === 200) {
          this.dataForm = res.data.obj;
          this.headerData.forEach((item,index) => {
            if (item.creatway === "多选") {
              this.checkValue[index].push(...this.dataForm[item.archive].split(","));
            }
          });
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
        $_add_data_info(this.$route.query.id, this.tableId, this.dataForm).then(
          (res) => {
            if (res.data.status === 200) {
              this.$message({
                message: res.data.message,
                type: "success",
              });
              this.get_data_list(
                this.$route.query.id,
                this.tableId,
                this.dataPagination.page,
                this.dataPagination.size
              );
              this.controlsDialog.code = false;
            } else {
              this.$message({
                message: res.data.message,
                type: "warning",
              });
            }
          }
        );
      } else {
        $_edit_data_info(
          this.$route.query.id,
          this.tableId,
          this.checkBoxData[0].id,
          this.dataForm
        ).then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.get_data_list(
              this.$route.query.id,
              this.tableId,
              this.dataPagination.page,
              this.dataPagination.size
            );
            this.controlsDialog.code = false;
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
        duration: 0,
        message: "删除中请勿其他操作！",
        type: "success",
      });
      this.checkBoxData.forEach((item) => {
        $_remove_data_info(this.$route.query.id, this.tableId, item.id).then(
          (res) => {
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
              this.get_data_list(
                this.$route.query.id,
                this.tableId,
                this.dataPagination.page,
                this.dataPagination.size
              );
            }
          }
        );
      });
    },
  },
};
</script>

<style lang="less">
@import "web.less";
</style>