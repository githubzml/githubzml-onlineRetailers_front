$(function () {
  $("#logout").on("click", function () {
    sessionStorage.removeItem("_tk");
    location.href = "/login";
  })

  // 上传头像
  $(".user-file").on("change", function () {
    // 获取上传文件的信息
    let file = $(this)[0].files[0];
    // 文件阅读对象
    let fileReader = new FileReader();
    // 监听是否读取完毕文件
    fileReader.onload = function () {
      // 获取图片base64 
      let base64 = this.result;
      // $(".auto1_img").attr("src", base64);


      // 获取token
      let token = sessionStorage.getItem("_tk");
      if (!token) {
        // 如果 token不存在 则跳转登录页面
        location.href = "/login";
        return;
      }
      $.ajax({
        type: "POST",
        url: "http://localhost:10000/userImg",
        data: {
          token,
          base64
        },
        success: function (result) {
          if (result.code == 1100) {
            $("#user-img").attr("src", result.url);
          }
        }
      })
    }
    if (file) {
      fileReader.readAsDataURL(file);
    }
  })
  // 修改昵称
  $("#commit-nickname").on("click", function () {
    let nickname = $("#new-nickname").val();

    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }
    $.ajax({
      type: "POST",
      url: "http://localhost:10000/nickname",
      data: {
        token,
        nickname
      },
      success: function (result) {
        if (result.code == 1200) {
          $("#nickname").text(nickname);
          $("#nickname-box").modal("hide");
          $("#new-nickname").val("");
        }
      }
    })

  })
  // 修改密码
  $("#commit-pwd").on("click", function () {
    let oldpwd = $("#old-password").val();
    let newpwd = $("#new-password").val();

    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }
    $.ajax({
      type: "POST",
      url: "http://localhost:10000/updatePwd",
      data: {
        token,
        oldpwd,
        newpwd
      },
      success: function (result) {
        if (result.code == 1104) {
          $("#nickname-box").modal("hide");
          location.href = "/login";
        }
        console.log('result', result);
      }
    })
  })
})