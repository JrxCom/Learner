/* 引入数据库连接 */
const db = require('../../db/db')
/* 获取网站列表 */
exports.getSitowebList = (req, res) => {
    db.query(`SELECT * FROM learner.sitoweb ORDER BY creatime ASC`, (err, results) => {
        if (results) res.send({ status: 200, obj: { records: results } })
        if (err) res.send({ status: 500, message: "查询网站列表失败！" })
    })
}
/* 添加网站信息 */
exports.addSitowebInfo = (req, res) => {
    /* 数据整合 */
    const $_data = Object.assign({ id: new Date().getTime() }, req.body, { creatime: new Date() })
    /* 网站名称重复校验 */
    const inspect_name = new Promise((resolve, reject) => {
        setTimeout(() => {
            db.query(`SELECT * FROM learner.sitoweb WHERE name = '${$_data.name}'`, (err, results) => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject('网站名称已存在！');
                }
            })
        }, 200)
    });
    /* 数据库名称重复校验 */
    const inspect_database = new Promise((resolve, reject) => {
        setTimeout(() => {
            db.query(`SELECT * FROM learner.sitoweb WHERE archive = '${$_data.archive}'`, (err, results) => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject("数据库信息已存在！");
                }
            })
        }, 400)
    });

    Promise.all([inspect_name, inspect_database]).then(() => {
        /* 数据库创建 */
        const controls_database = new Promise((resolve, reject) => {
            setTimeout(() => {
                db.query(`CREATE DATABASE ${$_data.archive}`, (err, results) => {
                    if (results) {
                        resolve()
                    } else {
                        reject("数据库信息创建失败！")
                    }
                })
            }, 200)
        })
        /* 网站创建 */
        const controls_data = new Promise((resolve, reject) => {
            setTimeout(() => {
                db.query(`INSERT INTO learner.sitoweb SET ?`, $_data, (err, results) => {
                    if (results) {
                        resolve("网站信息创建成功。")
                    } else {
                        reject("网站信息创建失败！")
                    }
                })
            }, 400)
        })
        Promise.all([controls_database, controls_data]).then((promiseRes) => {
            return res.send({ status: 200, message: promiseRes[1] })
        }).catch(err => {
            return res.send({ status: 500, message: err })
        })
    }).catch(err => {
        return res.send({ status: 500, message: err })
    })
}
/* 获取网站详细信息 */
exports.getSitowebInfo = (req, res) => {
    db.query(`SELECT * FROM learner.sitoweb WHERE id = ${req.query.id}`, (err, results) => {
        if (results) res.send({ status: 200, obj: results[0] })
        if (err) res.send({ status: 500, message: "查询网站详细信息失败！" })
    })
}
/* 修改网站详细信息 */
exports.editSitowebInfo = (req, res) => {
    /* 数据整合 */
    const $_data = req.body
    delete $_data.creatime
    /* 网站名称重复校验 */
    const inspect_name = new Promise((resolve, reject) => {
        setTimeout(() => {
            db.query(`SELECT * FROM learner.sitoweb WHERE name = '${req.body.name}' AND id != ${req.query.id}`, (err, results) => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject('网站名称已存在！');
                }
            })
        }, 200)
    });
    /* 数据库重复校验 */
    const inspect_database = new Promise((resolve, reject) => {
        setTimeout(() => {
            db.query(`SELECT * FROM learner.sitoweb WHERE archive = '${req.body.archive}' AND id != ${req.query.id}`, (err, results) => {
                if (results.length <= 0) {
                    resolve()
                } else {
                    reject("数据库信息已存在！");
                }
            })
        }, 400)
    });

    Promise.all([inspect_name, inspect_database]).then(() => {
        /* 查询数据库名称 */
        const get_database = new Promise((resolve, reject) => {
            setTimeout(() => {
                db.query(`SELECT * FROM learner.sitoweb WHERE id = ${req.query.id}`, (err, results) => {
                    if (results.length) {
                        resolve(results[0]['archive'])
                    } else {
                        reject("未查询到数据库信息！");
                    }
                })
            }, 200)
        });
        /* 修改网站 */
        const controls_data = new Promise((resolve, reject) => {
            setTimeout(() => {
                db.query(`UPDATE learner.sitoweb SET ? WHERE id = ${req.query.id}`, $_data, (err, results) => {
                    if (results) {
                        resolve()
                    } else {
                        reject("网站信息修改失败！");
                    }
                })
            }, 400)
        })
        Promise.all([get_database, controls_data]).then((promiseRes) => {
            if (promiseRes) {
                if (promiseRes[0] === req.body['archive']) {
                    res.send({ status: 200, message: "修改网站信息成功。" })
                } else {
                    /* 修改数据库信息 */
                    db.query(`SELECT TABLE_NAME FROM information_schema. TABLES WHERE table_schema = '${promiseRes[0]}'`, (err, results) => {
                        if (results) {
                            const table = results
                            db.query(`CREATE DATABASE ${req.body['archive']};`)
                            if (table.length > 0) {
                                table.forEach(item => {
                                    db.query(`RENAME TABLE ${promiseRes[0]}.${item['TABLE_NAME']} TO ${req.body['archive']}.${item['TABLE_NAME']};`)
                                });
                            }
                            setTimeout(() => {
                                db.query(`DROP DATABASE ${promiseRes[0]};`, (err, results) => {
                                    if (results) res.send({ status: 200, message: "修改网站信息成功。" })
                                    if (err) res.send({ status: 500, message: "修改网站信息失败！" })
                                })
                            }, 200)
                        }
                        console.log(err);
                        if (err) res.send({ status: 500, message: '修改网站信息失败！' })
                    })
                }
            }
        }).catch(err => {
            res.send({ status: 500, message: err })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 删除网站信息 */
exports.removeSitowebInfo = (req, res) => {
    /* 查询数据库名称 */
    const get_database = new Promise((resolve, reject) => {
        setTimeout(() => {
            db.query(`SELECT * FROM learner.sitoweb WHERE id = ${req.query.id}`, (err, results) => {
                if (results.length) {
                    resolve(results[0]['archive'])
                } else {
                    reject("未查询到数据库信息！");
                }
            })
        }, 200)
    });
    /* 删除网站 */
    const controls_data = new Promise((resolve, reject) => {
        setTimeout(() => {
            db.query(`DELETE FROM learner.sitoweb WHERE id = ${req.query.id}`, (err, results) => {
                if (results) resolve()
                if (err) reject('删除网站信息失败！')
            })
        }, 400)
    })
    Promise.all([get_database, controls_data]).then((promiseRes) => {
        /* 删除数据库信息 */
        db.query(`DROP DATABASE ${promiseRes[0]}`, (err, results) => {
            if (results) res.send({ status: 200, message: "删除网站信息成功。" })
            if (err) res.send({ status: 500, message: "删除网站信息失败！" })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 获取网站树信息 */
exports.getSitowebTree = (req, res) => {
    const get_sitoweb_data = new Promise((resolve, reject) => {
        db.query(`SELECT id,name,archive FROM learner.sitoweb ORDER BY creatime ASC`, (err, results) => {
            if (results) {
                resolve(results)
            } else {
                reject("未查询到数据库信息！");
            }
        })
    })

    Promise.all([get_sitoweb_data]).then((promiseRes) => {
        let $_data = promiseRes[0]
        if (promiseRes[0].length) {
            $_data.forEach(item => {
                db.query(`SELECT * FROM learner.tabella WHERE sid = ${item.id} ORDER BY creatime ASC`, (err, results) => {
                    if (results) {
                        item.children = results.length === 0 ? [] : [...results]
                    }
                })
            })
        }
        setTimeout(() => {
            res.send({ status: 200, obj: $_data })
        }, 500)
    })
}