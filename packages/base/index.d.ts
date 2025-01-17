/// <reference path="./global.d.ts" />

import type { BaseTexture } from '@pixi/core';
import type { BLEND_MODES } from '@pixi/core';
import { Container } from '@pixi/display';
import { DisplayObject } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import type { Matrix } from '@pixi/core';
import { Rectangle } from '@pixi/core';
import { SimpleMesh } from '@pixi/mesh-extras';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';

/**
 * @public
 */
declare interface ArrayLike_2<T> {
    length: number;
    [n: number]: T;
}
export { ArrayLike_2 as ArrayLike }

/**
 * @public
 */
export declare enum AttachmentType {
    Region = 0,
    BoundingBox = 1,
    Mesh = 2,
    LinkedMesh = 3,
    Path = 4,
    Point = 5,
    Clipping = 6
}

/**
 * @public
 */
export declare class BinaryInput {
    strings: string[];
    private index;
    private buffer;
    constructor(data: Uint8Array, strings?: string[], index?: number, buffer?: DataView);
    readByte(): number;
    readUnsignedByte(): number;
    readShort(): number;
    readInt32(): number;
    readInt(optimizePositive: boolean): number;
    readStringRef(): string | null;
    readString(): string | null;
    readFloat(): number;
    readBoolean(): boolean;
}

/**
 * @public
 */
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    static WHITE: Color;
    static RED: Color;
    static GREEN: Color;
    static BLUE: Color;
    static MAGENTA: Color;
    constructor(r?: number, g?: number, b?: number, a?: number);
    set(r: number, g: number, b: number, a: number): this;
    setFromColor(c: Color): this;
    setFromString(hex: string): this;
    add(r: number, g: number, b: number, a: number): this;
    clamp(): this;
    static rgba8888ToColor(color: Color, value: number): void;
    static rgb888ToColor(color: Color, value: number): void;
    static fromString(hex: string): Color;
}

/**
 * @public
 */
export declare class DebugUtils {
    static logBones(skeleton: ISkeleton): void;
}

/**
 * @public
 */
export declare interface Disposable {
    dispose(): void;
}

/**
 * @public
 */
export declare function filterFromString(text: string): TextureFilter;

/**
 * @public
 */
export declare interface IAnimation<Timeline extends ITimeline = ITimeline> {
    name: string;
    timelines: Timeline[];
    duration: number;
}

/**
 * @public
 */
export declare interface IAnimationState<AnimationStateData extends IAnimationStateData = IAnimationStateData> {
    data: AnimationStateData;
    tracks: ITrackEntry[];
    listeners: IAnimationStateListener[];
    timeScale: number;
    update(dt: number): void;
    apply(skeleton: ISkeleton): boolean;
    setAnimation(trackIndex: number, animationName: string, loop: boolean): ITrackEntry;
    addAnimation(trackIndex: number, animationName: string, loop: boolean, delay: number): ITrackEntry;
    addEmptyAnimation(trackIndex: number, mixDuration: number, delay: number): ITrackEntry;
    setEmptyAnimation(trackIndex: number, mixDuration: number): ITrackEntry;
    setEmptyAnimations(mixDuration: number): void;
    hasAnimation(animationName: string): boolean;
    addListener(listener: IAnimationStateListener): void;
    removeListener(listener: IAnimationStateListener): void;
    clearListeners(): void;
    clearTracks(): void;
    clearTrack(index: number): void;
}

/**
 * @public
 */
export declare interface IAnimationStateData<SkeletonData extends ISkeletonData = ISkeletonData, Animation extends IAnimation = IAnimation> {
    skeletonData: SkeletonData;
    animationToMixTime: Map_2<number>;
    defaultMix: number;
    setMix(fromName: string, toName: string, duration: number): void;
    setMixWith(from: Animation, to: Animation, duration: number): void;
    getMix(from: Animation, to: Animation): number;
}

/**
 * @public
 */
