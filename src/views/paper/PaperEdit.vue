<template>
  <div class="content">
    <div class="left">
      <el-button icon="el-icon-back" class="back" type="info" @click="$router.back()">返回</el-button>

      <el-card class="info">
        <el-alert title="修改试卷信息" type="info" show-icon center :closable="false" />
        <el-form>
          <el-input v-model="form.name" placeholder="试卷名称"></el-input>
          <el-input v-model="form.subjectName" placeholder="专业名称"></el-input>
          <el-input v-model.number="form.duration" type="number" placeholder="考试时长"></el-input>
          <el-button type="primary" style="width: 100%" @click="updatePaper">确认</el-button>
        </el-form>
      </el-card>

      <el-card class="info">
        <el-alert title="添加试卷题目" type="info" show-icon center :closable="false" />
        <el-autocomplete
          clearable
          style="width: 100%; margin-bottom: 15px"
          v-model="selected"
          :fetch-suggestions="querySearch"
          placeholder="题目名称"
          :trigger-on-focus="false"
          @select="select"
        />

        <el-button style="width: 100%" type="primary" @click="relateQues">添加</el-button>
      </el-card>

      <el-card class="info">
        <el-alert title="批量导入题目" type="info" show-icon center :closable="false" />
        <el-button style="width: 100%" type="primary" @click="dialogVisible = true">点击导入</el-button>
      </el-card>
    </div>

    <el-divider direction="vertical"></el-divider>

    <div class="right">
      <paper-show :questions="paper.questions || {}" :height="'650px'" enableExam />
    </div>

    <el-dialog :close-on-click-modal="false" title="批量导入" center :visible.sync="dialogVisible" width="1000px">
      <div class="import-box">
        <div class="edit">
          <div class="toptip">
            <el-popover placement="top-end" title="温馨提示" width="200" trigger="click" :content="toptip">
              <el-button slot="reference" style="color: red" icon="el-icon-warning" type="text">注意事项</el-button>
            </el-popover>

            <el-popover placement="top-end" title="使用介绍" width="200" trigger="click" :content="presentation">
              <el-button slot="reference" style="color: #409eff" icon="el-icon-warning" type="text">使用介绍</el-button>
            </el-popover>

            <el-radio-group v-model="importMode" style="margin-bottom: 10px">
              <el-tooltip content="代表把这些题目追加到这张试卷当中" placement="top-start">
                <el-radio-button label="追加导入" />
              </el-tooltip>
              <el-tooltip content="代表把这张试卷中的题目替换为当前题目" placement="top-start">
                <el-radio-button label="全量导入" />
              </el-tooltip>
            </el-radio-group>
          </div>

          <el-input
            resize="none"
            :rows="20"
            type="textarea"
            placeholder="请输入内容"
            @input="analyze"
            v-model="content"
          />
        </div>

        <el-divider direction="vertical"></el-divider>

        <div class="preview">
          <paper-show :questions="parseQues || {}" :height="'450px'" />
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/paper'
import question from '@/api/question'
import PaperShow from '@/components/PaperShow'

