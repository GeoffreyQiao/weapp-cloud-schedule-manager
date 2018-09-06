module.exports = {
  APP_SECRET: "401a300d07af2e5a26db1e2ae69897de",
  APP_ID: "wx16f5b1fc81a5bc54",
  WX_BASE_URL: "https://api.weixin.qq.com/sns/jscode2session"
}

/* function dayNumInMonth(str) {
  let date = new Date(str)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  return dateMaker({ year, month })
}

function dateMaker({ year, month }) {
  const OneDay = 86400000
  let timeArr = []
  for (i = 1; i++; i < 3) {
    let tstamp = Date.parse(new Date(`${year}-${month}-01 00:00:00`))
    month++
    timeArr.push(tstamp)
  }
  console.log((timeArr[1] - timeArr[0]) / OneDay)
  return (new Date(tstamp--)).getDate()
} */