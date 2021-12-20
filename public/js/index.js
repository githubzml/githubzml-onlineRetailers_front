$(function () {
  // 当前页码
  let currentPage = 1;
  // 总页码
  let totalPage = 0;

  // 获取用户信息前 必须经过 token验证
  getUserInfo();

  let count = 5; //每次查询几条数据
  let offset = 0; //偏移量
  getTypeData();

  let utils = new Utils();

  // 编辑和添加商品标记
  let isEdit = false; //添加

  let typeId = "";

  // 跳转商品列表页面
  $("#product-list").on("click", function () {
    location.href = "/product";
  })


  function getUserInfo() {
    // 获取token

    let token = sessionStorage.getItem("_tk");

    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }


    $.ajax({
      type: "POST",
      url: "http://localhost:10000/userInfo",
      data: {
        token
      },
      success: function (result) {
        if (result.code == 400) {
          $("#user-img").attr("src", result.result[0].url);
          $("#nickname").text(result.result[0].nickname)
        }
      }
    })
  }

  // 添加/编辑商品类型
  $("#save").on("click", function () {

    let typeName = $("#typename").val();

    if (!typeName.trim()) {
      console.log('值不能为空');
      return;
    }

    let token = sessionStorage.getItem("_tk");

    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }
    //编辑商品类型
    if (isEdit) {
      $.ajax({
        type: "POST",
        url: "http://localhost:10000/editType",
        data: {
          typeName,
          typeId,
          token
        },
        success: function (res) {
          if (res.code == 700) {

            $('#' + typeId).find('.t-name').text(typeName);

            let date = utils.formatDate(new Date());

            $('#' + typeId).find('.update-time').text(date);

            $('#type').modal('hide')
          }

        }
      })


    } else {
      $.ajax({
        type: "POST",
        url: "http://localhost:10000/addType",
        data: {
          typeName,
          token
        },
        success: function (result) {
          if (result.code == 200) {
            $('#type').modal('hide');
            $("#typename").val("");
            location.reload();
          }
        }
      })
    }

  })

  // 获取商品类型数据
  function getTypeData() {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    //请求参数
    let data = {
      token,
      count,
      offset
    }

    // 获取搜索类型名称
    let typeName = $("#ipt_val").val();

    if (typeName.trim() != "") {
      data.typeName = typeName;
    }

    $.ajax({
      type: "GET",
      url: "http://localhost:10000/findType",
      data,
      success: function (res) {
        let { code, result } = res;

        if (code == 600) {
          $("#_tbody").empty();
          result.forEach((element, i) => {
            element.created_at = utils.formatDate(element.created_at)
            element.updated_at = utils.formatDate(element.updated_at)

            let tr = `<tr id="${element.type_id}">
          <td class="num">${i + 1}</td>
          <td class="t-name">${element.type_name}</td>
          <td class="status">${element.status == 1 ? "启用" : "禁用"}</td>
          <td>${element.created_at}</td>
          <td class='update-time'>${element.updated_at}</td>
          <td>
            <button type="button" class="btn btn-info btn-sm edit">编辑</button>
            <button type="button" class="disable-btn btn btn-warning btn-sm ${element.status == 1 ? '' : 'hide'}">禁用</button>
            <button type="button" class="enable-btn btn btn-secondary btn-sm ${element.status == 0 ? '' : 'hide'}">启用</button>
            <button type="button" class="btn btn-danger btn-sm remove">删除</button>
          </td>
        </tr>`

            $("#_tbody").append(tr);
          });

          // current-page
          if (result.length) {
            $("#current-page").text(currentPage);
          }
        }

        console.log('result==>', result);
      }
    })
  }

  // 搜索商品类型数据
  $("#btn_search").on("click", function () {
    getTypeData();
  })

  // 编辑商品类型数据 可以为未来的事件绑定
  $("tbody").on("click", '.edit', function () {
    // 弹出模态框
    $("#type").modal("show");
    $("#staticBackdropLabel").text("编辑商品类型");

    // 获取商品类型名称
    let typeName = $(this).parents('tr').find('.t-name').text();
    $('#typename').val(typeName);

    isEdit = true;

    // 获取商品类型ID
    typeId = $(this).parents("tr").attr("id");

  })
  // 禁用商品类型
  $("tbody").on("click", '.disable-btn', function () {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }


    //获取父元素
    let tr = $(this).parents('tr');

    let typeId = tr.attr("id");


    $.ajax({
      type: "POST",
      url: "http://localhost:10000/disableType",
      data: {
        typeId,
        token
      },
      success: res => {
        if (res.code == 800) {
          //隐藏当前按钮
          $(this).hide();

          //显示启用按钮
          tr.find('.enable-btn').show();

          //修改商品类型状态
          tr.find('.status').text('禁用');
        } else {
          console.log(res.msg);
        }
      }
    })
  })

  // 启用商品类型
  $("tbody").on("click", '.enable-btn', function () {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    //获取父元素
    let tr = $(this).parents('tr');

    let typeId = tr.attr("id");

    $.ajax({
      type: "POST",
      url: "http://localhost:10000/enableType",
      data: {
        typeId,
        token
      },
      success: res => {
        if (res.code == 900) {
          //隐藏当前按钮
          $(this).hide();
          //显示启用按钮
          tr.find('.disable-btn').show();
          //修改商品类型状态
          tr.find('.status').text('启用');
        } else {
          console.log(res.msg);
        }
      }
    })



  })
  // 删除
  $("tbody").on("click", '.remove', function () {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    //获取父元素
    let tr = $(this).parents('tr');

    let typeId = tr.attr("id");

    $.ajax({
      type: "POST",
      url: "http://localhost:10000/removeType",
      data: {
        typeId,
        token
      },
      success: res => {
        console.log('res=>', res);
        if (res.code == 1000) {

          location.reload();


        } else {
          console.log('defeat');
        }
      }
    })
  })
  getTypecount();
  // 获取商品类型总数量
  function getTypecount() {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    //获取父元素
    let tr = $(this).parents('tr');


    $.ajax({
      type: "GET",
      url: "http://localhost:10000/count",
      data: {
        token
      },
      success: res => {
        if (res.code == 1010) {
          totalPage = Math.ceil(res.result / count);
          $("#total-page").text(totalPage);
        } else {
          console.log(res.msg);
        }
      }
    })


  }

  $("#prev,#next").on("click", function () {
    let id = $(this).attr('id');



    if (id == "next") {
      if (currentPage == totalPage) {
        console.log('已是最后一页');
        return;
      }
      offset += count;
      currentPage++;
    } else {
      if (currentPage == 1) {
        console.log('已是第一页');
        return;
      }
      offset -= count;
      currentPage--;
    }

    getTypeData();

    console.log('offset', offset);

  })

})