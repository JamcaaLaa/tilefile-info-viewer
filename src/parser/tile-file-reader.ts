import { BufferReader } from './buffer-reader'

export const b3dmHeaderLayout = Object.freeze({
  magic: '4c',
  version: 'u32',
  byteLength: 'u32',
  featureTableJSONByteLength: 'u32',
  featureTableBinaryByteLength: 'u32',
  batchTableJSONByteLength: 'u32',
  batchTableBinaryByteLength: 'u32',
})

export const i3dmHeaderLayout = Object.freeze({
  magic: '4c',
  version: 'u32',
  byteLength: 'u32',
  featureTableJSONByteLength: 'u32',
  featureTableBinaryByteLength: 'u32',
  batchTableJSONByteLength: 'u32',
  batchTableBinaryByteLength: 'u32',
  gltfFormat: 'u32',
})

export const pntsHeaderLayout = Object.freeze({
  magic: '4c',
  version: 'u32',
  byteLength: 'u32',
  featureTableJSONByteLength: 'u32',
  featureTableBinaryByteLength: 'u32',
  batchTableJSONByteLength: 'u32',
  batchTableBinaryByteLength: 'u32',
})

export const cmptHeaderLayout = Object.freeze({
  magic: '4c',
  version: 'u32',
  byteLength: 'u32',
})

export const glbHeaderLayout = Object.freeze({
  magic: '4c',
  version: 'u32',
  byteLength: 'u32',
  tilesLength: 'u32'
})

const stringMatcher = /(\d+)c/
const intMatcher = /(i|u)(8|16|32)/
const floatMatcher = /(f)(32|64)/

export type TileFileLayout = { [key: string]: string }

export class TileFileReader {
  private _reader: BufferReader
  private _layout: TileFileLayout
  constructor(reader: BufferReader, layout: TileFileLayout) {
    this._layout = layout
    this._reader = reader
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
}

