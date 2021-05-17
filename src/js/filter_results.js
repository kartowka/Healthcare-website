function filter_results(filter_order) {
	var input, filter, table, tr, td, i, txtValue
	input = document.getElementById('filter')
	filter = input.value.toUpperCase()
	table = document.getElementById('dataTable')
	tr = table.getElementsByTagName('tr')
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName('td')[filter_order]
		if (td) {
			txtValue = td.textContent || td.innerText
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = ''
			} else {
				tr[i].style.display = 'none'
			}
		}
	}
}