export declare interface IAnimationStateListener {
    start?(entry: ITrackEntry): void;
    interrupt?(entry: ITrackEntry): void;
    end?(entry: ITrackEntry): void;
    dispose?(entry: ITrackEntry): void;
    complete?(entry: ITrackEntry): void;
    event?(entry: ITrackEntry, event: IEvent): void;
}

/**
 * @public
 */
export declare interface IAttachment {
    name: string;
    type: AttachmentType;
    readonly sequence?: ISequence;
}

/**
 * @public
 */
export declare interface IBone {
    data: IBoneData;
    matrix: Matrix;
    active: boolean;
}

/**
 * @public
 */
export declare interface IBoneData {
    index: number;
    name: string;
    parent: IBoneData;
    length: number;
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    shearX: number;
    shearY: number;
    transformMode: TransformMode;
}

/**
 * @public
 */
export declare interface IClippingAttachment extends IVertexAttachment {
    endSlot?: ISlotData;
}

/**
 * @public
 */
export declare interface IConstraintData {
    name: string;
    order: number;
}

/**
 * @public
 */
export declare interface IEvent {
    time: number;
    data: IEventData;
}

/**
 * @public
 */
export declare interface IEventData {
    name: string;
}

/**
 * @public
 */
export declare interface IHasTextureRegion {
    /** The name used to find the {@link #region()}. */
    path: string;
    /** The region used to draw the attachment. After setting the region or if the region's properties are changed,
     * {@link #updateRegion()} must be called. */
    region: TextureRegion | null;
    /** Updates any values the attachment calculates using the {@link #getRegion()}. Must be called after setting the
     * {@link #getRegion()} or if the region's properties are changed. */
    /** The color to tint the attachment. */
    color: Color;
    readonly sequence: ISequence | null;
}

/**
 * @public
 */
export declare interface IIkConstraint {
    data: IIkConstraintData;
    /** -1 | 0 | 1 */
    bendDirection: number;
    compress: boolean;
    stretch: boolean;
    /** A percentage (0-1) */
    mix: number;
}

/**
 * @public
 */
export declare interface IIkConstraintData extends IConstraintData {
    /** -1 | 0 | 1 */
    bendDirection: number;
    compress: boolean;
    stretch: boolean;
    uniform: boolean;
    /** A percentage (0-1) */
    mix: number;
}

/**
 * @public
 */
export declare interface IMeshAttachment extends IVertexAttachment {
    region: TextureRegion;
    color: Color;
    regionUVs: Float32Array;
    triangles: number[];
    hullLength: number;
}

/**
 * @public
 */
export declare abstract class Interpolation {
    protected abstract applyInternal(a: number): number;
    apply(start: number, end: number, a: number): number;
}

/**
 * @public
 */
export declare class IntSet {
    array: number[];
    add(value: number): boolean;
    contains(value: number): boolean;
    remove(value: number): void;
    clear(): void;
}

/**
 * @public
 */
export declare interface IPathConstraint {
    data: IPathConstraintData;
    position: number;
    spacing: number;
    spaces: number[];
    positions: number[];
    world: number[];
    curves: number[];
    lengths: number[];
    segments: number[];
}

/**
 * @public
 */
export declare interface IPathConstraintData extends IConstraintData {
    positionMode: PositionMode;
    rotateMode: RotateMode;
    offsetRotation: number;
    position: number;
    spacing: number;
}

/**
 * @public
 */
export declare interface IRegionAttachment extends IAttachment {
    region: TextureRegion;
    color: Color;
    x: any;
    y: any;
    scaleX: any;
    scaleY: any;
    rotation: any;
    width: any;
    height: number;
}

/**
 * @public
 */
export declare interface ISequence {
    id: number;
    regions: TextureRegion[];
    apply(slot: ISlot, attachment: IHasTextureRegion): void;
}

/**
 * @public
 */
