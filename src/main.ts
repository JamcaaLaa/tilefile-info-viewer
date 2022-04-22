import {
  createReader
} from './parser'
import {
  div,
  pre,
  input,
  label
} from './ui'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

import './main.css'
import { CommonHead } from './types'

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
  const reader = await createReader(file)
  const head = reader.readHead()
  const headJson = JSON.stringify(head, null, 2)
  const ft = reader.readFeatureTable(head as CommonHead)
  const bt = reader.readBatchTable(head as CommonHead)

  const glbView = reader.getGlbView(head as CommonHead)

  saveFile({
    fileName: `${file.name}.zip`,
    featureTableOption: {
      featureTable: ft?.table,
      featureTableBinary: ft?.tableBinary?.buffer
    },
    batchTableOption: {
      batchTable: bt?.table,
      batchTableBinary: bt?.tableBinary?.buffer
    },
    glbOption: glbView?.buffer
  })

  codearea.innerHTML = headJson
}

const saveFile = async (options: {
  fileName: string,
  featureTableOption?: {
    featureTable: object | null,
    featureTableBinary?: ArrayBuffer
  },
  batchTableOption?: {
    batchTable?: object,
    batchTableBinary?: ArrayBuffer
  },
  glbOption?: ArrayBuffer
}) => {
  const zip = new JSZip()
  const name = options.fileName
  const ft = options.featureTableOption
  const bt = options.batchTableOption
  const glb = options.glbOption
  if (ft) {
    zip.file('featureTable.json', JSON.stringify(ft.featureTable))
    if (ft.featureTableBinary) {
      zip.file('featureTableBinary.bin', ft.featureTableBinary, {
        binary: true
      })
    }
  }
  if (bt) {
    if (bt.batchTable) {
      zip.file('batchTable.json', JSON.stringify(bt.batchTable))
    }
    if (bt.batchTableBinary) {
      zip.file('batchTableBinary.bin', bt.batchTableBinary, {
        binary: true
      })
    }
  }
  if (glb) {
    zip.file('model.glb', glb, {
      binary: true
    })
  }

  const zipFile = await zip.generateAsync({
    type: 'blob'
  })
  FileSaver.saveAs(zipFile, `${name}.zip`)
}

(tileInput as HTMLInputElement).onchange = () => {
  const file = (tileInput as HTMLInputElement).files?.item(0)
  if (!file) {
    return
  }

  parse(file)
}
