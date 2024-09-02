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
// FUNCTIONALITY
const newWindowButton = document.createElement("button"), newCode = document.createElement("button"), pieces = [
	{
		opcode: "messageBox",
		type: 1,
		text: "msg. box with title <A> text <B> options <C> icon <D>",
		displayAs: "show a message box",
		isHidden: false,
		arguments: {
			A: {
				type: "string",
				defaultValue: "Greeting"
			},
			B: {
				type: "string",
				defaultValue: "Hello, world!"
			},
			C: {
				type: "dropdown",
				defaultValue: "Yes/No",
				items: {
					"Yes/No": "YesNo",
					"OK": "OK",
					"OK/Cancel": "OKCancel",
					"Yes/No/Cancel": "YesNoCancel"
				}
			},
			D: {
				type: "dropdown",
				defaultValue: "Information",
				items: {
					"Warning": "Warn",
					"Information": "Info",
					"Error": "Error",
					"Question": "Request"
				}
			}
		}
	}
]
category1.appendChild(newWindowButton)
category2.appendChild(newCode)
newWindowButton.textContent = "New Window Display"
newCode.textContent = "Add New Code Piece"
let currentCode = []
newCode.onclick = function() {
	newCode.disabled = true
	const sel = document.createElement("select")
	category2.appendChild(sel)
	for (const block of pieces) {
		if (!block.isHidden) {
			const option = document.createElement("option")
			option.value = block.opcode
			option.textContent = block.displayAs
			sel.appendChild(option)
		}
	}
	sel.oninput = function() {
		const blockToMimic = pieces.find(i => i.opcode == sel.value)
		const block = document.createElement("div")
		currentCode.push(
			{
				opcode: blockToMimic.opcode,
				arguments: {}
			}
		)
		const indexToEdit = currentCode.length - 1
		const matches = blockToMimic.text.replace(/[\w\s]+|<([\w\s]+)>/gi, function(match, multiple) {
			let input
			if (multiple) {
				let inp
				switch (blockToMimic.arguments[multiple].type) {
					case "string":
						inp = document.createElement("input")
						block.appendChild(inp)
						input = inp
						break
					case "multistring":
						inp = document.createElement("textarea")
						block.appendChild(inp)
						input = inp
						break
					case "number":
						inp = document.createElement("input")
						inp.type = "number"
						block.appendChild(inp)
						input = inp
						break
					case "color":
						inp = document.createElement("input")
						inp.type = "color"
						block.appendChild(inp)
						input = inp
						break
					case "dropdown":
						inp = document.createElement("select")
						const keys = Object.keys(blockToMimic.arguments[multiple].items)
						for (const option of keys) {
							const op = document.createElement("option")
							op.textContent = option
							op.value = blockToMimic.arguments[multiple].items[option]
							inp.appendChild(op)
						}
						block.appendChild(inp)
						input = inp
						break
					default:
						inp = document.createElement("div")
						inp.style = "background-color: AAAAAA; border-radius: 6px; display: inline"
						block.appendChild(inp)
						input = {value: null}
				}
			} else {
				const text = document.createElement("span")
				text.textContent = match
				block.appendChild(text)
				input = null
			}
			if (input !== null) {
				currentCode[indexToEdit].arguments[multiple] = input.value
				input.addEventListener("input", () => {
					currentCode[indexToEdit].arguments[multiple] = input.value
				})
			}
		})
		sel.remove()
		newCode.disabled = false
	}
}