export declare interface ISkeleton<SkeletonData extends ISkeletonData = ISkeletonData, Bone extends IBone = IBone, Slot extends ISlot = ISlot, Skin extends ISkin = ISkin> {
    bones: Bone[];
    slots: Slot[];
    drawOrder: Slot[];
    skin: Skin;
    data: SkeletonData;
    x: number;
    y: number;
    updateWorldTransform(): void;
    setToSetupPose(): void;
    findSlotIndex(slotName: string): number;
    getAttachmentByName(slotName: string, attachmentName: string): IAttachment;
    setBonesToSetupPose(): void;
    setSlotsToSetupPose(): void;
    findBone(boneName: string): Bone;
    findSlot(slotName: string): Slot;
    findBoneIndex(boneName: string): number;
    findSlotIndex(slotName: string): number;
    setSkinByName(skinName: string): void;
    setAttachment(slotName: string, attachmentName: string): void;
    getBounds(offset: Vector2, size: Vector2, temp: Array<number>): void;
}

/**
 * @public
 */
export declare interface ISkeletonData<BoneData extends IBoneData = IBoneData, SlotData extends ISlotData = ISlotData, Skin extends ISkin = ISkin, Animation extends IAnimation = IAnimation, EventData extends IEventData = IEventData, IkConstraintData extends IIkConstraintData = IIkConstraintData, TransformConstraintData extends ITransformConstraintData = ITransformConstraintData, PathConstraintData extends IPathConstraintData = IPathConstraintData> {
    name: string;
    bones: BoneData[];
    slots: SlotData[];
    skins: Skin[];
    defaultSkin: Skin;
    events: EventData[];
    animations: Animation[];
    version: string;
    hash: string;
    width: number;
    height: number;
    ikConstraints: IkConstraintData[];
    transformConstraints: TransformConstraintData[];
    pathConstraints: PathConstraintData[];
    findBone(boneName: string): BoneData | null;
    findBoneIndex(boneName: string): number;
    findSlot(slotName: string): SlotData | null;
    findSlotIndex(slotName: string): number;
    findSkin(skinName: string): Skin | null;
    findEvent(eventDataName: string): EventData | null;
    findAnimation(animationName: string): Animation | null;
    findIkConstraint(constraintName: string): IkConstraintData | null;
    findTransformConstraint(constraintName: string): TransformConstraintData | null;
    findPathConstraint(constraintName: string): PathConstraintData | null;
}

/**
 * @public
 */
export declare interface ISkeletonParser {
    scale: number;
}

/**
 * @public
 */
export declare interface ISkin {
    name: string;
    attachments: Array<Map_2<IAttachment>>;
    getAttachment(slotIndex: number, name: string): IAttachment | null;
}

/**
 * @public
 */
export declare interface ISlot {
    getAttachment(): IAttachment;
    data: ISlotData;
    color: Color;
    darkColor: Color;
    blendMode: number;
    bone: IBone;
    sprites?: any;
    currentSprite?: any;
    currentSpriteName?: string;
    meshes?: any;
    currentMesh?: any;
    currentMeshName?: string;
    currentMeshId?: number;
    currentGraphics?: any;
    clippingContainer?: any;
    hackRegion?: TextureRegion;
    hackAttachment?: IAttachment;
}

/**
 * @public
 */
export declare interface ISlotData {
    index: number;
    name: string;
    boneData: IBoneData;
    color: Color;
    darkColor: Color;
    attachmentName: string;
    blendMode: BLEND_MODES;
}

/**
 * Make a class that extends from this interface to create your own debug renderer.
 * @public
 */
export declare interface ISpineDebugRenderer {
    /**
     * This will be called every frame, after the spine has been updated.
     */
    renderDebug(spine: SpineBase<ISkeleton, ISkeletonData, IAnimationState, IAnimationStateData>): void;
    /**
     *  This is called when the `spine.debug` object is set to null or when the spine is destroyed.
     */
    unregisterSpine(spine: SpineBase<ISkeleton, ISkeletonData, IAnimationState, IAnimationStateData>): void;
    /**
     * This is called when the `spine.debug` object is set to a new instance of a debug renderer.
     */
    registerSpine(spine: SpineBase<ISkeleton, ISkeletonData, IAnimationState, IAnimationStateData>): void;
}

/**
 * @public
 */
