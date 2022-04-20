import {
  BufferReader,
  TileFileReader,
  b3dmHeaderLayout
} from './parser'
import {
  div,
  pre,
  input,
  label
} from './ui'

import './main.css'

const root = document.querySelector('#app')

const container = div(['flexbox', 'root-container', 'flex-col', 'silver-bg'])

// -- code block
const codeblock = div(['codeblock-container'])
const codearea = pre(['code', 'padding-1vw'])
codeblock.appendChild(codearea)
// -- end code block

// -- form
const form = div()
const tileLabel = label([], 'tile-file')
const tileInput = input([], 'file')
tileInput.setAttribute('accept', '.b3dm,.i3dm,.pnts,.cmpt,.glb')
tileInput.id = 'tile-file'
tileLabel.appendChild(tileInput)
form.appendChild(tileLabel)
// -- end form

container.appendChild(form)
container.appendChild(codeblock)

if (root) {
  root.appendChild(container)
}

const parse = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const reader = new BufferReader(buffer)
  const b3dmParser = new TileFileReader(reader, b3dmHeaderLayout)
  const head = b3dmParser.readHead()
  const headJson = JSON.stringify(head, null, 2)

  codearea.innerHTML = headJson
}

(tileInput as HTMLInputElement).onchange = () => {
  const file = (tileInput as HTMLInputElement).files?.item(0)
  if (!file) {
    return
  } 

  parse(file)
}
