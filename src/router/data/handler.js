/* 引入数据库连接 */
const db = require('../../db/db')
/* 获取数据列表 */
exports.getDataList = (req, res) => {
    /* 分页处理 */
    const page = (req.query['page'] - 1) * req.query['size']
    const size = req.query['size']
    /* 查询数据库名称 */
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
    /* 查询数据库表名称 */
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

    Promise.all([get_database, get_table]).then((promiseRes) => {
        /* 获取数据 */
        db.query(`SELECT COUNT(*) FROM ${promiseRes[0]}.${promiseRes[1]}`, (err, results) => {
            const $_count = results[0]['COUNT(*)']
            db.query(`SELECT * FROM ${promiseRes[0]}.${promiseRes[1]} ORDER BY creatime ASC LIMIT ${page},${size}`, (err, results) => {
                if (results) res.send({ status: 200, obj: { records: results, total: $_count, page: page + 1, size: +size } })
                if (err) res.send({ status: 500, message: "获取数据列表失败！" })
            })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 根据时间段搜索数据 */
exports.getSearchData = (req, res) => {
    /* 查询数据库名称 */
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
    /* 查询数据库表名称 */
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

    Promise.all([get_database, get_table]).then((promiseRes) => {
        /* 获取时间段数据 */
        db.query(`SELECT * FROM ${promiseRes[0]}.${promiseRes[1]} where creatime BETWEEN '${req.query.beginTime}' AND '${req.query.endTime}'`, (err, results) => {
            if (results) res.send({ status: 200, obj: { records: results } })
            if (err) res.send({ status: 500, message: "获取数据列表失败！" })
        })
    })
}
/* 获取关联数据信息 */
exports.getRelateData = (req, res) => {
    /* 查询数据库名称 */
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
    /* 查询数据库字段名称 */
    const get_field = new Promise((resolve, reject) => {
        db.query(`SELECT tid,archive FROM learner.campi WHERE id = ${req.query.cid}`, (err, results) => {
            if (results.length) {
                const $_table_id = results[0].tid
                const $_table_name = results[0].archive
                db.query(`SELECT * FROM learner.tabella WHERE id = ${$_table_id}`, (err, results) => {
                    setTimeout(() => {
                        if (results.length) {
                            resolve([$_table_name, results[0]['archive']])
                        } else {
                            reject("未查询到数据库信息！");
                        }
                    }, 400)
                })
            } else {
                reject("未查询到数据库信息！");
            }



        })
    });

    Promise.all([get_database, get_field]).then((promiseRes) => {
        console.log(promiseRes);
        db.query(`SELECT id, ${promiseRes[1][1]} AS value, creatime FROM ${promiseRes[0]}.${promiseRes[1][0]} ORDER BY creatime ASC`, (err, results) => {
            console.log(results);
            if (results) res.send({ status: 200, obj: { records: results } })
            if (err) res.send({ status: 500, message: "获取关联数据信息失败！" })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 添加数据信息 */
exports.addDataInfo = (req, res) => {
    /* 数据整合 */
    const $_data = req.body
    $_data['id'] = new Date().getTime()
    $_data['creatime'] = new Date()

    /* 查询数据库名称 */
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
    /* 查询数据库表名称 */
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

    Promise.all([get_database, get_table]).then((promiseRes) => {
        /* 数据添加 */
        db.query(`INSERT INTO ${promiseRes[0]}.${promiseRes[1]} SET ?`, $_data, (err, results) => {
            console.log(err);
            if (results) res.send({ status: 200, message: "添加数据成功。" })
            if (err) res.send({ status: 500, message: "添加数据失败！" })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })

}
/* 获取数据信息 */
exports.getDataInfo = (req, res) => {
    /* 查询数据库名称 */
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
    /* 查询数据库表名称 */
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

    Promise.all([get_database, get_table]).then((promiseRes) => {
        /* 获取数据详细信息 */
        db.query(`SELECT * FROM ${promiseRes[0]}.${promiseRes[1]}  WHERE id = ${req.query.id}`, (err, results) => {
            if (results) res.send({ status: 200, obj: results[0] })
            if (err) res.send({ status: 500, message: "获取数据信息失败！" })
        })
    })
}

/* 修改数据信息 */
exports.editDataInfo = (req, res) => {
     /* 数据整合 */
     const $_data = req.body
    /* 查询数据库名称 */
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
    /* 查询数据库表名称 */
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

    Promise.all([get_database, get_table]).then((promiseRes) => {
        delete $_data.creatime
        /* 修改数据信息 */
        db.query(`UPDATE ${promiseRes[0]}.${promiseRes[1]} SET ? WHERE id = ${req.query.id}`, $_data, (err, results) => {
            if (results) res.send({ status: 200, message: "修改数据信息成功。" })
            if (err) res.send({ status: 500, message: "修改数据信息失败！" })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 删除数据信息 */
exports.removeDataInfo = (req, res) => {
    /* 查询数据库名称 */
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
    /* 查询数据库表名称 */
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

    Promise.all([get_database, get_table]).then((promiseRes) => {
        db.query(`DELETE FROM ${promiseRes[0]}.${promiseRes[1]} WHERE id = ${req.query.id}`, (err, results) => {
            if (results) res.send({ status: 200, message: "删除数据信息成功。" })
            if (err) res.send({ status: 500, message: "删除数据信息失败！" })
        })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}