export declare interface ISpineDisplayObject extends DisplayObject {
    region?: TextureRegion;
    attachment?: IAttachment;
}

/**
 * @public
 */
export declare interface ITimeline {
}

/**
 * @public
 */
export declare interface ITrackEntry {
    trackIndex: number;
    loop: boolean;
    animationEnd: number;
    listener: IAnimationStateListener;
    delay: number;
    trackTime: number;
    trackLast: number;
    nextTrackLast: number;
    trackEnd: number;
    timeScale: number;
    alpha: number;
    mixTime: number;
    mixDuration: number;
    interruptAlpha: number;
    totalAlpha: number;
}

/**
 * @public
 */
export declare interface ITransformConstraint {
    data: ITransformConstraintData;
}

/**
 * @public
 */
export declare interface ITransformConstraintData extends IConstraintData {
    offsetRotation: number;
    offsetX: number;
    offsetY: number;
    offsetScaleX: number;
    offsetScaleY: number;
    offsetShearY: number;
    relative: boolean;
    local: boolean;
}

/**
 * @public
 */
export declare interface IVertexAttachment<Slot extends ISlot = ISlot> extends IAttachment {
    id: number;
    computeWorldVerticesOld(slot: Slot, worldVertices: ArrayLike<number>): void;
    computeWorldVertices(slot: Slot, start: number, count: number, worldVertices: ArrayLike<number>, offset: number, stride: number): void;
    worldVerticesLength: number;
}

/**
 * @public
 */
declare interface Map_2<T> {
    [key: string]: T;
}
export { Map_2 as Map }

/**
 * @public
 */
export declare class MathUtils {
    static PI: number;
    static PI2: number;
    static radiansToDegrees: number;
    static radDeg: number;
    static degreesToRadians: number;
    static degRad: number;
    static clamp(value: number, min: number, max: number): number;
    static cosDeg(degrees: number): number;
    static sinDeg(degrees: number): number;
    static signum(value: number): number;
    static toInt(x: number): number;
    static cbrt(x: number): number;
    static randomTriangular(min: number, max: number): number;
    static randomTriangularWith(min: number, max: number, mode: number): number;
    static isPowerOfTwo(value: number): boolean;
}

/** Controls how a timeline value is mixed with the setup pose value or current pose value when a timeline's `alpha`
 * < 1.
 *
 * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
 * @public
 * */
export declare enum MixBlend {
    /** Transitions from the setup value to the timeline value (the current value is not used). Before the first key, the setup
     * value is set. */
    setup = 0,
    /** Transitions from the current value to the timeline value. Before the first key, transitions from the current value to
     * the setup value. Timelines which perform instant transitions, such as DrawOrderTimeline or
     * AttachmentTimeline, use the setup value before the first key.
     *
     * `first` is intended for the first animations applied, not for animations layered on top of those. */
    first = 1,
    /** Transitions from the current value to the timeline value. No change is made before the first key (the current value is
     * kept until the first key).
     *
     * `replace` is intended for animations layered on top of others, not for the first animations applied. */
    replace = 2,
    /** Transitions from the current value to the current value plus the timeline value. No change is made before the first key
     * (the current value is kept until the first key).
     *
     * `add` is intended for animations layered on top of others, not for the first animations applied. Properties
     * keyed by additive animations must be set manually or by another animation before applying the additive animations, else
     * the property values will increase continually. */
    add = 3
}

/** Indicates whether a timeline's `alpha` is mixing out over time toward 0 (the setup or current pose value) or
 * mixing in toward 1 (the timeline's value).
 *
 * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
 * @public
 * */
export declare enum MixDirection {
    mixIn = 0,
    mixOut = 1
}

/**
 * @public
 */
export declare interface NumberArrayLike {
    readonly length: number;
    [n: number]: number;
}

/**
 * @public
 */
export declare class Pool<T> {
    private items;
    private instantiator;
    constructor(instantiator: () => T);
    obtain(): T;
    free(item: T): void;
    freeAll(items: ArrayLike_2<T>): void;
    clear(): void;
}

