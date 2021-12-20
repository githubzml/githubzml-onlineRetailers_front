$(function () {
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


  // 验证邮箱
  $("#email").on("change", function () {
    valid.call(this, "isEmail")
  })

  // 密码
  $("#password").on("change", function () {
    valid.call(this, "isPassword")
  })
  // 登录
  $("#login").on("click", function () {
    //验证表单是否填写完整
    // 是否为空
    let isEmpty = false;
    $(".form-control").each(function () {
      let val = $(this).val();
      if (val == "") {
        isEmpty = true;
        $(this).next().show().attr("name", 1);
        // alert("请完善表达内容");
        return false; //表单不再提交
      }
    })
    if (isEmpty) {
      return;
    }
    // 验证表单 有无错误提示显示
    let isHasError = $(".error-msg[name='1']").length > 0;
    if (!isHasError) {
      // 获取表单信息
      let userInfo = {};
      $(".form-control").each(function () {
        let id = $(this).attr("id");
        userInfo[id] = $(this).val();
      })


      $.ajax({
        type: "POST",
        url: "http://localhost:10000/login",
        data: userInfo,
        success: function (result) {
          console.log('result', result);
          if (result.code == 300) {
            sessionStorage.setItem('_tk', result.token);

            location.href = "/index";
          }
        }
      })
    }
  })

  $("#register").on("click", function () {
    location.href = "/";
  })

  $("#forgot").on("click", function () {
    location.href = "/forgot";
  })
})