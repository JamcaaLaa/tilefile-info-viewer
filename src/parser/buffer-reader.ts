export type BufferReaderOption = {
  littleEndian?: boolean
}

export class BufferReader {
  private _buffer: ArrayBuffer
  private _view: DataView
  private _currentOffset: number = 0
  private _littleEndian: boolean

  constructor(buffer: ArrayBuffer, options: BufferReaderOption = {}) {
    this._littleEndian = options.littleEndian === undefined ? true : options.littleEndian
    this._buffer = buffer
    this._view = new DataView(buffer)
  }

  get currentOffset() {
    return this._currentOffset
  }

  get canGet() {
    return this._currentOffset <= this._buffer.byteLength
  }

  validate() {
    if (this.canGet) {
      return
    }
    throw new Error('索引越界, 请重新读取数据')
  }

  reset(offset: number = 0) {
    this._currentOffset = offset
  }

  reInit(buffer: ArrayBuffer) {
    this._buffer = buffer
    this._view = new DataView(buffer)
    this._currentOffset = 0
  }

  readByte() {
    const byte = this._view.getUint8(this._currentOffset)
    this._currentOffset++
    return byte
  }

  readBytes(byteCount: number) {
    if (this.currentOffset + byteCount > this._buffer.byteLength) {
      return new Uint8Array([])
    }
    const arr = new Uint8Array(byteCount)
    for (let i = 0; i < byteCount; i++) {
      arr[i] = this.readByte()
    }
    return arr
  }

  readChar() {
    const code = this.readByte()
    return String.fromCharCode(code)
  }

  readChars(count: number) {
    if (this.currentOffset + count > this._buffer.byteLength) {
      return ''
    }
    const chars = []
    for (let i = 0; i < count; i++) {
      chars.push(this.readChar())
    }
    return chars.join('')
  }

  readUint8() {
    return this.readByte()
  }

  readUint16() {
    const num = this._view.getUint16(
      this._currentOffset,
      this._littleEndian
    )
    this._currentOffset += 2
    return num
  }

  readUint32() {
    const num = this._view.getUint32(
      this._currentOffset,
      this._littleEndian
    ) // 使用小端序读
    this._currentOffset += 4
    return num
  }

  readFloat32() {
    const num = this._view.getFloat32(
      this._currentOffset,
      this._littleEndian
    )
    this._currentOffset += 4
    return num
  }

  readFloat64() {
    const num = this._view.getFloat64(
      this._currentOffset,
      this._littleEndian
    )
    this._currentOffset += 8
    return num
  }

  readInt8() {
    const num = this._view.getInt8(this._currentOffset)
    this._currentOffset++
    return num
  }

  readInt16() {
    const num = this._view.getInt16(
      this._currentOffset,
      this._littleEndian
    )
    this._currentOffset += 2
    return num
  }

  readInt32() {
    const num = this._view.getInt32(
      this._currentOffset,
      this._littleEndian
    )
    this._currentOffset += 4
    return num
  }
}