/** Controls how the first bone is positioned along the path.
 *
 * See [Position mode](http://esotericsoftware.com/spine-path-constraints#Position-mode) in the Spine User Guide.
 * @public
 * */
export declare enum PositionMode {
    Fixed = 0,
    Percent = 1
}

/**
 * @public
 */
export declare class Pow extends Interpolation {
    protected power: number;
    constructor(power: number);
    applyInternal(a: number): number;
}

/**
 * @public
 */
export declare class PowOut extends Pow {
    applyInternal(a: number): number;
}

/**
 * @public
 */
export declare interface Restorable {
    restore(): void;
}

/** Controls how bones are rotated, translated, and scaled to match the path.
 *
 * [Rotate mode](http://esotericsoftware.com/spine-path-constraints#Rotate-mod) in the Spine User Guide.
 * @public
 * */
export declare enum RotateMode {
    Tangent = 0,
    Chain = 1,
    ChainScale = 2
}

/**
 * @public
 */
export declare const settings: {
    yDown: boolean;
    /**
     * pixi-spine gives option to not fail at certain parsing errors
     * spine-ts fails here
     */
    FAIL_ON_NON_EXISTING_SKIN: boolean;
    /**
     * past Spine.globalAutoUpdate
     */
    GLOBAL_AUTO_UPDATE: boolean;
    /**
     * past Spine.globalDelayLimit
     */
    GLOBAL_DELAY_LIMIT: number;
};

/** Collects each visible BoundingBoxAttachment and computes the world vertices for its polygon. The polygon vertices are
 * provided along with convenience methods for doing hit detection.
 * @public
 * */
export declare class SkeletonBoundsBase<BoundingBoxAttachment extends IVertexAttachment> {
    /** The left edge of the axis aligned bounding box. */
    minX: number;
    /** The bottom edge of the axis aligned bounding box. */
    minY: number;
    /** The right edge of the axis aligned bounding box. */
    maxX: number;
    /** The top edge of the axis aligned bounding box. */
    maxY: number;
    /** The visible bounding boxes. */
    boundingBoxes: BoundingBoxAttachment[];
    /** The world vertices for the bounding box polygons. */
    polygons: NumberArrayLike[];
    private polygonPool;
    /** Clears any previous polygons, finds all visible bounding box attachments, and computes the world vertices for each bounding
     * box's polygon.
     * @param updateAabb If true, the axis aligned bounding box containing all the polygons is computed. If false, the
     *           SkeletonBounds AABB methods will always return true. */
    update(skeleton: ISkeleton, updateAabb: boolean): void;
    aabbCompute(): void;
    /** Returns true if the axis aligned bounding box contains the point. */
    aabbContainsPoint(x: number, y: number): boolean;
    /** Returns true if the axis aligned bounding box intersects the line segment. */
    aabbIntersectsSegment(x1: number, y1: number, x2: number, y2: number): boolean;
    /** Returns true if the axis aligned bounding box intersects the axis aligned bounding box of the specified bounds. */
    aabbIntersectsSkeleton(bounds: SkeletonBoundsBase<BoundingBoxAttachment>): boolean;
    /** Returns the first bounding box attachment that contains the point, or null. When doing many checks, it is usually more
     * efficient to only call this method if {@link #aabbContainsPoint(float, float)} returns true.
     * Cannot be done here because BoundingBoxAttachment is not a thing yet*/
    containsPoint(x: number, y: number): BoundingBoxAttachment | null;
    /** Returns true if the polygon contains the point. */
    containsPointPolygon(polygon: NumberArrayLike, x: number, y: number): boolean;
    /** Returns the first bounding box attachment that contains any part of the line segment, or null. When doing many checks, it
     * is usually more efficient to only call this method if {@link #aabbIntersectsSegment()} returns
     * true. */
    intersectsSegment(x1: number, y1: number, x2: number, y2: number): BoundingBoxAttachment;
    /** Returns true if the polygon contains any part of the line segment. */
    intersectsSegmentPolygon(polygon: NumberArrayLike, x1: number, y1: number, x2: number, y2: number): boolean;
    /** Returns the polygon for the specified bounding box, or null. */
    getPolygon(boundingBox: BoundingBoxAttachment): NumberArrayLike;
    /** The width of the axis aligned bounding box. */
    getWidth(): number;
    /** The height of the axis aligned bounding box. */
    getHeight(): number;
}

