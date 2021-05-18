let enabel_day = document.getElementById('working_days').textContent.split(',')
let dic = {
   'Sunday': 0, 
   'Monday': 1,
   'Tuesday': 2, 
   'Wednesday': 3,
   'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
}
let day_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
day_of_week = day_of_week.filter(n => !enabel_day.includes(n))
day_of_week = day_of_week.map(n => dic[n])
$('.form_datetime').datetimepicker({
   format: 'dd/mm/yyyy hh:ii',
   daysOfWeekDisabled: day_of_week,
 
})
