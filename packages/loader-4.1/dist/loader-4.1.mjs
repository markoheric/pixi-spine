/*!
 * @pixi-spine/loader-4.1 - v4.0.3
 * Compiled Mon, 31 Jul 2023 22:48:59 UTC
 *
 * @pixi-spine/loader-4.1 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2023, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */import{SpineLoaderAbstract as n}from"@pixi-spine/loader-base";import{SkeletonBinary as s,SkeletonJson as o,AtlasAttachmentLoader as l}from"@pixi-spine/runtime-4.1";class i extends n{createBinaryParser(){return new s(null)}createJsonParser(){return new o(null)}parseData(r,e,t){const a=r;return a.attachmentLoader=new l(e),{spineData:a.readSkeletonData(t),spineAtlas:e}}}new i().installLoader();
//# sourceMappingURL=loader-4.1.mjs.map
