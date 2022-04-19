import {
  BufferReader,
  TileFileReader,
  b3dmHeaderLayout
} from './parser'

const root = document.querySelector('#app')
const readData = async () => {
  const buffer = await fetch('/osgb.b3dm').then(r => r.arrayBuffer())

  const reader = new BufferReader(buffer)
  const b3dmParser = new TileFileReader(reader, b3dmHeaderLayout)
  const head = b3dmParser.readHead()
  const headJson = JSON.stringify(head, null, 2)

  if (root) { 
    root.innerHTML = `<pre>
${headJson}
</pre>` 
  }
}

readData()
