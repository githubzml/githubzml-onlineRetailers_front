class Utils {
  // 格式化时间
  formatDate(value) {
    let date = new Date(value);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    let d = date.getDate();
    d = d >= 10 ? d : "0" + d;

    let hours = date.getHours();
    hours = hours >= 10 ? hours : "0" + hours;
    let mintues = date.getMinutes();
    mintues = mintues >= 10 ? mintues : "0" + mintues;
    let seconds = date.getSeconds();
    seconds = seconds >= 10 ? seconds : "0" + seconds;

    return `${year}-${month}-${d} ${hours}:${mintues}:${seconds}`
  }
}