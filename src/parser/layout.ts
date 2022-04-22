export enum TileFormat {
  b3dm = 0,
  i3dm = 1,
  pnts = 2,
  cmpt = 3,
  gltf = 4
}

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

export const getTileHeadLayout = (filename: string): {
  type: TileFormat,
  layout: { [key: string]: string }
} => {
  if (filename.endsWith('b3dm')) {
    return {
      type: TileFormat.b3dm,
      layout: b3dmHeaderLayout
    }
  } else if (filename.endsWith('i3dm')) {
    return {
      type: TileFormat.i3dm,
      layout: i3dmHeaderLayout
    }
  } else if (filename.endsWith('pnts')) {
    return {
      type: TileFormat.pnts,
      layout: pntsHeaderLayout
    }
  } else if (filename.endsWith('cmpt')) {
    return {
      type: TileFormat.cmpt,
      layout: cmptHeaderLayout
    }
  } else {
    return {
      type: TileFormat.gltf,
      layout: glbHeaderLayout
    }
  }
}