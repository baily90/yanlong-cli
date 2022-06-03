import fs from 'fs'
import Handlebars from 'handlebars'
import { fileURLToPath } from 'url'
import path from 'path'
import { getConfig, getRootPath } from './../index.js'

let hbsFilesArray = []

/**
 * 编译hbs
 * @param {string} dirPath 
 * @param {string} file 
 * @returns 
 */
const transformFiles = (dirPath, file) => {
  const config = getConfig()
  const filePath = `${dirPath}/${file}`
  const fileTemplate = fs.readFileSync(filePath)
  const template = Handlebars.compile(fileTemplate.toString())
  return template(config)
}

/**
 * 筛选出所有hbs文件
 * @param {strimg} dirPath 
 */
const getHbsFiles = (dirPath) => {
  const files = fs.readdirSync(dirPath)
  files.forEach(file => {
    const filePath = `${dirPath}/${file}`
    let lstatRes = fs.lstatSync(filePath)
    if(lstatRes.isDirectory()){
      getHbsFiles(filePath)
    }else if(lstatRes.isFile() && filePath.endsWith('.hbs')){
      hbsFilesArray.push({dirPath, file})
    }
  })
}

/**
 * 文件夹复制
 * 兼容处理：判断node版本不是16.7.0以上的版本，因为16.7.0的版本支持了直接复制文件夹的操作
 * @param {string} source 源文件夹
 * @param {string} destination 目标文件夹
 */
function cpSync(source, destination) {
  /** 主要版本 */
  let major = process.version.match(/v([0-9]*).([0-9]*)/)[1]
  /** 特性版本 */
  let minor = process.version.match(/v([0-9]*).([0-9]*)/)[2]
  
  if (Number(major) < 16 || Number(major) == 16 && Number(minor) < 7) {
      let files = fs.readdirSync(source)
      files.forEach(file => {
        let sourceFullName = source + "/" + file;
        let destFullName = destination + "/" + file;
        let lstatRes = fs.lstatSync(sourceFullName)
        if (lstatRes.isFile()) {
          fs.copyFileSync(sourceFullName, destFullName);
        }
        if (lstatRes.isDirectory()) {
          fs.mkdirSync(destFullName)
          cpSync(sourceFullName, destFullName);
        }
      })
  }else {
    fs.cpSync(source, destination, { force: true, recursive: true })
  }
}

/**
 * 将xxx.hbs文件后缀删掉，拿到真实文件名
 * @param {string} file 
 * @returns 
 */
const formatFileName = (file) => {
  return file.replace('.hbs', '')
}

/**
 * 生成项目
 */
const generateProject = async () => {
  hbsFilesArray = []
  const { framework } = getConfig()
  const __dirname = fileURLToPath(import.meta.url)
  const templatePath = path.resolve(__dirname, `./../../template/${framework === 1 ? 'vue' : 'react'}`)

  // 复制模板
  cpSync(templatePath, getRootPath())

  // 找出hbs
  getHbsFiles(getRootPath())

  // 渲染并替换hbs文件
  hbsFilesArray.forEach(hbs => {
    const { dirPath, file } = hbs
    const code = transformFiles(dirPath, file)
    const fileName = formatFileName(file)
    fs.rmSync(`${dirPath}/${file}`)
    fs.writeFileSync(`${dirPath}/${fileName}`, code)
  })
}

export default generateProject