$(function () {
  // 页面加载完成之后 就会触发这个函数

  // 表达验证实例

  let validForm = new ValidForm();


  function valid(fnName) {
    let value = $(this).val();
    if (!validForm[fnName](value)) {
      $(this).next().show().attr("name", 1);
      return;
    } else {
      $(this).next().hide().remove("name");
    }
  }


  // 重新获取
  let time = 5;

  $("#getCode").on("click", function () {

    let email = $("#email").val();
    // 验证邮箱格式是否正确
    if (!validForm.isEmail(email)) {
      $("#email").next().show().attr("name", 1);
      return;
    }


    $(this).text(time + "s之后重新发送").prop("disabled", true)
    let timer = setInterval(() => {
      if (time == 0) {
        clearInterval(timer);
        $(this).text("获取邮箱验证码").prop("disabled", false);
        time = 5
      } else {
        time--;
        $(this).text(time + "s之后重新发送")
      }
    }, 1000)


    $.ajax({
      type: "POST",
      data: {
        email,
      },
      url: "http://localhost:10000/code",
      success: function (result) {
        console.log('result', result);
      }
    })
  })

  // 验证邮箱
  $("#email").on("change", function () {
    valid.call(this, "isEmail")
  })

  // 昵称验证
  $("#nickname").on("change", function () {
    valid.call(this, "isNickname")
  })

  // 密码
  $("#password").on("change", function () {
    valid.call(this, "isPassword")
  })

  //验证码
  $("#code").on("change", function () {
    valid.call(this, "isCode")
  })


  $("#register").on("click", function () {
    // 是否为空
    let isEmpty = false;
    // 检查表单是否填写完整
    $(".form-control").each(function () {
      let val = $(this).val();
      if (val == "") {
        isEmpty = true;
        $(this).next().show().attr("name", 1);
        // alert("请完善表达内容");
        return false; //表单不再提交
      }
    })

    console.log('isEmpty', isEmpty);

    if (isEmpty) {
      return;
    }

    // 验证表单 有无错误提示显示
    let isHasError = $(".error-msg[name='1']").length > 0;
    console.log('isHasError', isHasError);


    if (!isHasError) {
      console.log('111');

      // 获取表单信息
      let userInfo = {};

      $(".form-control").each(function () {
        let id = $(this).attr("id");
        userInfo[id] = $(this).val();
      })

      $.ajax({
        type: "POST",
        url: "http://localhost:10000/register",
        data: userInfo,
        success: function (result) {
          if (result.code == 100) {
            console.log('register1==>', result);
            location.href = "/login";
          }
          console.log('register2==>', result);
        }
      })
    }

  })

  // 跳转到登录页面
  $("#login").on("click", function () {
    location.href = "/login";
  })

})
