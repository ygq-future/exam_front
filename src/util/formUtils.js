import { Message } from "element-ui";
import question from "@/api/question";

const questionParams = {
  disabled: false,
  description: "",
};
const qeustionOption = {
  maxOption: 7,
};

export const createIndex = (option, index) => {
  option.itemId = String.fromCharCode(index + 65);
  return option.itemId;
};

//需要的参数列表,一个定时器,题目ID,一个选项,一个回调函数
const saveOptionChange = (timer, questionId, option, update) => {
  //如果disable为false表示编辑状态,点击的时候应该是保存(因为要再取反一次)
  if (!option.disabled) {
    //暂时缓存数据,并作为input无文字时状态
    option.placeholder = option.description;
  }
  if (option.disabled) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      //如果输入的值是空值,或者值是undefined将强制将输入框改为编辑状态必须保存才能提交
      if (option.description === "" || !option.description) {
        Message.warning("保存失败,选项不能为空!");
        option.description = option.placeholder;
        option.disabled = false;
        return;
      }
      //如果内容没有修改,那么就直接不会发送请求
      if (option.description === option.placeholder) {
        return;
      }
      //判断是否有questionId,如果咩有则表示这是在添加题目,不需要发送请求
      if (!questionId) {
        return;
      }
      //通过id判断选项是否是已经存在于数据库的如果没有id则表示是新加的
      if (option.id) {
        //修改选项
        await question.editQuestion(option.id, {
          description: option.description,
        });
      } else {
        //新增选项
        await question.addQuestion({
          questionId: questionId,
          description: option.description,
          itemId: option.itemId,
        });
      }
      update();
    }, 200);
  }
};

const addOption = (timer, selects) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (selects.length < qeustionOption.maxOption) {
      selects.push({ ...questionParams });
    } else {
      Message.warning("已经添加到最大选项了!");
    }
  }, 200);
};

export default {
  createIndex,
  saveOptionChange,
  addOption,
};
