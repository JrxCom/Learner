-- 表名称为意大利语
CREATE DATABASE learner;

-- 用户设计
CREATE TABLE `learner`.`user`  (
  `userid` varchar(50) NOT NULL COMMENT '登录账号',
  `password` varchar(50) NOT NULL COMMENT '登录密码',
  PRIMARY KEY (`userid`)
);

-- 网站设计
CREATE TABLE `learner`.`sitoweb` (
  `id` bigint(0) NOT NULL COMMENT '网站id',
  `name` varchar(50) NOT NULL COMMENT '网站名称',
  `logo` varchar(255) NOT NULL COMMENT '网站logo',
  `title` varchar(255) NOT NULL COMMENT '网站标签',
  `intro` varchar(255) NOT NULL COMMENT '网站简介',
  `url` varchar(255) NOT NULL COMMENT '网站地址',
  `grl` varchar(255) NOT NULL COMMENT 'git地址',
  `version` varchar(50) NOT NULL COMMENT '网站版本',
  `code` varchar(50) NOT NULL COMMENT '网站开发信息',
  `archive` varchar(50) NOT NULL COMMENT '数据库信息',
  `statement` varchar(255) NOT NULL COMMENT '底部声明',
  `creatime` datetime(0) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
);

-- 表设计
CREATE TABLE `learner`.`tabella` (
  `id` bigint(255) NOT NULL COMMENT '表id',
  `sid` bigint(255) NOT NULL COMMENT '网站id',
  `name` varchar(50) NOT NULL COMMENT '表名称',
  `intro` varchar(255) NOT NULL COMMENT '表简介',
  `archive` varchar(50) NOT NULL COMMENT '数据库信息',
  `creatime` datetime(0) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
);

-- 字段设计
CREATE TABLE `learner`.`campi` (
  `id` bigint(255) NOT NULL COMMENT '字段id',
  `tid` bigint(255) NOT NULL COMMENT '表id',
  `name` varchar(50) NOT NULL COMMENT '字段名称',
  `type` enum(
    'varchar',
    'bigint',
    'double',
    'enum',
    'set',
    'datetime'
  ) NOT NULL DEFAULT 'varchar' COMMENT '字段类型',
  `size` varchar(50) NOT NULL COMMENT '字段大小',
  `creatway` enum('文本', '图片', '音频', '视频', '下拉', '单选', '多选') NOT NULL DEFAULT '文本' COMMENT '创建方式',
  `iscontact` enum('0', '1') NOT NULL DEFAULT '0' COMMENT '是否关联',
  `archive` varchar(50) NOT NULL COMMENT '数据库信息',
  `creatime` datetime(0) NOT NULL COMMENT '创建时间'
);

-- 网站、表关联外键
ALTER TABLE
  `learner`.`tabella`
ADD
  CONSTRAINT `sitoweb_tabella_id` FOREIGN KEY (`sid`) REFERENCES `learner`.`sitoweb` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 表、字段关联外键
ALTER TABLE
  `learner`.`campi`
ADD
  CONSTRAINT `tabella_campi_id` FOREIGN KEY (`tid`) REFERENCES `learner`.`tabella` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;