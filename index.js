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
				defaultValue: "Greeting",
				canAddBlocks: true
			},
			B: {
				type: "string",
				defaultValue: "Hello, world!",
				canAddBlocks: true
			},
			C: {
				type: "dropdown",
				defaultValue: "Yes/No",
				items: {
					"Yes/No": "YesNo",
					"OK": "OK",
					"OK/Cancel": "OKCancel",
					"Yes/No/Cancel": "YesNoCancel"
				},
				canAddBlocks: false
			},
			D: {
				type: "dropdown",
				defaultValue: "Information",
				items: {
					"Warning": "Warning",
					"Information": "Information",
					"Error": "Error",
					"Question": "Question"
				},
				canAddBlocks: false
			}
		}
	},
	{
		opcode: "messageBoxResult",
		type: 1,
		text: "store choice selected from (box with title <A> text <B> options <C> icon <D>) in <E>",
		displayAs: "store message choice result in variable",
		isHidden: false,
		arguments: {
			A: {
				type: "string",
				defaultValue: "Greeting",
				canAddBlocks: true
			},
			B: {
				type: "string",
				defaultValue: "Hello, world!",
				canAddBlocks: true
			},
			C: {
				type: "dropdown",
				defaultValue: "Yes/No",
				items: {
					"Yes/No": "YesNo",
					"OK": "OK",
					"OK/Cancel": "OKCancel",
					"Yes/No/Cancel": "YesNoCancel"
				},
				canAddBlocks: false
			},
			D: {
				type: "dropdown",
				defaultValue: "Information",
				items: {
					"Warning": "Warning",
					"Information": "Information",
					"Error": "Error",
					"Question": "Question"
				},
				canAddBlocks: false
			},
			E: {
				type: "string",
				defaultValue: "lastSelectedChoice",
				verifyFunction: function(val) {
					const defVals = ["true", "false", "PSScriptRoot", "null", "Error", "HOME", "PID", "args", "PSVersionTable", "PROFILE", "PSCommandPath", "PWD", "OFS", "LastExitCode", "Home", "ExecutionContext"]
					const value = defVals.includes(val) ? val + "2" : val
					return value.replace(/(^[^a-zA-Z_])|[^a-zA-Z0-9_]/g, "")
				},
				canAddBlocks: false
			}
		}
	},
	{
		opcode: "if0",
		type: 1,
		text: "if choice from message box (<A>) is <B>",
		displayAs: "if choice selected is",
		isHidden: false,
		arguments: {
			A: {
				type: "string",
				defaultValue: "lastSelectedChoice",
				verifyFunction: function(val) {
					const defVals = ["true", "false", "PSScriptRoot", "null", "Error", "HOME", "PID", "args", "PSVersionTable", "PROFILE", "PSCommandPath", "PWD", "OFS", "LastExitCode", "Home", "ExecutionContext"]
					const value = defVals.includes(val) ? val + "2" : val
					return value.replace(/(^[^a-zA-Z_])|[^a-zA-Z0-9_]/g, "")
				},
				canAddBlocks: false
			},
			B: {
				type: "dropdown",
				defaultValue: "OK",
				items: {
					OK: ' -eq "OK"',
					Selected: ' -ne $null',
					Yes: ' -eq "Yes"',
					No: ' -eq "No"'
				},
				canAddBlocks: true
			}
		}
	},
	{
		opcode: "end",
		type: 1,
		text: "end",
		displayAs: "end branch",
		isHidden: false
	}
]
category1.appendChild(newWindowButton)
category2.appendChild(newCode)
newWindowButton.textContent = "New Window Display"
newCode.textContent = "Add New Code Piece"
let currentCode = []
function addNewBlock() {
	newCode.disabled = true
	const sel = document.createElement("select")
	category2.appendChild(sel)
	const opuf = document.createElement("option")
	sel.appendChild(opuf)
	opuf.textContent = "[select a block]"
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
		const matches = blockToMimic.text.replace(/[\w\s\(\)]+|<([\w\s]+)>/gi, function(match, multiple) {
			let input
			if (multiple) {
				let inp
				switch (blockToMimic.arguments[multiple].type) {
					case "string":
						inp = document.createElement("input")
						block.appendChild(inp)
						if (blockToMimic.arguments[multiple].verifyFunction) {
							inp.addEventListener("input", () => {
								inp.value = blockToMimic.arguments[multiple].verifyFunction(inp.value)
							})
						}
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
					case "checkmark":
						inp = document.createElement("input")
						inp.type = "checkbox"
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
						inp.style = "background-color: AAAAAA; border-radius: 6px; display: inline; width: 40px; height: 10px"
						block.appendChild(inp)
						input = {value: null}
				}
				if (input.value !== null) {
					if (input.tagName.toLowerCase() !== "select") {
						input.value = blockToMimic.arguments[multiple].defaultValue
					}
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
		const removeBlock = document.createElement("button")
		block.appendChild(removeBlock)
		removeBlock.onclick = function() {
			currentCode.splice(indexToEdit, 1)
			block.remove()
		}
		removeBlock.textContent = "X"
		category2.appendChild(block)
	}
}
newCode.onclick = () => addNewBlock()
const assemblies = new Set([])
function requestAssembly(assembly) {
	assemblies.add("Add-Type -AssemblyName " + assembly)
}
function filterString(str) {
	return str.replace(/[\\"$]/g, "\\$&")
}
let vars = {}
let indentation = 0
const piecesBehavior = {
	messageBox: function(args) {
		requestAssembly("System.Windows.Forms")
		return `[System.Windows.Forms.MessageBox]::Show("${filterString(args.B)}", "${filterString(args.A)}", '${args.C}', '${args.D}')\n`
	},
	messageBoxResult: function(args) {
		requestAssembly("System.Windows.Forms")
		vars[args.E] = 0
		return `$${args.E} = [System.Windows.Forms.MessageBox]::Show("${filterString(args.B)}", "${filterString(args.A)}", '${args.C}', '${args.D}')\n`
	},
	"if0": function(args) {
		indentation += 2
		if (vars[args.A] !== 0) {
			alert("The variable you used must be assigned a value from the choice!")
			return `if ($false) {\n`
		}
		return `if ($${args.A}${args.B}) {\n`
	},
	end: function() {
		indentation -= 2
		return "}"
	}
}
function compile(code) {
	indentation = 0
	let result = ""
	for (const block of code) {
		result += " ".repeat(indentation) + piecesBehavior[block.opcode](block.arguments)
	}
	let assemb = "", assembli = Array.from(assemblies)
	for (const e of assembli) {
		assemb += e + "\n"
	}
	assemblies.clear()
	return assemb + result
}
const expor = document.createElement("button")
const currentCo = document.createElement("pre")
document.body.appendChild(expor)
document.body.appendChild(currentCo)
expor.textContent = "Export"
expor.onclick = function() {
	currentCo.textContent = compile(currentCode)
}
