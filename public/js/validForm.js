// 表单验证模块

class ValidForm {
  constructor() {

    //邮箱正则表达式
    this.emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    //昵称 1-10个字符, 字母数字下划线汉字组合
    this.nicknameReg = /^[\w\u4e00-\u9fa5]{1,10}$/;

    //密码 6-16字符，数字字母下滑线组合且首字符为字母
    this.passwordReg = /^[A-Za-z]\w{5,15}$/;

    //验证码 6数字
    this.codeReg = /^\d{6}$/;

  }
  isEmail(value) {
    return this.emailReg.test(value);
  }

  isNickname(value) {
    return this.nicknameReg.test(value);
  }

  isPassword(value) {
    return this.passwordReg.test(value);
  }

  isCode(value) {
    return this.codeReg.test(value);
  }
}