export default {
  components: { PaperShow },
  data() {
    return {
      dialogVisible: false,
      //试卷id
      id: 0,
      //试卷对象
      paper: {},
      //修改试卷表单对象
      form: {
        name: '',
        subjectName: '',
        duration: 0
      },
      //已选择的题目名称(用于添加关联题目)
      selected: '',
      //题目类型,用于解析模板的时候要用来查询typeId
      quesTypes: [],
      //已选择的题目对象本身(用于添加关联题目)
      selectObj: null,
      //导入的类型
      importMode: '追加导入',
      //批量导入文本解析之后的对象
      parseQues: {},
      //用来判断是否为非法文本
      illegal: {
        msg: '错误的表达式, 请检查格式!',
        value: false
      },
      //提示
      toptip: `题目内容请不要出现这些特殊字符: '<>', '#', '@', '$',
      如遇见必须要出现这些字符的题目,请去题目管理中添加`,
      presentation: `'$'代表题目类型, '<>'代表题目, '@'代表选择题选项, '#'代表题目答案
      ,题目类型最后的数字代表本题型下每个题目的分数(必须紧接题目标题,中间不能有其他字符或空格),具体可看示例`,
      //批量导入示例字符
      content: `$单选题$2.5
<> 3*4=?
@A 45
@B 12
#B

$多选题$3
<> 你做错了什么?
@A 我呼吸错了
@B 我没错啊!
@C 我哪都错了
#A,C

$填空题$4
<> 振坤今年几岁?
#20

$判断题$2.5
<> 地球会毁灭吗?
#1

$简答题$10
<> 求2x+5=13方程的解?
#解:
由原式得: 2x=8
所以 x = 4`
    }
  },
  mounted() {
    this.id = Number(this.$route.query.id) || 0
    this.getById()
  },
  methods: {
    submit() {
      //如果有错误就不能进行添加
      if (this.illegal.value) {
        this.$message.error(this.illegal.msg)
        return
      }

      //填充提交数据
      let data = { examId: this.id, type: this.importMode === '追加导入' ? 1 : 0 }
      let questions = []
      //巧妙的深度拷贝对象, 因为对对象上的属性做了修改, 不拷贝对象会影响原来对象,导致二次提交没有answer的情况
      let tempParseQues = JSON.parse(JSON.stringify(this.parseQues))
      for (const key in tempParseQues) {
        let arr = tempParseQues[key]

        arr.forEach(item => {
          //后端字段是selectQuestions
          item.selectQuestions = item.selects

          //如果是选择题就重新把Id替换成itemId
          if (item.selects.length > 0) {
            let answerArr = []
            item.answer.split(',').forEach(id => {
              item.selects.forEach(select => {
                if (select.id == id) {
                  answerArr.push(select.itemId)
                }
              })
            })
            item.answer = answerArr.join(',')
          }
        })

        questions = questions.concat(arr)
      }
      data.questions = questions

      this.$confirm(`当前是${this.importMode}模式,确认导入吗?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          question.batchImport(data).then(res => {
            this.dialogVisible = false
            this.$notify({
              title: '温馨提示',
              message: res.message,
              type: 'success',
              duration: 0
            })
            this.getById()
          })
        })
        .catch(() => {})
    },
    analyze() {
      let str = this.content
      let index = -1

      let titleCount = 0
      let answerCount = 0
      //检查题目标志和答案是否一致
      while ((index = str.indexOf('<>')) >= 0) {
        titleCount += 1
        str = str.substring(index + 1)
      }
      str = this.content

      while ((index = str.indexOf('#')) >= 0) {
        answerCount += 1
        str = str.substring(index + 1)
      }

      if (titleCount !== answerCount) {
        return this.setIllegal('题目和答案数量不一致, 请检查!')
      }
      this.parse(this.content)
    },
    parse(str) {
      //设每次字符串都是合法的
      this.illegal.value = false
      //存储最后转换的结果
      let tempObj = {}
      //解析字符串中有哪些题型
      let types = []
      //临时变量, 用来存储正则匹配结果
      let match
      //匹配正则并获得题型
      const pattern = new RegExp('\\$(.*)\\$')
      while ((match = pattern.exec(str))) {
        let fullWord = match[0]
        let preciseWord = match[1]
        types.push(preciseWord)
        str = str.substring(match.index + fullWord.length)
      }

      //防止用户重复写了某一个类型的题目标题
      let uniqueTypes = Array.from(new Set(types))
      if (uniqueTypes.length !== types.length) {
        return this.setIllegal('请查看是否有重复的题目类型声明!')
      }

      //根据题型字符串进行正则匹配分隔,过滤前后空字符
      str = this.content
      let quesGrp = str
        .split(/\$.*\$/)
        .map(e => e.trim())
        .filter(e => e && e != '')

      //如果分隔之后的长度和题型长度不相等则为非法, 因为有一个题型下是没有题目的, 没有必要写上
      if (types.length !== quesGrp.length) {
        return this.setIllegal('请删除不必需要的题目类型, 因为类型下没有题目!')
      }

      //遍历每一组题型
      for (let i = 0; i < quesGrp.length; i++) {
        //用来存储当前题型中的所有题目对象
        let arr = []
        tempObj[types[i]] = arr

        let groupStr = quesGrp[i]

        //获取题型紧接着的第一个字符,如果不是数字,说明这个题型没有设置分数
        let numCh = groupStr[0]
        if (!numCh.match('[0-9]')) {
          return this.setIllegal('题目类型上必须要有分数声明!')
        }

        //匹配分数
        const scoreExp = new RegExp('([0-9]{1,}[.]?[0-9]*)')
        match = scoreExp.exec(groupStr)
        let score = Number(match[0])

        //清理分数和空字符
        groupStr = groupStr.replace(match[0], '').trim().replace('\n', '')

        //如果清理之后字符为空,或者没有包含题目标志, 就视为此题型下没有题目
        if (groupStr === '' || groupStr.indexOf('<>') < 0) {
          return this.setIllegal('请删除不必需要的题目类型, 因为类型下没有题目!')
        }

        //根据题目标志分隔为单个题目
        let quesArr = groupStr
          .split('<>')
          .map(e => e.trim())
          .filter(e => e && e != '')

        //遍历题目数组, 里面每一个字符串都是一个题目
        quesArr.forEach(ques => {
          //题目标题
          let title
          //抽取题目答案
          let answer = ques.substring(ques.indexOf('#') + 1).trim()
          //如果有选择题,则为选择题的选项
          let selects = []

          //获取当前题型
          let type = types[i]
          switch (type) {
            case '单选题':
            case '多选题':
              //如果选择题没有选择项就是错误的
              if (ques.indexOf('@') < 0) {
                return this.setIllegal('选择题必须有选项!')
              }
              //抽取题目标题
              title = ques.substring(0, ques.indexOf('@')).trim()
              //清除题目标题和答案, 因为已经抽取出去了
              ques = ques.replace(title, '').replace('#' + answer, '')
              //分割每个选项
              selects = ques
                .split('@')
                .map(item => item.trim())
                .filter(item => item && item != '')

              //虚拟id标识
              let idIterator = 1
              //用来判断此选择题下是否有重复选项
              let itemIdArr = []
              selects = selects.map(select => {
                if (this.containsIllegalChar(select)) {
                  return this.setIllegal('选项包含了非法字符!')
                }
                let itemId = select[0]
                itemIdArr.push(itemId)
                let description = select.substring(select.indexOf(itemId) + 1).trim()
                return { itemId: itemId.toUpperCase(), description, id: idIterator++ }
              })
              //查看选择项是否为空
              if (selects.length <= 0) {
                return this.setIllegal('选择项不能为空!')
              }
              //看是否有重复的元素,去重之后和原数组进行比较, 长度不同就有重复选择
              let uniqueArr = Array.from(new Set(itemIdArr))
              if (itemIdArr.length !== uniqueArr.length) {
                return this.setIllegal('选择题选项不能重复!')
              }

              //对答案进行处理,变成id
              let answerArr = answer
                .split(',')
                .map(e => e.trim())
                .filter(e => e && e !== '')
              //非法处理
              if (type === '单选题' && answerArr.length !== 1) {
                return this.setIllegal('单选题必须有且仅有一个答案!')
              }
              if (type === '多选题' && answerArr.length <= 1) {
                return this.setIllegal('多选题必须有多个答案!')
              }
              //根据itemId查找对应的虚拟id,方便渲染到页面上,请求后端时需要重新转化为itemId
              let ids = []
              answerArr.forEach(item => {
                //非法处理
                if (this.containsIllegalChar(item)) {
                  return this.setIllegal('答案包含了非法字符!')
                }
                selects.forEach(select => {
                  if (item.toUpperCase() == select.itemId.toUpperCase()) {
                    ids.push(select.id)
                  }
                })
              })
              answer = ids.join(',')
              break
            case '填空题':
            case '判断题':
            case '简答题':
              //获取题目标题
              title = ques.substring(0, ques.indexOf('#')).trim()
          }

          //经过上面的处理之后再次查看答案是否为空
          if (answer.trim() === '') {
            return this.setIllegal('答案不能为空或者答案和选择不匹配!')
          }

          //设置题目的类型和对应的类型Id
          let typeId
          this.quesTypes.forEach(e => {
            if (e.name === type) {
              return (typeId = e.id)
            }
          })
          //添加到数组中
          let obj = { title, answer, typeId, typeName: type, selects, score }

          //最后结果的校验
          if (obj.title.trim() === '') {
            return this.setIllegal('标题不能为空!')
          }

          if (this.containsIllegalChar(obj.title)) {
            return this.setIllegal('标题包含了非法字符!')
          }

          if (this.containsIllegalChar(obj.answer)) {
            return this.setIllegal('答案包含了非法字符!')
          }

          obj.selects.forEach(e => {
            if (e.itemId.trim() === '' || e.description.trim() === '') {
              return this.setIllegal('选项标题或描述不能为空!')
            }
          })

          arr.push(obj)
        })
      }

      //如果是合法的才修改
      if (!this.illegal.value) {
        this.parseQues = tempObj
      }
    },
    containsIllegalChar(str) {
      return str.indexOf('$') >= 0 || str.indexOf('<>') >= 0 || str.indexOf('@') >= 0 || str.indexOf('#') >= 0
    },
    setIllegal(msg) {
      this.illegal.value = true
      this.illegal.msg = msg
    },
    relateQues() {
      if (!this.selectObj) {
        this.$message.warning('请先选择要添加的题目')
        return
      }
      api.relateQues({ questionId: this.selectObj.id, examId: this.id }).then(res => {
        this.$message.success(res.message)
        this.selected = ''
        this.selectObj = null
        this.getById()
      })
    },
    select(item) {
      this.selectObj = item
    },
    querySearch(queryString, cb) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        question.getList({ current: 1, size: 100, keyword: queryString }).then(res => {
          let data = res.data.rows

          data.forEach(ques => {
            ques.value = ques.typeName + ' - ' + ques.title
          })

          let result = data.filter(e => e.value.indexOf(queryString) >= 0)
          cb(result)
        })
        // 调用 callback 返回建议列表的数据
      }, 400)
    },
    updatePaper() {
      api.editExam({ ...this.form, id: this.id }).then(res => {
        this.$message.success(res.message)
        this.getById()
      })
    },
    getById() {
      api.getById(this.id).then(res => {
        this.paper = res.data
        let { name, subjectName, duration } = this.paper
        this.form = { name, subjectName, duration }
      })
      question.getType().then(res => {
        this.quesTypes = res.data
        this.analyze()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.toptip {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

:deep(.el-dialog__body) {
  padding-top: 0;
}

.import-box {
  width: 100%;
  height: 450px;
  overflow: auto;
  display: flex;

  .edit {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .preview {
    flex: 1;
  }
}

.el-alert {
  padding: 5px;
  margin-bottom: 15px;
}

.el-divider--vertical {
  height: auto !important;
  margin-right: 15px;
}

.content {
  display: flex;

  .left {
    margin-right: 15px;
  }

  .right {
    flex: 1;
    display: flex;
    align-items: center;
  }
}

.back {
  margin-bottom: 15px;
}

.info {
  width: 250px;
  margin-bottom: 15px;

  .el-input {
    margin-bottom: 15px;
  }
}
</style>
