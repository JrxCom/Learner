/* 引入数据库连接 */
const db = require('../../db/db')
/* 获取表列表 */
exports.getTabellaList = (req, res) => {
    db.query(`SELECT * FROM learner.tabella WHERE sid = ${req.query.sid} ORDER BY creatime ASC`, (err, results) => {
        if (results) res.send({ status: 200, obj: { records: results } })
        if (err) res.send({ status: 500, message: "获取栏目列表失败！" })
    })
}
/* 添加表信息 */
exports.addTabellaInfo = (req, res) => {
    /* 数据整合 */
    const $_data = Object.assign({ id: new Date().getTime() }, req.body, { creatime: new Date() })
    /* 表名称重复校验 */
    const inspect_name = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.tabella WHERE name = '${req.body.name}' AND sid = '${req.body.sid}'`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject('表名称已存在！');
                }
            }, 200)
        })
    });
    /* 数据库名称重复校验 */
    const inspect_table = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.tabella WHERE archive = '${req.body.archive}' AND sid = '${req.body.sid}'`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject("数据库表信息已存在！");
                }
            }, 400)
        })
    });

    Promise.all([inspect_name, inspect_table]).then(() => {
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
        /* 表信息添加 */
        const controls_data = new Promise((resolve, reject) => {
            db.query(`INSERT INTO learner.tabella SET ?`, $_data, (err, results) => {
                setTimeout(() => {
                    if (results) {
                        resolve()
                    } else {
                        reject("表信息添加失败！");
                    }
                }, 400)
            })
        })
        Promise.all([get_database, controls_data]).then((promiseRes) => {
            /* 数据库表信息创建 */
            db.query(`CREATE TABLE ${promiseRes[0]}.${req.body['archive']}  (
                id bigint NOT NULL COMMENT 'id',
                creatime datetime NULL COMMENT '创建时间',
                PRIMARY KEY (id)
              );`, (err, results) => {
                if (results) res.send({ status: 200, message: "添加表信息成功。" })
                if (err) res.send({ status: 500, message: "表信息添加失败！" })
            })
        }).catch(err => {
            res.send({ status: 500, message: err })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 获取表详细信息 */
exports.getTabellaInfo = (req, res) => {
    db.query(`SELECT * FROM learner.tabella WHERE id = ${req.query.id}`, (err, results) => {
        if (results) res.send({ status: 200, obj: results[0] })
        if (err) res.send({ status: 500, message: "获取表详细信息失败！" })
    })
}
/* 修改表信息 */
exports.editTabellaInfo = (req, res) => {
    /* 表名称重复校验 */
    const inspect_name = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.tabella WHERE name = '${req.body.name}' AND sid = '${req.body.sid}' AND id != ${req.query.id}`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject('表名称已存在！');
                }
            }, 200)
        })
    });
    /* 数据库名称重复校验 */
    const inspect_table = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.tabella WHERE archive = '${req.body.archive}' AND sid = '${req.body.sid}' AND id != ${req.query.id}`, (err, results) => {
            setTimeout(() => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject("数据库表信息已存在！");
                }
            }, 400)
        })
    });

    Promise.all([inspect_name, inspect_table]).then(() => {
        /* 数据整合 */
        const $_data = req.body
        delete $_data.creatime
        /* 查询数据库名称 */
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
        /* 查询数据库表名称 */
        const get_table = new Promise((resolve, reject) => {
            db.query(`SELECT * FROM learner.tabella WHERE id = ${req.query.id}`, (err, results) => {
                setTimeout(() => {
                    if (results.length) {
                        resolve(results[0]['archive'])
                    } else {
                        reject("未查询到数据库表信息！");
                    }
                }, 400)
            })
        });
        /* 修改表 */
        const controls_data = new Promise((resolve, reject) => {
            db.query(`UPDATE learner.tabella SET ? WHERE id = ${req.query.id}`, $_data, (err, results) => {
                setTimeout(() => {
                    if (results) {
                        resolve()
                    } else {
                        reject("表信息修改失败！");
                    }
                }, 600)
            })
        })
        Promise.all([get_database, get_table, controls_data]).then((promiseRes) => {
            if (promiseRes[1] === req.body['archive']) {
                res.send({ status: 200, message: "修改表信息成功。" })
            } else {
                /* 数据库表名称修改 */
                db.query(`RENAME TABLE ${promiseRes[0]}.${promiseRes[1]} TO ${promiseRes[0]}.${req.body['archive']};`, (err, results) => {
                    if (results) res.send({ status: 200, message: "修改表信息成功。" })
                    if (err) res.send({ status: 500, message: "修改表信息失败！" })
                })
            }
        }).catch(err => {
            res.send({ status: 500, message: err })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 删除表信息 */
exports.removeTabellaInfo = (req, res) => {
    /* 查询数据库名称 */
    const get_database = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.sitoweb WHERE id = ${req.query['sid']}`, (err, results) => {
            setTimeout(() => {
                if (results.length) {
                    resolve(results[0]['archive'])
                } else {
                    reject("未查询到数据库信息！");
                }
            }, 200)
        })
    });
    /* 查询数据库表名称 */
    const get_table = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.tabella WHERE id = ${req.query.id}`, (err, results) => {
            setTimeout(() => {
                if (results.length) {
                    resolve(results[0]['archive'])
                } else {
                    reject("未查询到数据库表信息！");
                }
            }, 400)
        })
    });
    /* 修改表 */
    const controls_data = new Promise((resolve, reject) => {
        db.query(`DELETE FROM learner.tabella WHERE id = ${req.query.id}`, (err, results) => {
            setTimeout(() => {
                if (results) {
                    resolve()
                } else {
                    reject("表信息删除失败！");
                }
            }, 600)
        })
    })
    Promise.all([get_database, get_table, controls_data]).then((promiseRes) => {
        db.query(`DROP TABLE ${promiseRes[0]}.${promiseRes[1]}`, (err, results) => {
            if (results) res.send({ status: 200, message: "删除表信息成功。" })
            if (err) res.send({ status: 500, message: "删除表信息失败！" })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}