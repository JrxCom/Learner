/* 引入数据库连接 */
const db = require('../../db/db')
/* 引入验证码生成模块 */
const svgCaptcha = require('svg-captcha')
/* 获取验证码 */
exports.getCode = (req, res) => {
    const img = svgCaptcha.createMathExpr({
        noise: 6,
        color: true,
        background: "#808b96",
        fontSize: 60
    })
    res.cookie("code", img.text, { maxAge: 300 * 1000 })
    res.type("svg")
    res.send(img.data)
}
/* 登录 */
exports.login = (req, res) => {
    /* 判断账号密码正确 */
    const is_user = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM learner.user WHERE userid = '${req.body.userid}' AND password = '${req.body.password}'`, (err, results) => {
            if (results.length > 0) {
                resolve()
            } else {
                reject('账号或密码输入错误，请重新输入！');
            }
        })
    });
    /* 判断验证码正确 */
    const is_code = new Promise((resolve, reject) => {
        if (req.cookies.code === req.body.code) {
            resolve()
        } else {
            reject('验证码输入错误！');
        }
    });
    Promise.all([is_user, is_code]).then(() => {
        res.cookie("code", undefined, { maxAge: 1 * 1000 })
        res.cookie("cookieCode", new Date().toUTCString(), { maxAge: 1800*1000 })
        res.send({ status: 200, message: '登录成功。' })
    }).catch(err => {
        res.send({ status: 500, message: err })
    })
}
/* 判断是否为登录状态 */
exports.logis = (req,res)=>{
    if (req.cookies.cookieCode === undefined){
        return res.send({ status: 403, message: "登录失效，请重新登录！" })
    }else{
        return res.send({ status: 200, message: "用户登录状态。" })
    }
}
/* 退出 */
exports.logout = (req, res) => {
    res.cookie("cookieCode", undefined, { maxAge: 1 * 1000 })
    res.send({ status: 200, message: '退出成功。' })
}