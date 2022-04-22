import { CommonHead, TileFileLayout } from '../types'
import { BufferReader } from './buffer-reader'
import { getTileHeadLayout } from './layout'

const stringMatcher = /(\d+)c/
const intMatcher = /(i|u)(8|16|32)/
const floatMatcher = /(f)(32|64)/

export class TileFileReader {
  private _reader: BufferReader
  private _layout: TileFileLayout
  constructor(reader: BufferReader, layout: TileFileLayout) {
    this._layout = layout
    this._reader = reader
  }

  get bufferReader() {
    return this._reader
  }
  set bufferReader(value) {
    this._reader = value
  }

  get layout() {
    return this._layout
  }
  set layout(value) {
    this._layout = value
  }

  readHead() {
    const pairs = Object.entries(this._layout)
    const resultPairs: [string, string | number][] = []
    for (const [key, pattern] of pairs) {
      resultPairs.push([
        key,
        this.selectReadFunctionAndRead(pattern)
      ])
    }
    return Object.fromEntries(resultPairs)
  }

  selectReadFunctionAndRead(layout: string) {
    if (stringMatcher.test(layout)) {
      const matchResult = layout.match(stringMatcher)
      if (matchResult) {
        const count = +matchResult[1]
        return this._reader.readChars(count)
      } else {
        return ''
      }
    } else if (intMatcher.test(layout)) {
      const matchResult = layout.match(intMatcher)
      if (matchResult) {
        const type = matchResult[1]
        const bit = +matchResult[2]
        if (type === 'u') {
          if (bit === 8)
            return this._reader.readUint8()
          else if (bit === 16)
            return this._reader.readUint16()
          else if (bit === 32)
            return this._reader.readUint32()
          else
            return 0
        } else {
          if (bit === 8)
            return this._reader.readInt8()
          else if (bit === 16)
            return this._reader.readInt16()
          else if (bit === 32)
            return this._reader.readInt32()
          else
            return 0
        }
      } else {
        return 0
      }
    } else if (floatMatcher.test(layout)) {
      const matchResult = layout.match(floatMatcher)
      if (matchResult) {
        const bit = +matchResult[2]
        if (bit === 32)
          return this._reader.readFloat32()
        else if (bit === 64)
          return this._reader.readFloat64()
        else
          return 0
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  readBatchTable(head: CommonHead) {
    return readTable(this._reader, head, 'batchTable')
  }

  readFeatureTable(head: CommonHead) {
    return readTable(this._reader, head)
  }

  getGlbView(head: CommonHead) {
    if (!['b3dm', 'i3dm'].includes(head.magic)) {
      return null
    }

    const {
      byteLength,
      featureTableJSONByteLength,
      featureTableBinaryByteLength,
      batchTableJSONByteLength,
      batchTableBinaryByteLength
    } = head
    let glbStartOffset = 28 + featureTableJSONByteLength
      + featureTableBinaryByteLength
      + batchTableJSONByteLength
      + batchTableBinaryByteLength
    if (head.magic === 'i3dm') {
      glbStartOffset += 4
    }
    const glbViewLength = byteLength - glbStartOffset
    this._reader.reset(glbStartOffset)
    return this._reader.readBytes(glbViewLength)
  }
}

const readTable = (bufferReader: BufferReader, head: CommonHead, type = 'featureTable') => {
  if (!['b3dm', 'i3dm', 'pnts'].includes(head.magic)) {
    return null
  }

  const {
    featureTableJSONByteLength,
    featureTableBinaryByteLength,
    batchTableJSONByteLength,
    batchTableBinaryByteLength
  } = head
  const jsonByteLength = type === 'featureTable' ? featureTableJSONByteLength : batchTableJSONByteLength
  const binaryByteLength = type === 'featureTable' ? featureTableBinaryByteLength : batchTableBinaryByteLength

  let startOffset = 28
  if (type !== 'featureTable') {
    startOffset += featureTableJSONByteLength + featureTableBinaryByteLength
  }
  bufferReader.reset(startOffset)

  // BatchTable 的 JSON 长若为 0，那么意味着没有 BatchTable，直接跳过
  if (type !== 'featureTable' && batchTableJSONByteLength === 0) {
    return {
      table: null,
      tableBinary: null
    }
  }

  const tableJSONStr = bufferReader.readChars(jsonByteLength)
  const tableBinary = bufferReader.readBytes(binaryByteLength)
  return {
    table: JSON.parse(tableJSONStr),
    tableBinary
  }
}

export const createReader = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const bufferReader = new BufferReader(buffer)
  const { layout } = getTileHeadLayout(file.name)
  return new TileFileReader(bufferReader, layout)
}