/**
 * A class that enables the you to import and run your spine animations in pixi.
 * The Spine animation data needs to be loaded using either the Loader or a SpineLoader before it can be used by this class
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 *
 * ```js
 * let spineAnimation = new spine(spineData);
 * ```
 *
 * @public
 * @class
 * @extends Container
 * @memberof spine
 * @param spineData {object} The spine data loaded from a spine atlas.
 */
export declare abstract class SpineBase<Skeleton extends ISkeleton, SkeletonData extends ISkeletonData, AnimationState extends IAnimationState, AnimationStateData extends IAnimationStateData> extends Container implements GlobalMixins.Spine {
    tintRgb: ArrayLike<number>;
    spineData: SkeletonData;
    skeleton: Skeleton;
    stateData: AnimationStateData;
    state: AnimationState;
    slotContainers: Array<Container>;
    tempClipContainers: Array<Container>;
    localDelayLimit: number;
    private _autoUpdate;
    protected _visible: boolean;
    private _debug;
    get debug(): ISpineDebugRenderer;
    set debug(value: ISpineDebugRenderer);
    abstract createSkeleton(spineData: ISkeletonData): any;
    constructor(spineData: SkeletonData);
    /**
     * If this flag is set to true, the spine animation will be automatically updated every
     * time the object id drawn. The down side of this approach is that the delta time is
     * automatically calculated and you could miss out on cool effects like slow motion,
     * pause, skip ahead and the sorts. Most of these effects can be achieved even with
     * autoUpdate enabled but are harder to achieve.
     *
     * @member {boolean}
     * @memberof spine.Spine#
     * @default true
     */
    get autoUpdate(): boolean;
    set autoUpdate(value: boolean);
    /**
     * The tint applied to the spine object. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @member {number}
     * @memberof spine.Spine#
     * @default 0xFFFFFF
     */
    get tint(): number;
    set tint(value: number);
    /**
     * Limit value for the update dt with Spine.globalDelayLimit
     * that can be overridden with localDelayLimit
     * @return {number} - Maximum processed dt value for the update
     */
    get delayLimit(): number;
    /**
     * Update the spine skeleton and its animations by delta time (dt)
     *
     * @param dt {number} Delta time. Time by which the animation should be updated
     */
    update(dt: number): void;
    private setSpriteRegion;
    private setMeshRegion;
    protected lastTime: number;
    /**
     * When autoupdate is set to yes this function is used as pixi's updateTransform function
     *
     * @private
     */
    autoUpdateTransform(): void;
    /**
     * Create a new sprite to be used with core.RegionAttachment
     *
     * @param slot {spine.Slot} The slot to which the attachment is parented
     * @param attachment {spine.RegionAttachment} The attachment that the sprite will represent
     * @private
     */
    createSprite(slot: ISlot, attachment: IRegionAttachment, defName: string): SpineSprite;
    /**
     * Creates a Strip from the spine data
     * @param slot {spine.Slot} The slot to which the attachment is parented
     * @param attachment {spine.RegionAttachment} The attachment that the sprite will represent
     * @private
     */
    createMesh(slot: ISlot, attachment: IMeshAttachment): SpineMesh;
    static clippingPolygon: Array<number>;
    createGraphics(slot: ISlot, clip: IClippingAttachment): Graphics;
    updateGraphics(slot: ISlot, clip: IClippingAttachment): void;
    /**
     * Changes texture in attachment in specific slot.
     *
     * PIXI runtime feature, it was made to satisfy our users.
     *
     * @param slotIndex {number}
     * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
     * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
     * @returns {boolean} Success flag
     */
    hackTextureBySlotIndex(slotIndex: number, texture?: Texture, size?: Rectangle): boolean;
    /**
     * Changes texture in attachment in specific slot.
     *
     * PIXI runtime feature, it was made to satisfy our users.
     *
     * @param slotName {string}
     * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
     * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
     * @returns {boolean} Success flag
     */
    hackTextureBySlotName(slotName: string, texture?: Texture, size?: Rectangle): boolean;
    /**
     * Changes texture of an attachment
     *
     * PIXI runtime feature, it was made to satisfy our users.
     *
     * @param slotName {string}
     * @param attachmentName {string}
     * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
     * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
     * @returns {boolean} Success flag
     */
    hackTextureAttachment(slotName: string, attachmentName: string, texture: any, size?: Rectangle): boolean;
    newContainer(): Container<DisplayObject>;
    newSprite(tex: Texture): SpineSprite;
    newGraphics(): Graphics;
    newMesh(texture: Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number): SpineMesh;
    transformHack(): number;
    /**
     * Hack for pixi-display and pixi-lights. Every attachment name ending with a suffix will be added to different layer
     * @param nameSuffix
     * @param group
     * @param outGroup
     */
    hackAttachmentGroups(nameSuffix: string, group: any, outGroup: any): any[][];
    destroy(options?: any): void;
}

