/* 引入数据库连接 */
const db = require('../../db/db')
/* 获取字段列表 */
exports.getCampiList = (req, res) => {
    db.query(`SELECT * FROM learner.campi WHERE tid = ${req.query.tid} ORDER BY creatime ASC`, (err, results) => {
        if (results) res.send({ status: 200, obj: { records: results } })
        if (err) res.send({ status: 500, message: "获取字段列表失败！" })
    })
}
/* 获取关联表列表 */
exports.getRelateTabella = (req, res) => {
    db.query(`SELECT id,name,archive FROM learner.tabella WHERE sid = ${req.query.sid} AND id != ${req.query.id} ORDER BY creatime ASC`, (err, results) => {
        if (results) res.send({ status: 200, obj: { records: results } })
        if (err) res.send({ status: 500, message: "获取关联表信息失败！" })
    })
}
/* 获取关联字段列表 */
exports.getRelateCampi = (req, res) => {
    db.query(`SELECT id,name,archive FROM learner.campi WHERE tid = ${req.query.tid} AND iscontact = '0'  ORDER BY creatime ASC`, (err, results) => {
        if (results) res.send({ status: 200, obj: { records: results } })
        if (err) res.send({ status: 500, message: "获取关联字段信息失败！" })
    })
}
/* 添加字段信息 */
exports.addCampiInfo = (req, res) => {
    /* 数据整合 */
    const $_data = Object.assign({ id: new Date().getTime() }, req.body, { creatime: new Date() })
    const $_controls = { type: '', size: '' }
    /* 字段名称重复校验 */
    const inspect_name = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.campi WHERE name = '${req.body.name}' AND tid = '${req.body.tid}'`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject('字段名称已存在！');
                }
            }, 200)
        })
    });
    /* 数据库名称重复校验 */
    const inspect_field = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.campi WHERE archive = '${req.body.archive}' AND tid = '${req.body.tid}'`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject("数据库字段信息已存在！");
                }
            }, 400)
        })
    });

    Promise.all([inspect_name, inspect_field]).then(() => {
        /* 获取库名称 */
        const get_database = new Promise((resolve, reject) => {
            db.query(`SELECT * FROM learner.sitoweb WHERE id = ${req.body['sid']}`, (err, results) => {
                setTimeout(() => {
                    if (results.length) {
                        resolve(results[0]['archive'])
                    } else {
                        reject("未查询到数据库信息！");
                    }
                }, 200)
            })
        });
        /* 获取表名称 */
        const get_table = new Promise((resolve, reject) => {
            db.query(`SELECT * FROM learner.tabella WHERE id = ${req.body['tid']}`, (err, results) => {
                setTimeout(() => {
                    if (results.length) {
                        resolve(results[0]['archive'])
                    } else {
                        reject("未查询到数据库信息！");
                    }
                }, 400)
            })
        });
        /* 根据是否关联表修改添加数据 */
        const is_contact = new Promise((resolve) => {
            setTimeout(() => {
                if (req.body['iscontact'] === '1') {
                    $_data.creatway = '下拉'
                    db.query(`SELECT * FROM learner.campi WHERE id = '${req.body['size'].substring(req.body['size'].indexOf("(") + 1, req.body['size'].indexOf(")"))}'`, (err, results) => {
                        resolve({ 'data-type': 'contact', 'data-size': req.body['size'], 'controls-type': results[0].type, 'controls-size': results[0].size })
                    })
                } else {
                    resolve({ 'data-type': req.body['type'], 'data-size': req.body['size'], 'controls-type': req.body['type'], 'controls-size': req.body['size'] })
                }
            }, 600)
        })
        Promise.all([get_database, get_table, is_contact]).then((promiseRes) => {
            /* 数据库操作信息数据整理 */
            $_controls.type = promiseRes[2]['controls-type']
            $_data.type = promiseRes[2]['data-type']

            if (promiseRes[2]['data-type'] === 'bigint' || promiseRes[2]['data-type'] === 'double' || promiseRes[2]['data-type'] === 'datetime') {
                $_data.size = '0'
            } else {
                $_data.size = promiseRes[2]['data-size']
            }

            if (promiseRes[2]['controls-type'] === 'enum' || promiseRes[2]['controls-type'] === 'set') {
                $_controls.size = "(" + "'" + promiseRes[2]['controls-size'].split(',').join("','") + "'" + ")"
            } else if (promiseRes[2]['controls-type'] === 'double') {
                $_controls.size = ''
            } else if (promiseRes[2]['controls-type'] === 'bigint' || promiseRes[2]['controls-type'] === 'datetime') {
                $_controls.size = '(0)'
            } else {
                $_controls.size = "(" + promiseRes[2]['controls-size'] + ')'
            }
            console.log($_controls);
            /* 数据库保存信息数据整理 */

            delete $_data.sid
            /* 添加字段信息 */
            db.query(`INSERT INTO learner.campi SET ?`, $_data, () => {
                /* 数据库添加字段 */
                db.query(`ALTER TABLE ${promiseRes[0]}.${promiseRes[1]} ADD COLUMN ${$_data.archive} ${$_controls.type}${$_controls.size} COMMENT '${$_data.name}' AFTER \`creatime\``, (err) => {
                    console.log(err);
                    db.query(`ALTER TABLE ${promiseRes[0]}.${promiseRes[1]} MODIFY COLUMN creatime datetime(0) DEFAULT NULL COMMENT '创建时间' AFTER ${$_data.archive}`, (err, results) => {
                        if (results) res.send({ status: 200, message: "添加字段信息成功。" })
                        if (err) res.send({ status: 500, message: "添加字段信息失败！" })
                    })
                })
            })
        }).catch(err => {
            res.send({ status: 500, message: err })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 获取字段信息 */
exports.getCampiInfo = (req, res) => {
    db.query(`SELECT * FROM learner.campi WHERE id = ${req.query.id}`, (err, results) => {
        if (results) res.send({ status: 200, obj: results[0] })
        if (err) res.send({ status: 500, message: "获取字段信息失败！" })
    })
}
/* 获取关联表信息 */
exports.getRelateInfo = (req, res) => {
    db.query(`SELECT * FROM learner.campi WHERE id = ${req.query.id}`, (err, results) => {
        const $_id = results[0].size.substring(results[0].size.indexOf("(") + 1, results[0].size.indexOf(")"))
        db.query(`SELECT tid FROM learner.campi WHERE id = ${$_id}`, (err, results) => {
            if (results) res.send({ status: 200, contactId: results[0].tid })
            if (err) res.send({ status: 500, message: "获取关联信息失败！" })
        })
    })

}   
/* 修改字段信息 */
exports.editCampiInfo = (req, res) => {
    /* 数据整合 */
    const $_data = req.body
    const $_controls = { type: '', size: '' }

    /* 字段名称重复校验 */
    const inspect_name = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.campi WHERE name = '${req.body.name}' AND tid = '${req.body.tid}' AND id != ${req.query.id}`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject('字段名称已存在！');
                }
            }, 200)
        })
    });
    /* 数据库名称重复校验 */
    const inspect_field = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.campi WHERE archive = '${req.body.archive}' AND tid = '${req.body.tid}' AND id != ${req.query.id}`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject("数据库字段信息已存在！");
                }
            }, 400)
        })
    });

    Promise.all([inspect_name, inspect_field]).then(() => {
        /* 获取库名称 */
        const get_database = new Promise((resolve, reject) => {
            db.query(`SELECT * FROM learner.sitoweb WHERE id = ${req.body['sid']}`, (err, results) => {
                setTimeout(() => {
                    if (results.length) {
                        resolve(results[0]['archive'])
                    } else {
                        reject("未查询到数据库信息！");
                    }
                }, 200)
            })
        });
        /* 获取表名称 */
        const get_table = new Promise((resolve, reject) => {
            db.query(`SELECT * FROM learner.tabella WHERE id = ${req.body['tid']}`, (err, results) => {
                setTimeout(() => {
                    if (results.length) {
                        resolve(results[0]['archive'])
                    } else {
                        reject("未查询到数据库信息！");
                    }
                }, 400)
            })
        });
        /* 获取字段名称 */
        const get_field = new Promise((resolve, reject) => {
            db.query(`SELECT * FROM learner.campi WHERE id = ${req.query.id}`, (err, results) => {
                setTimeout(() => {
                    if (results.length) {
                        resolve(results[0]['archive'])
                    } else {
                        reject("未查询到数据库信息！");
                    }
                }, 600)
            })
        });
        /* 根据是否关联表修改添加数据 */
        const is_contact = new Promise((resolve) => {
            setTimeout(() => {
                if (req.body['iscontact'] === '1') {
                    db.query(`SELECT * FROM learner.campi WHERE id = '${req.body['size']}'`, (err, results) => {
                        resolve({ 'data-type': 'contact', 'data-size': req.body['size'], 'controls-type': results[0].type, 'controls-size': results[0].size })
                    })
                } else {
                    resolve({ 'data-type': req.body['type'], 'data-size': req.body['size'], 'controls-type': req.body['type'], 'controls-size': req.body['size'] })
                }
            }, 600)
        })
        Promise.all([get_database, get_table, get_field, is_contact]).then((promiseRes) => {
            /* 数据库操作信息数据整理 */
            $_controls.type = promiseRes[3]['controls-type']
            if (promiseRes[3]['controls-type'] === 'enum' || promiseRes[3]['controls-type'] === 'set') {
                $_controls.size = "'" + promiseRes[3]['controls-size'].split(',').join("','") + "'"
            } else {
                $_controls.size = promiseRes[3]['controls-size']
            }
            /* 数据库保存信息数据整理 */
            $_data.type = promiseRes[3]['data-type']
            $_data.size = promiseRes[3]['data-size']
            delete $_data.sid
            delete $_data.creatime
            /* 修改字段信息 */
            db.query(`UPDATE learner.campi SET ? WHERE id = ${req.query.id}`, $_data, (err) => {
                db.query(`ALTER TABLE ${promiseRes[0]}.${promiseRes[1]} CHANGE COLUMN ${promiseRes[2]} ${$_data.archive} ${$_controls.type}(${$_controls.size}) DEFAULT NULL COMMENT '${req.body['name']}';`, (err, results) => {
                    if (results) res.send({ status: 200, message: "修改字段信息成功。" })
                    if (err) res.send({ status: 500, message: "修改字段信息失败！" })
                })
            })
        }).catch(err => {
            res.send({ status: 500, message: err })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 删除字段信息 */
exports.removeCampiInfo = (req, res) => {
    /* 获取库名称 */
    const get_database = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.sitoweb WHERE id = ${req.query.sid}`, (err, results) => {
            setTimeout(() => {
                if (results.length) {
                    resolve(results[0]['archive'])
                } else {
                    reject("未查询到数据库信息！");
                }
            }, 200)
        })
    });
    /* 获取表名称 */
    const get_table = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.tabella WHERE id = ${req.query.tid}`, (err, results) => {
            setTimeout(() => {
                if (results.length) {
                    resolve(results[0]['archive'])
                } else {
                    reject("未查询到数据库信息！");
                }
            }, 400)
        })
    });
    /* 获取字段名称 */
    const get_field = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.campi WHERE id = ${req.query.id}`, (err, results) => {
            setTimeout(() => {
                if (results.length) {
                    resolve(results[0]['archive'])
                } else {
                    reject("未查询到数据库信息！");
                }
            }, 600)
        })
    });
    Promise.all([get_database, get_table, get_field]).then((promiseRes) => {
        /* 删除字段信息 */
        db.query(`DELETE FROM learner.campi WHERE id = ${req.query.id}`, () => {
            db.query(`ALTER TABLE ${promiseRes[0]}.${promiseRes[1]} DROP ${promiseRes[2]}`, (err, results) => {
                if (results) res.send({ status: 200, message: "删除字段信息成功。" })
                if (err) res.send({ status: 500, message: "删除字段信息失败！" })
            })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}