
export type CommonHead = {
  magic: string
  version: number
  byteLength: number
  featureTableJSONByteLength: number
  featureTableBinaryByteLength: number
  batchTableJSONByteLength: number
  batchTableBinaryByteLength: number
}

export type B3dmHead = CommonHead

export type I3dmHead = B3dmHead & {
  gltfFormat: number
}

export type PntsHead = CommonHead

export type TileFileLayout = { [key: string]: string }
