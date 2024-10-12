/* 引入上传中间件 */
const multer = require('multer')
/* 引入路径管理模块 */
const path = require("path");
/* 生成随机文件名称 */
const randomFileName = () => {
    const letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'n'].sort(() => { return Math.random() - 0.5 })
    const figure = new Date().getTime().toString().split("")
    let fileName = [].concat(figure)
    for (let i = 0; i < figure.length; i++) {
        fileName.splice(2 * i, 0, letterArray[i])
    }
    return fileName.join("")
}
/* 上传资源 */
exports.upload = async (req, res) => {
    const uploadInit = multer({
        storage: multer.diskStorage({
            destination(req, res, cb) {
                cb(null, '../../uploads')
            },
            filename(req, file, cb) {
                cb(null, randomFileName() + path.extname(file.originalname))
            }
        }),
        fileFilter: (req, file, cb) => {
            cb(null, true)
        },
    }).single('resource')
    uploadInit(req, res, (err) => {
        res.send({ status: 200, message: "上传成功", path: '/uploads/' + req.file.filename })
    })
}