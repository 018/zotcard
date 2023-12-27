let date = new Date(2023, 0, 1)
let startOfWeek = 0

var firstDay = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
// 第一周至少4天
let getDay = firstDay.getDay() || 7;
console.log({getDay});
switch (startOfWeek) {
	case 0: // 周日开始
	if (firstDay.getDay() <= 3) {
		firstDay.setDate(firstDay.getDate() - firstDay.getDay());
	} else {
		firstDay.setDate(firstDay.getDate() + (7 - getDay + 1));
	}
	console.log({firstDay});
	break;
	case 1: // 周一开始
	if (getDay <= 4) {
		firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - 1));
	} else {
		firstDay.setDate(firstDay.getDate() + (7 - firstDay.getDay() + 1));
	}
	console.log({firstDay});
	break;

	default:
	break;
}
dateGap = date.getTime() - firstDay.getTime();
console.log({dateGap});
console.log(Math.ceil(dateGap / (7 * 24 * 60 * 60 * 1000)));