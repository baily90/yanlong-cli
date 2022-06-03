
import inquirer from 'inquirer'

export default () => inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: '项目名称:',
    default: 'yanlong-project',
    validate(value){
      if(value.trim().length == 0){
        return '请输入项目名称'
      }
      return true
    },
    filter(value) {
      return value.trim()
    }
  },
  {
    type: 'list',
    name: 'framework',
    message: '选择框架:',
    default: 0,
    choices: [
        { value: 1, name: 'vue' },
        { value: 2, name: 'react' }
    ],
  },
  {
    type: 'list',
    name: 'package',
    message: '选择构建工具:',
    default: 2,
    choices: [
        { value: 1, name: 'npm' },
        { value: 2, name: 'yarn' },
        { value: 3, name: 'pnpm' }
    ],
  }
])