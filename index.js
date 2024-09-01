// UI
const button1 = document.getElementById("windowDisplayCategory"), button2 = document.getElementById("programCategory"), category1 = document.getElementById("windowDisplay"), category2 = document.getElementById("program")
category2.style.display = "none"
button1.disabled = true
button1.onclick = function() {
	category1.style.display = "block"
	category2.style.display = "none"
	button1.disabled = true
	button2.disabled = false
}
button2.onclick = function() {
	category2.style.display = "block"
	category1.style.display = "none"
	button2.disabled = true
	button1.disabled = false
}
