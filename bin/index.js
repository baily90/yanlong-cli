#!/usr/bin/env node

import fs from 'fs'
import chalk from 'chalk'
import { execaCommand } from 'execa'
import createConfig from './config/index.js'
import generateProject from './generate/index.js'
const config = await createConfig()

// 创建文件夹
try {
  fs.mkdirSync(getRootPath())
  try {
    // 根据模板创建文件项目
    await generateProject() 
    console.log(chalk.green(`${config.projectName} 项目创建成功！`))

    try {
      // 安装依赖
      const installCommand = {
        1: 'npm i',
        2: 'yarn',
        3: 'pnpm i'
      }
      await execaCommand(installCommand[config.package], {
        cwd: getRootPath(),
        stdio: [2,2,2]
      });
      console.log(chalk.green(`依赖安装成功`))

      const runCommand = {
        1: 'npm run dev',
        2: 'yarn dev',
        3: 'pnpm run dev'
      }
      console.log(chalk.green(`cd ${config.projectName} && ${runCommand[config.package]}`))
    } catch (error) {
      console.log(chalk.red('依赖安装失败，进入项目手动安装'))
    }
  } catch (error) {
    console.log(error);
    console.log(chalk.red('项目初始化失败'))
  }
} catch (error) { 
  console.log(chalk.red(`检测到【${config.projectName}】项目已存在，请确认`))
}

export function getRootPath() {
  return `./${config.projectName}`
}

export function getConfig() {
  return config
}