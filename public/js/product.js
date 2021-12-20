$(function () {
  // 是否添加商品
  let isNew = true;

  // 编辑商品时 备份商品数据 以便对比用户
  let copyProductData = {};


  let data = {};

  // 当前页码
  let currentPage = 1;
  // 总页码
  let totalPage = 0;

  // 获取用户信息前 必须经过 token验证
  getUserInfo();

  let count = 2; //每次查询几条数据
  let offset = 0; //偏移量

  let utils = new Utils();

  // 编辑和添加商品标记
  let isEdit = false; //添加

  let typeId = "";


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

  // 切换发布商品页面
  $("#pro-btn").on("click", function () {
    isNew = true;

    $('#pro_box').removeClass("hide");
    $("#pro_list").addClass("hide");




    //获取p-name标签
    $('.p-name').each(function () {
      if ($(this).data('name') == 'typeId') {
        $(this).val('default');
      } else {
        $(this).val('');
      }


      //禁用
      $(this).prop('disabled', false);

    })


    //设置商品上下架
    $('#exampleRadios1,#exampleRadios2').prop('disabled', false);
    $('#exampleRadios1').prop('checked', true);


    $('.other').addClass('hide');
    // 清楚预览图
    $('.auto1_img').attr('src', '');
    $('.auto2_img').attr('src', '');


    //隐藏确认发布按钮
    $('.send-box').removeClass('hide');

  })

  $("#fb").on("click", function () {
    $('#pro_box').addClass("hide");
    $("#pro_list").removeClass("hide");
  })

  getTypeAll();
  // 获取商品类型
  function getTypeAll() {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }
    $.ajax({
      type: "GET",
      url: "http://localhost:10000/typeAll",
      data: {
        token
      },
      success: function (result) {
        if (result.code == 600) {
          result.result.forEach(element => {
            let option = $(`<option value="${element.typeId}">${element.typeName}</option>`);
            $(".type-box").append(option);
          });
        }
      }
    })
  }

  // 上传商品图片
  $("#file-pro").on("change", function () {
    // 获取上传文件的信息
    let file = $(this)[0].files[0];
    // 文件阅读对象
    let fileReader = new FileReader();
    // 监听是否读取完毕文件
    fileReader.onload = function () {
      // 获取图片base64 
      let base64 = this.result;
      $(".auto1_img").attr("src", base64);
      data.pimg = base64;
    }
    if (file) {
      fileReader.readAsDataURL(file);
    }
  })
  // 上传详情图片
  $("#file-detail").on("change", function () {
    // 获取上传文件的信息
    let file = $(this)[0].files[0];
    // 文件阅读对象
    let fileReader = new FileReader();
    // 监听是否读取完毕文件
    fileReader.onload = function () {
      // 获取图片base64 
      let base64 = this.result;
      $(".auto2_img").attr("src", base64);
      data.pdimg = base64;
    }
    if (file) {
      fileReader.readAsDataURL(file);
    }
  })

  // 确定发布
  $(".send-box").on("click", function () {

    let pname = $(".p-name");
    pname.each(function (e) {
      let value = $(this).val();
      let dataName = $(this).data("name");
      data[dataName] = value;
    })

    // 获取商品状态
    data.status = $(".form-check-input:checked").val();

    // 获取token
    let token = sessionStorage.getItem("_tk");

    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }
    data.token = token;


    // 备份一份 传递修改的那一部分
    if (isNew) {
      $.ajax({
        type: "POST",
        url: "http://localhost:10000/addProduct",
        data,
        success: function (result) {
          console.log('result', result);
          // if (result.code == 600) {
          //   result.result.forEach(element => {
          //     let option = $(`<option value="${element.typeId}">${element.typeName}</option>`);
          //     $("#type-box").append(option);
          //   });
          // }
        }
      })
    } else {
      // pid
      let pdata = {
        pid: copyProductData.pid
      }; //编辑商品
      // console.log('data=>', data);
      // console.log('copyProductData=>', copyProductData);

      for (let key in data) {
        if (data[key] != copyProductData[key]) {
          pdata[key] = data[key];
        }
      }


      $.ajax({
        type: "POST",
        url: "http://localhost:10000/editProduct",
        data: pdata,
        success: function (result) {
          console.log('result=>', result);
          if (result.code == 1080) {
            location.reload();
          } else {
            //调试一下
          }
        }
      })
    }
  })
  // 跳转商品类型
  $("#p_type").on("click", function () {
    location.href = '/index';
  })
  // 页面初始化
  searchProduct();
  // 搜索商品
  function searchProduct() {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    // 获取搜索得条件
    let searchItems = $(".search-item");
    let searchCondition = { token, offset, count };
    searchItems.each(function () {
      let value = $(this).val();
      let dataTitle = $(this).data("title");
      searchCondition[dataTitle] = value == "default" ? "" : value;
    })

    $.ajax({
      type: "GET",
      url: "http://localhost:10000/searchProduct",
      data: searchCondition,
      success: function (result) {
        if (result.code == 1400) {
          $("#_tbody").empty();

          result.result.forEach((v, i) => {

            v.updatedAt = utils.formatDate(v.updatedAt).split(" ")[0];

            let tr = `
          <tr id='${v.pid}'>
           <td class="num">${i + 1}</td>
           <td class="t-name">${v.pname}</td>
           <td >${v.typeName}</td>
           <td class="status">${v.status == 1 ? "上架" : "下架"}</td>
           <td class='update-time'>${v.updatedAt}</td>
           <td>
             <button type="button" class="btn btn-success btn-sm view">查看</button>
             <button type="button" class="btn btn-info btn-sm edit">编辑</button>
             <button type="button" class="disable-btn btn btn-warning btn-sm btn-status ${v.status == 1 ? '' : 'hide'}" data-status='0'>下架</button>
             <button type="button" class="enable-btn btn btn-secondary btn-sm btn-status ${v.status == 0 ? '' : 'hide'}" data-status='1'>上架</button>
             <button type="button" class="btn btn-danger btn-sm remove">删除</button>
           </td>
          </tr>`

            $("#_tbody").append(tr);
          })

          console.log('currentPage1');

          if (result.result.length) {
            console.log('currentPage2', currentPage);

            $("#current-page").text(currentPage);
          }
        }
      }
    })
  }
  // 搜索
  $("#btn_search").on("click", function () {
    offset = 0;
    currentPage = 1;
    getProduct();
    searchProduct();
  })

  // 上架或者下架
  $("#_tbody").on("click", ".btn-status", function () {
    let status = $(this).data("status");

    //获取商品pid
    let $tr = $(this).parents('tr');
    let pid = $tr.attr('id');

    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    $.ajax({
      type: "POST",
      url: "http://localhost:10000/proStatus",
      data: {
        token,
        status,
        pid
      },
      success: function (result) {

        if (result.code == 1500) {
          if (result.result[0] == 1) {
            $tr.find('.status').text(status == 1 ? '上架' : '下架');

            if (status == 1) {
              $tr.find('.disable-btn').removeClass('hide');
              $tr.find('.enable-btn').addClass('hide');
            } else {
              $tr.find('.disable-btn').addClass('hide');
              $tr.find('.enable-btn').removeClass('hide');
            }

          }
        } else {
          //调试一下
        }
      }
    })

  })

  $("#_tbody").on("click", ".remove", function () {
    //获取商品pid
    let $tr = $(this).parents('tr');
    let pid = $tr.attr('id');

    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }
    $.ajax({
      type: "POST",
      url: "http://localhost:10000/removePro",
      data: {
        token,
        pid
      },
      success: function (result) {
        if (result.code == 1600) {
          location.reload();
        }
      }
    })
  })
  // 查看
  $("#_tbody").on("click", ".view", function () {
    //获取商品pid
    let $tr = $(this).parents('tr');
    let pid = $tr.attr('id');

    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    $.ajax({
      type: "GET",
      url: "http://localhost:10000/viewProduct",
      data: {
        token,
        pid
      },
      success: function (result) {
        if (result.code == 1700) {
          $('#pro_box').removeClass("hide");
          $("#pro_list").addClass("hide");



          //隐藏确认发布按钮
          $('.send-box').addClass('hide');

          //获取p-name标签
          $('.p-name').each(function () {

            //获取当前标签的data-name
            let dataName = $(this).data('name');
            console.log('dataName ==> ', dataName);

            $(this).val(result.result[0][dataName]);

            //禁用
            $(this).prop('disabled', true);

          })

          // 6 36

          //设置商品图片
          $('.auto1_img').attr('src', result.result[0].pimg);
          $('.auto2_img').attr('src', result.result[0].pdimg);
          $('.other').removeClass('hide');

          //设置商品上下架
          $('[value="' + Number(result.result[0].status) + '"]').prop('checked', true);
          $('#exampleRadios1,#exampleRadios2').prop('disabled', true);
        } else {
          console.log('调试');
        }
      }
    })
  })

  // 编辑
  $("#_tbody").on("click", ".edit", function () {
    isNew = false;
    //获取商品pid
    let $tr = $(this).parents('tr');
    let pid = $tr.attr('id');
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }
    $.ajax({
      type: "GET",
      url: "http://localhost:10000/viewProduct",
      data: {
        token,
        pid
      },
      success: function (result) {
        if (result.code == 1700) {
          $('#pro_box').removeClass("hide");
          $("#pro_list").addClass("hide");

          copyProductData = {
            pid: result.result[0].pid,
            pname: result.result[0].pname,
            typeId: result.result[0].typeId,
            price: result.result[0].price,
            count: result.result[0].count,
            pimg: result.result[0].pimg,
            pdimg: result.result[0].pdimg,
            status: Number(result.result[0].status),
            desc: result.result[0].desc
          }

          //获取p-name标签
          $('.p-name').each(function () {
            //获取当前标签的data-name
            let dataName = $(this).data('name');
            $(this).val(result.result[0][dataName]);
          })

          //设置商品图片
          $('.auto1_img').attr('src', result.result[0].pimg);
          $('.auto2_img').attr('src', result.result[0].pdimg);

          //设置商品上下架
          $('[value="' + Number(result.result[0].status) + '"]').prop('checked', true);


        }
      }
    })
  })
  getProduct();
  //获取商品数目
  function getProduct() {
    // 获取token
    let token = sessionStorage.getItem("_tk");
    if (!token) {
      // 如果 token不存在 则跳转登录页面
      location.href = "/login";
      return;
    }

    // 获取搜索的筛选条件
    let searchItems = $(".search-item");
    let searchCondition = {
      token
    };
    searchItems.each(function () {
      let value = $(this).val();
      if (value != "" && value != "default") {
        let dataTitle = $(this).data("title");
        searchCondition[dataTitle] = value;
      }
    })

    $.ajax({
      type: "GET",
      url: "http://localhost:10000/proCount",
      data: searchCondition,
      success: function (result) {
        if (result.code == 1090) {
          totalPage = Math.ceil(result.result / count);
          console.log('totalPage', totalPage);

          $("#total-page").text(totalPage);
        }

        console.log('result', result);

      }
    })
  }
  // 分页
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

    searchProduct();

  })

})