/**
 * This is a debug renderer that uses PixiJS Graphics under the hood.
 * @public
 */
export declare class SpineDebugRenderer implements ISpineDebugRenderer {
    private registeredSpines;
    drawDebug: boolean;
    drawMeshHull: boolean;
    drawMeshTriangles: boolean;
    drawBones: boolean;
    drawPaths: boolean;
    drawBoundingBoxes: boolean;
    drawClipping: boolean;
    drawRegionAttachments: boolean;
    lineWidth: number;
    regionAttachmentsColor: number;
    meshHullColor: number;
    meshTrianglesColor: number;
    clippingPolygonColor: number;
    boundingBoxesRectColor: number;
    boundingBoxesPolygonColor: number;
    boundingBoxesCircleColor: number;
    pathsCurveColor: number;
    pathsLineColor: number;
    skeletonXYColor: number;
    bonesColor: number;
    /**
     * The debug is attached by force to each spine object. So we need to create it inside the spine when we get the first update
     */
    registerSpine(spine: SpineBase<ISkeleton, ISkeletonData, IAnimationState, IAnimationStateData>): void;
    renderDebug(spine: SpineBase<ISkeleton, ISkeletonData, IAnimationState, IAnimationStateData>): void;
    private drawBonesFunc;
    private drawRegionAttachmentsFunc;
    private drawMeshHullAndMeshTriangles;
    private drawClippingFunc;
    private drawBoundingBoxesFunc;
    private drawPathsFunc;
    unregisterSpine(spine: SpineBase<ISkeleton, ISkeletonData, IAnimationState, IAnimationStateData>): void;
}

/**
 * @public
 */
export declare class SpineMesh extends SimpleMesh implements ISpineDisplayObject {
    region?: TextureRegion;
    attachment?: IAttachment;
    constructor(texture: Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number);
}

/**
 * @public
 */
export declare class SpineSprite extends Sprite implements ISpineDisplayObject {
    region?: TextureRegion;
    attachment?: IAttachment;
}

/**
 * @public
 */
export declare interface StringMap<T> {
    [key: string]: T;
}

/**
 * @public
 */
export declare class StringSet {
    entries: StringMap<boolean>;
    size: number;
    add(value: string): boolean;
    addAll(values: string[]): boolean;
    contains(value: string): boolean;
    clear(): void;
}

/**
 * @public
 */
export declare class TextureAtlas implements Disposable {
    pages: TextureAtlasPage[];
    regions: TextureAtlasRegion[];
    constructor(atlasText?: string, textureLoader?: (path: string, loaderFunction: (tex: BaseTexture) => any) => any, callback?: (obj: TextureAtlas) => any);
    addTexture(name: string, texture: Texture): TextureAtlasRegion;
    addTextureHash(textures: Map_2<Texture>, stripExtension: boolean): void;
    addSpineAtlas(atlasText: string, textureLoader: (path: string, loaderFunction: (tex: BaseTexture) => any) => any, callback: (obj: TextureAtlas) => any): void;
    private load;
    findRegion(name: string): TextureAtlasRegion;
    dispose(): void;
}

