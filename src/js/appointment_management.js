let enabel_day = document.getElementById('working_days').textContent.split(',')
let start_time = document.getElementById('start_time').textContent.split(':')
let end_time = document.getElementById('end_time').textContent.split(':')
let dic = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
}
let day_of_week = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
]
let hours = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
	22, 23,
]
let hoursEnable = hours.filter(
	(value) => start_time[0] <= value && value <= end_time[0]
)
let disablehour = hours.filter((n) => !hoursEnable.includes(n))
day_of_week = day_of_week.filter((n) => !enabel_day.includes(n))
day_of_week = day_of_week.map((n) => dic[n])
let date = new Date()
let currentMonth = date.getMonth()
let currentDate = date.getDate()
let currentYear = date.getFullYear()
$('.form_datetime').datetimepicker({
	format: 'yyyy-mm-ddThh:ii',
	daysOfWeekDisabled: day_of_week,
	hoursDisabled: disablehour,
	startDate: new Date(currentYear, currentMonth, currentDate),
})