/**
 * @public
 */
export declare class TextureAtlasPage {
    name: string;
    minFilter: TextureFilter;
    magFilter: TextureFilter;
    uWrap: TextureWrap;
    vWrap: TextureWrap;
    baseTexture: BaseTexture;
    width: number;
    height: number;
    pma: boolean;
    setFilters(): void;
}

/**
 * @public
 */
export declare class TextureAtlasRegion extends TextureRegion {
    page: TextureAtlasPage;
    name: string;
    index: number;
}

/**
 * @public
 */
export declare enum TextureFilter {
    Nearest = 9728,
    Linear = 9729,
    MipMap = 9987,
    MipMapNearestNearest = 9984,
    MipMapLinearNearest = 9985,
    MipMapNearestLinear = 9986,
    MipMapLinearLinear = 9987
}

/**
 * @public
 */
export declare class TextureRegion {
    texture: Texture;
    size: Rectangle;
    names: string[];
    values: number[][];
    renderObject: any;
    get width(): number;
    get height(): number;
    get u(): number;
    get v(): number;
    get u2(): number;
    get v2(): number;
    get offsetX(): number;
    get offsetY(): number;
    get pixiOffsetY(): number;
    get spineOffsetY(): number;
    get originalWidth(): number;
    get originalHeight(): number;
    get x(): number;
    get y(): number;
    get rotate(): boolean;
    get degrees(): number;
}

/**
 * @public
 */
export declare enum TextureWrap {
    MirroredRepeat = 33648,
    ClampToEdge = 33071,
    Repeat = 10497
}

/**
 * @public
 */
export declare class TimeKeeper {
    maxDelta: number;
    framesPerSecond: number;
    delta: number;
    totalTime: number;
    private lastTime;
    private frameCount;
    private frameTime;
    update(): void;
}

/** Determines how a bone inherits world transforms from parent bones.
 * @public
 * */
export declare enum TransformMode {
    Normal = 0,
    OnlyTranslation = 1,
    NoRotationOrReflection = 2,
    NoScale = 3,
    NoScaleOrReflection = 4
}

/**
 * @public
 */
export declare class Utils {
    static SUPPORTS_TYPED_ARRAYS: boolean;
    static arrayCopy<T>(source: ArrayLike_2<T>, sourceStart: number, dest: ArrayLike_2<T>, destStart: number, numElements: number): void;
    static arrayFill<T>(array: ArrayLike_2<T>, fromIndex: number, toIndex: number, value: T): void;
    static setArraySize<T>(array: Array<T>, size: number, value?: any): Array<T>;
    static ensureArrayCapacity<T>(array: Array<T>, size: number, value?: any): Array<T>;
    static newArray<T>(size: number, defaultValue: T): Array<T>;
    static newFloatArray(size: number): NumberArrayLike;
    static newShortArray(size: number): NumberArrayLike;
    static toFloatArray(array: Array<number>): number[] | Float32Array;
    static toSinglePrecision(value: number): number;
    static webkit602BugfixHelper(alpha: number, blend: any): void;
    static contains<T>(array: Array<T>, element: T, identity?: boolean): boolean;
    static enumValue(type: any, name: string): any;
}

/**
 * @public
 */
export declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): Vector2;
    length(): number;
    normalize(): this;
}

/**
 * @public
 */
export declare class WindowedMean {
    values: Array<number>;
    addedValues: number;
    lastValue: number;
    mean: number;
    dirty: boolean;
    constructor(windowSize?: number);
    hasEnoughData(): boolean;
    addValue(value: number): void;
    getMean(): number;
}

/**
 * @public
 */
export declare function wrapFromString(text: string): TextureWrap;

export { }
