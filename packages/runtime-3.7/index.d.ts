import { ArrayLike as ArrayLike_2 } from '@pixi-spine/base';
import { AttachmentType } from '@pixi-spine/base';
import { BLEND_MODES } from '@pixi/core';
import { Color } from '@pixi-spine/base';
import { IAnimation } from '@pixi-spine/base';
import { IAnimationState } from '@pixi-spine/base';
import type { IAnimationStateData } from '@pixi-spine/base';
import { IAnimationStateListener } from '@pixi-spine/base';
import type { IAttachment } from '@pixi-spine/base';
import { IBone } from '@pixi-spine/base';
import { IClippingAttachment } from '@pixi-spine/base';
import type { IEvent } from '@pixi-spine/base';
import type { IEventData } from '@pixi-spine/base';
import { IMeshAttachment } from '@pixi-spine/base';
import { IntSet } from '@pixi-spine/base';
import type { IPathConstraintData } from '@pixi-spine/base';
import { IRegionAttachment } from '@pixi-spine/base';
import { ISkeleton } from '@pixi-spine/base';
import type { ISkeletonData } from '@pixi-spine/base';
import type { ISkin } from '@pixi-spine/base';
import { ISlot } from '@pixi-spine/base';
import type { ISlotData } from '@pixi-spine/base';
import { ITimeline } from '@pixi-spine/base';
import { ITrackEntry } from '@pixi-spine/base';
import type { Map as Map_2 } from '@pixi-spine/base';
import { Matrix } from '@pixi/core';
import { MixBlend } from '@pixi-spine/base';
import { MixDirection } from '@pixi-spine/base';
import { NumberArrayLike } from '@pixi-spine/base';
import { Pool } from '@pixi-spine/base';
import { PositionMode } from '@pixi-spine/base';
import { PowOut } from '@pixi-spine/base';
import { RotateMode } from '@pixi-spine/base';
import { SkeletonBoundsBase } from '@pixi-spine/base';
import { SpineBase } from '@pixi-spine/base';
import type { TextureAtlas } from '@pixi-spine/base';
import { TextureRegion } from '@pixi-spine/base';
import { TransformMode } from '@pixi-spine/base';
import { Vector2 } from '@pixi-spine/base';

/**
 * @public
 */
declare class Animation_2 implements IAnimation<Timeline> {
    name: string;
    timelines: Array<Timeline>;
    duration: number;
    constructor(name: string, timelines: Array<Timeline>, duration: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, loop: boolean, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    static binarySearch(values: ArrayLike_2<number>, target: number, step?: number): number;
    static linearSearch(values: ArrayLike_2<number>, target: number, step: number): number;
}
export { Animation_2 as Animation }

/**
 * @public
 */
export declare class AnimationState implements IAnimationState<AnimationStateData> {
    static emptyAnimation: Animation_2;
    static SUBSEQUENT: number;
    static FIRST: number;
    static HOLD: number;
    static HOLD_MIX: number;
    data: AnimationStateData;
    tracks: TrackEntry[];
    events: Event_2[];
    listeners: AnimationStateListener[];
    queue: EventQueue;
    propertyIDs: IntSet;
    animationsChanged: boolean;
    timeScale: number;
    trackEntryPool: Pool<TrackEntry>;
    constructor(data: AnimationStateData);
    update(delta: number): void;
    updateMixingFrom(to: TrackEntry, delta: number): boolean;
    apply(skeleton: Skeleton): boolean;
    applyMixingFrom(to: TrackEntry, skeleton: Skeleton, blend: MixBlend): number;
    applyRotateTimeline(timeline: Timeline, skeleton: Skeleton, time: number, alpha: number, blend: MixBlend, timelinesRotation: Array<number>, i: number, firstFrame: boolean): void;
    queueEvents(entry: TrackEntry, animationTime: number): void;
    clearTracks(): void;
    clearTrack(trackIndex: number): void;
    setCurrent(index: number, current: TrackEntry, interrupt: boolean): void;
    setAnimation(trackIndex: number, animationName: string, loop: boolean): TrackEntry;
    setAnimationWith(trackIndex: number, animation: Animation_2, loop: boolean): TrackEntry;
    addAnimation(trackIndex: number, animationName: string, loop: boolean, delay: number): TrackEntry;
    addAnimationWith(trackIndex: number, animation: Animation_2, loop: boolean, delay: number): TrackEntry;
    setEmptyAnimation(trackIndex: number, mixDuration: number): TrackEntry;
    addEmptyAnimation(trackIndex: number, mixDuration: number, delay: number): TrackEntry;
    setEmptyAnimations(mixDuration: number): void;
    expandToIndex(index: number): TrackEntry;
    trackEntry(trackIndex: number, animation: Animation_2, loop: boolean, last: TrackEntry): TrackEntry;
    disposeNext(entry: TrackEntry): void;
    _animationsChanged(): void;
    setTimelineModes(entry: TrackEntry): void;
    hasTimeline(entry: TrackEntry, id: number): boolean;
    getCurrent(trackIndex: number): TrackEntry;
    addListener(listener: AnimationStateListener): void;
    /** Removes the listener added with {@link #addListener(AnimationStateListener)}. */
    removeListener(listener: AnimationStateListener): void;
    clearListeners(): void;
    clearListenerNotifications(): void;
    onComplete: (trackIndex: number, loopCount: number) => any;
    onEvent: (trackIndex: number, event: Event_2) => any;
    onStart: (trackIndex: number) => any;
    onEnd: (trackIndex: number) => any;
    private static deprecatedWarning1;
    setAnimationByName(trackIndex: number, animationName: string, loop: boolean): void;
    private static deprecatedWarning2;
    addAnimationByName(trackIndex: number, animationName: string, loop: boolean, delay: number): void;
    private static deprecatedWarning3;
    hasAnimation(animationName: string): boolean;
    hasAnimationByName(animationName: string): boolean;
}

/**
 * @public
 */
export declare abstract class AnimationStateAdapter2 implements AnimationStateListener {
    start(entry: TrackEntry): void;
    interrupt(entry: TrackEntry): void;
    end(entry: TrackEntry): void;
    dispose(entry: TrackEntry): void;
    complete(entry: TrackEntry): void;
    event(entry: TrackEntry, event: Event_2): void;
}

/**
 * @public
 */
export declare class AnimationStateData implements IAnimationStateData<SkeletonData, Animation_2> {
    skeletonData: SkeletonData;
    animationToMixTime: Map_2<number>;
    defaultMix: number;
    constructor(skeletonData: SkeletonData);
    setMix(fromName: string, toName: string, duration: number): void;
    private static deprecatedWarning1;
    setMixByName(fromName: string, toName: string, duration: number): void;
    setMixWith(from: Animation_2, to: Animation_2, duration: number): void;
    getMix(from: Animation_2, to: Animation_2): number;
}

/**
 * @public
 */
export declare interface AnimationStateListener extends IAnimationStateListener {
    /** Invoked when this entry has been set as the current entry. */
    start?(entry: TrackEntry): void;
    /** Invoked when another entry has replaced this entry as the current entry. This entry may continue being applied for
     * mixing. */
    interrupt?(entry: TrackEntry): void;
    /** Invoked when this entry is no longer the current entry and will never be applied again. */
    end?(entry: TrackEntry): void;
    /** Invoked when this entry will be disposed. This may occur without the entry ever being set as the current entry.
     * References to the entry should not be kept after dispose is called, as it may be destroyed or reused. */
    dispose?(entry: TrackEntry): void;
    /** Invoked every time this entry's animation completes a loop. */
    complete?(entry: TrackEntry): void;
    /** Invoked when this entry's animation triggers an event. */
    event?(entry: TrackEntry, event: Event_2): void;
}

/**
 * @public
 */
export declare class AtlasAttachmentLoader implements AttachmentLoader {
    atlas: TextureAtlas;
    constructor(atlas: TextureAtlas);
    /** @return May be null to not load an attachment. */
    newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
    /** @return May be null to not load an attachment. */
    newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
    /** @return May be null to not load an attachment. */
    newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
    /** @return May be null to not load an attachment */
    newPathAttachment(skin: Skin, name: string): PathAttachment;
    newPointAttachment(skin: Skin, name: string): PointAttachment;
    newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
}

/**
 * @public
 */
export declare abstract class Attachment implements IAttachment {
    name: string;
    type: AttachmentType;
    constructor(name: string);
}

/**
 * @public
 */
export declare interface AttachmentLoader {
    /** @return May be null to not load an attachment. */
    newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
    /** @return May be null to not load an attachment. */
    newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
    /** @return May be null to not load an attachment. */
    newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
    /** @return May be null to not load an attachment */
    newPathAttachment(skin: Skin, name: string): PathAttachment;
    /** @return May be null to not load an attachment */
    newPointAttachment(skin: Skin, name: string): PointAttachment;
    /** @return May be null to not load an attachment */
    newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
}

/**
 * @public
 */
export declare class AttachmentTimeline implements Timeline {
    slotIndex: number;
    frames: ArrayLike_2<number>;
    attachmentNames: Array<string>;
    constructor(frameCount: number);
    getPropertyId(): number;
    getFrameCount(): number;
    /** Sets the time and value of the specified keyframe. */
    setFrame(frameIndex: number, time: number, attachmentName: string): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class Bone implements Updatable, IBone {
    matrix: Matrix;
    get worldX(): number;
    get worldY(): number;
    data: BoneData;
    skeleton: Skeleton;
    parent: Bone;
    children: Bone[];
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    shearX: number;
    shearY: number;
    ax: number;
    ay: number;
    arotation: number;
    ascaleX: number;
    ascaleY: number;
    ashearX: number;
    ashearY: number;
    appliedValid: boolean;
    sorted: boolean;
    /** @param parent May be null. */
    constructor(data: BoneData, skeleton: Skeleton, parent: Bone);
    /** NOT USED IN 3.7. Needed for the debug graph code */
    active: boolean;
    /** Same as {@link #updateWorldTransform()}. This method exists for Bone to implement {@link Updatable}. */
    update(): void;
    /** Computes the world transform using the parent bone and this bone's local transform. */
    updateWorldTransform(): void;
    /** Computes the world transform using the parent bone and the specified local transform. */
    updateWorldTransformWith(x: number, y: number, rotation: number, scaleX: number, scaleY: number, shearX: number, shearY: number): void;
    setToSetupPose(): void;
    getWorldRotationX(): number;
    getWorldRotationY(): number;
    getWorldScaleX(): number;
    getWorldScaleY(): number;
    /** Computes the individual applied transform values from the world transform. This can be useful to perform processing using
     * the applied transform after the world transform has been modified directly (eg, by a constraint).
     * <p>
     * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. */
    updateAppliedTransform(): void;
    worldToLocal(world: Vector2): Vector2;
    localToWorld(local: Vector2): Vector2;
    worldToLocalRotation(worldRotation: number): number;
    localToWorldRotation(localRotation: number): number;
    rotateWorld(degrees: number): void;
}

/**
 * @public
 */
export declare class BoneData {
    index: number;
    name: string;
    parent: BoneData;
    length: number;
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    shearX: number;
    shearY: number;
    transformMode: TransformMode;
    constructor(index: number, name: string, parent: BoneData);
}

/**
 * @public
 */
export declare class BoundingBoxAttachment extends VertexAttachment {
    type: AttachmentType;
    color: Color;
    constructor(name: string);
}

/**
 * @public
 */
export declare class ClippingAttachment extends VertexAttachment implements IClippingAttachment {
    type: AttachmentType;
    endSlot: SlotData;
    color: Color;
    constructor(name: string);
}

/**
 * @public
 */
export declare class ColorTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_R: number;
    static PREV_G: number;
    static PREV_B: number;
    static PREV_A: number;
    static R: number;
    static G: number;
    static B: number;
    static A: number;
    slotIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and value of the specified keyframe. */
    setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare interface Constraint extends Updatable {
    getOrder(): number;
}

/**
 * @public
 */
export declare abstract class CurveTimeline implements Timeline {
    static LINEAR: number;
    static STEPPED: number;
    static BEZIER: number;
    static BEZIER_SIZE: number;
    private curves;
    abstract getPropertyId(): number;
    constructor(frameCount: number);
    getFrameCount(): number;
    setLinear(frameIndex: number): void;
    setStepped(frameIndex: number): void;
    getCurveType(frameIndex: number): number;
    /** Sets the control handle positions for an interpolation bezier curve used to transition from this keyframe to the next.
     * cx1 and cx2 are from 0 to 1, representing the percent of time between the two keyframes. cy1 and cy2 are the percent of
     * the difference between the keyframe's values. */
    setCurve(frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
    getCurvePercent(frameIndex: number, percent: number): number;
    abstract apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class DeformTimeline extends CurveTimeline {
    slotIndex: number;
    attachment: VertexAttachment;
    frames: ArrayLike_2<number>;
    frameVertices: Array<ArrayLike_2<number>>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time of the specified keyframe. */
    setFrame(frameIndex: number, time: number, vertices: ArrayLike_2<number>): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class DrawOrderTimeline implements Timeline {
    frames: ArrayLike_2<number>;
    drawOrders: Array<Array<number>>;
    constructor(frameCount: number);
    getPropertyId(): number;
    getFrameCount(): number;
    /** Sets the time of the specified keyframe.
     * @param drawOrder May be null to use bind pose draw order. */
    setFrame(frameIndex: number, time: number, drawOrder: Array<number>): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
declare class Event_2 implements IEvent {
    data: EventData;
    intValue: number;
    floatValue: number;
    stringValue: string;
    time: number;
    volume: number;
    balance: number;
    constructor(time: number, data: EventData);
}
export { Event_2 as Event }

/**
 * @public
 */
export declare class EventData implements IEventData {
    name: string;
    intValue: number;
    floatValue: number;
    stringValue: string;
    audioPath: string;
    volume: number;
    balance: number;
    constructor(name: string);
}

/**
 * @public
 */
export declare class EventQueue {
    objects: Array<any>;
    drainDisabled: boolean;
    animState: AnimationState;
    constructor(animState: AnimationState);
    start(entry: TrackEntry): void;
    interrupt(entry: TrackEntry): void;
    end(entry: TrackEntry): void;
    dispose(entry: TrackEntry): void;
    complete(entry: TrackEntry): void;
    event(entry: TrackEntry, event: Event_2): void;
    private static deprecatedWarning1;
    deprecateStuff(): boolean;
    drain(): void;
    clear(): void;
}

/**
 * @public
 */
export declare class EventTimeline implements Timeline {
    frames: ArrayLike_2<number>;
    events: Array<Event_2>;
    constructor(frameCount: number);
    getPropertyId(): number;
    getFrameCount(): number;
    /** Sets the time of the specified keyframe. */
    setFrame(frameIndex: number, event: Event_2): void;
    /** Fires events for frames > lastTime and <= time. */
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare enum EventType {
    start = 0,
    interrupt = 1,
    end = 2,
    dispose = 3,
    complete = 4,
    event = 5
}

/**
 * @public
 */
export declare class IkConstraint implements Constraint {
    data: IkConstraintData;
    bones: Array<Bone>;
    target: Bone;
    bendDirection: number;
    compress: boolean;
    stretch: boolean;
    mix: number;
    constructor(data: IkConstraintData, skeleton: Skeleton);
    getOrder(): number;
    apply(): void;
    update(): void;
    /** Adjusts the bone rotation so the tip is as close to the target position as possible. The target is specified in the world
     * coordinate system. */
    apply1(bone: Bone, targetX: number, targetY: number, compress: boolean, stretch: boolean, uniform: boolean, alpha: number): void;
    /** Adjusts the parent and child bone rotations so the tip of the child is as close to the target position as possible. The
     * target is specified in the world coordinate system.
     * @param child A direct descendant of the parent bone. */
    apply2(parent: Bone, child: Bone, targetX: number, targetY: number, bendDir: number, stretch: boolean, alpha: number): void;
}

/**
 * @public
 */
export declare class IkConstraintData {
    name: string;
    order: number;
    bones: BoneData[];
    target: BoneData;
    bendDirection: number;
    compress: boolean;
    stretch: boolean;
    uniform: boolean;
    mix: number;
    constructor(name: string);
}

/**
 * @public
 */
export declare class IkConstraintTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_MIX: number;
    static PREV_BEND_DIRECTION: number;
    static PREV_COMPRESS: number;
    static PREV_STRETCH: number;
    static MIX: number;
    static BEND_DIRECTION: number;
    static COMPRESS: number;
    static STRETCH: number;
    ikConstraintIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time, mix and bend direction of the specified keyframe. */
    setFrame(frameIndex: number, time: number, mix: number, bendDirection: number, compress: boolean, stretch: boolean): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class JitterEffect implements VertexEffect {
    jitterX: number;
    jitterY: number;
    constructor(jitterX: number, jitterY: number);
    begin(skeleton: Skeleton): void;
    transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
    end(): void;
}

/**
 * @public
 */
export declare class MeshAttachment extends VertexAttachment implements IMeshAttachment {
    type: AttachmentType;
    region: TextureRegion;
    path: string;
    regionUVs: Float32Array;
    uvs: ArrayLike<number>;
    triangles: Array<number>;
    color: Color;
    hullLength: number;
    private parentMesh;
    inheritDeform: boolean;
    tempColor: Color;
    constructor(name: string);
    applyDeform(sourceAttachment: VertexAttachment): boolean;
    getParentMesh(): MeshAttachment;
    /** @param parentMesh May be null. */
    setParentMesh(parentMesh: MeshAttachment): void;
}

/**
 * @public
 */
export declare class PathAttachment extends VertexAttachment {
    type: AttachmentType;
    lengths: Array<number>;
    closed: boolean;
    constantSpeed: boolean;
    color: Color;
    constructor(name: string);
}

/**
 * @public
 */
export declare class PathConstraint implements Constraint {
    static NONE: number;
    static BEFORE: number;
    static AFTER: number;
    static epsilon: number;
    data: PathConstraintData;
    bones: Array<Bone>;
    target: Slot;
    position: number;
    spacing: number;
    rotateMix: number;
    translateMix: number;
    spaces: number[];
    positions: number[];
    world: number[];
    curves: number[];
    lengths: number[];
    segments: number[];
    constructor(data: PathConstraintData, skeleton: Skeleton);
    apply(): void;
    update(): void;
    computeWorldPositions(path: PathAttachment, spacesCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): number[];
    addBeforePosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
    addAfterPosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
    addCurvePosition(p: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, out: Array<number>, o: number, tangents: boolean): void;
    getOrder(): number;
}

/**
 * @public
 */
export declare class PathConstraintData implements IPathConstraintData {
    name: string;
    order: number;
    bones: BoneData[];
    target: SlotData;
    positionMode: PositionMode;
    spacingMode: SpacingMode;
    rotateMode: RotateMode;
    offsetRotation: number;
    position: number;
    spacing: number;
    rotateMix: number;
    translateMix: number;
    constructor(name: string);
}

/**
 * @public
 */
export declare class PathConstraintMixTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_ROTATE: number;
    static PREV_TRANSLATE: number;
    static ROTATE: number;
    static TRANSLATE: number;
    pathConstraintIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and mixes of the specified keyframe. */
    setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class PathConstraintPositionTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_VALUE: number;
    static VALUE: number;
    pathConstraintIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and value of the specified keyframe. */
    setFrame(frameIndex: number, time: number, value: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class PathConstraintSpacingTimeline extends PathConstraintPositionTimeline {
    constructor(frameCount: number);
    getPropertyId(): number;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class PointAttachment extends VertexAttachment {
    type: AttachmentType;
    x: number;
    y: number;
    rotation: number;
    color: Color;
    constructor(name: string);
    computeWorldPosition(bone: Bone, point: Vector2): Vector2;
    computeWorldRotation(bone: Bone): number;
}

/**
 * @public
 */
export declare class RegionAttachment extends Attachment implements IRegionAttachment {
    type: AttachmentType;
    static OX1: number;
    static OY1: number;
    static OX2: number;
    static OY2: number;
    static OX3: number;
    static OY3: number;
    static OX4: number;
    static OY4: number;
    static X1: number;
    static Y1: number;
    static C1R: number;
    static C1G: number;
    static C1B: number;
    static C1A: number;
    static U1: number;
    static V1: number;
    static X2: number;
    static Y2: number;
    static C2R: number;
    static C2G: number;
    static C2B: number;
    static C2A: number;
    static U2: number;
    static V2: number;
    static X3: number;
    static Y3: number;
    static C3R: number;
    static C3G: number;
    static C3B: number;
    static C3A: number;
    static U3: number;
    static V3: number;
    static X4: number;
    static Y4: number;
    static C4R: number;
    static C4G: number;
    static C4B: number;
    static C4A: number;
    static U4: number;
    static V4: number;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    width: number;
    height: number;
    color: Color;
    path: string;
    rendererObject: any;
    region: TextureRegion;
    offset: NumberArrayLike;
    uvs: NumberArrayLike;
    tempColor: Color;
    constructor(name: string);
    updateOffset(): void;
    setRegion(region: TextureRegion): void;
    computeWorldVertices(bone: Bone | Slot, worldVertices: ArrayLike_2<number>, offset: number, stride: number): void;
}

/**
 * @public
 */
export declare class RotateTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_ROTATION: number;
    static ROTATION: number;
    boneIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and angle of the specified keyframe. */
    setFrame(frameIndex: number, time: number, degrees: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class ScaleTimeline extends TranslateTimeline {
    constructor(frameCount: number);
    getPropertyId(): number;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class ShearTimeline extends TranslateTimeline {
    constructor(frameCount: number);
    getPropertyId(): number;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class Skeleton implements ISkeleton<SkeletonData, Bone, Slot, Skin> {
    data: SkeletonData;
    bones: Array<Bone>;
    slots: Array<Slot>;
    drawOrder: Array<Slot>;
    ikConstraints: Array<IkConstraint>;
    transformConstraints: Array<TransformConstraint>;
    pathConstraints: Array<PathConstraint>;
    _updateCache: Updatable[];
    updateCacheReset: Updatable[];
    skin: Skin;
    color: Color;
    time: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    constructor(data: SkeletonData);
    updateCache(): void;
    sortIkConstraint(constraint: IkConstraint): void;
    sortPathConstraint(constraint: PathConstraint): void;
    sortTransformConstraint(constraint: TransformConstraint): void;
    sortPathConstraintAttachment(skin: Skin, slotIndex: number, slotBone: Bone): void;
    sortPathConstraintAttachmentWith(attachment: Attachment, slotBone: Bone): void;
    sortBone(bone: Bone): void;
    sortReset(bones: Array<Bone>): void;
    /** Updates the world transform for each bone and applies constraints. */
    updateWorldTransform(): void;
    /** Sets the bones, constraints, and slots to their setup pose values. */
    setToSetupPose(): void;
    /** Sets the bones and constraints to their setup pose values. */
    setBonesToSetupPose(): void;
    setSlotsToSetupPose(): void;
    /** @return May return null. */
    getRootBone(): Bone;
    /** @return May be null. */
    findBone(boneName: string): Bone;
    /** @return -1 if the bone was not found. */
    findBoneIndex(boneName: string): number;
    /** @return May be null. */
    findSlot(slotName: string): Slot;
    /** @return -1 if the bone was not found. */
    findSlotIndex(slotName: string): number;
    /** Sets a skin by name.
     * @see #setSkin(Skin) */
    setSkinByName(skinName: string): void;
    /** Sets the skin used to look up attachments before looking in the {@link SkeletonData#getDefaultSkin() default skin}.
     * Attachments from the new skin are attached if the corresponding attachment from the old skin was attached. If there was no
     * old skin, each slot's setup mode attachment is attached from the new skin.
     * @param newSkin May be null. */
    setSkin(newSkin: Skin | null): void;
    /** @return May be null. */
    getAttachmentByName(slotName: string, attachmentName: string): Attachment;
    /** @return May be null. */
    getAttachment(slotIndex: number, attachmentName: string): Attachment;
    /** @param attachmentName May be null. */
    setAttachment(slotName: string, attachmentName: string): void;
    /** @return May be null. */
    findIkConstraint(constraintName: string): IkConstraint;
    /** @return May be null. */
    findTransformConstraint(constraintName: string): TransformConstraint;
    /** @return May be null. */
    findPathConstraint(constraintName: string): PathConstraint;
    /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
     * @param offset The distance from the skeleton origin to the bottom left corner of the AABB.
     * @param size The width and height of the AABB.
     * @param temp Working memory */
    getBounds(offset: Vector2, size: Vector2, temp: Array<number>): void;
    update(delta: number): void;
    get flipX(): boolean;
    set flipX(value: boolean);
    get flipY(): boolean;
    set flipY(value: boolean);
    private static deprecatedWarning1;
}

/** Collects each visible {@link BoundingBoxAttachment} and computes the world vertices for its polygon. The polygon vertices are
 * provided along with convenience methods for doing hit detection.
 * @public
 * */
export declare class SkeletonBounds extends SkeletonBoundsBase<BoundingBoxAttachment> {
}

/**
 * @public
 */
export declare class SkeletonData implements ISkeletonData<BoneData, SlotData, Skin, Animation_2, EventData, IkConstraintData, TransformConstraintData, PathConstraintData> {
    name: string;
    bones: BoneData[];
    slots: SlotData[];
    skins: Skin[];
    defaultSkin: Skin;
    events: EventData[];
    animations: Animation_2[];
    ikConstraints: IkConstraintData[];
    transformConstraints: TransformConstraintData[];
    pathConstraints: PathConstraintData[];
    width: number;
    height: number;
    version: string;
    hash: string;
    fps: number;
    imagesPath: string;
    findBone(boneName: string): BoneData;
    findBoneIndex(boneName: string): number;
    findSlot(slotName: string): SlotData;
    findSlotIndex(slotName: string): number;
    findSkin(skinName: string): Skin;
    findEvent(eventDataName: string): EventData;
    findAnimation(animationName: string): Animation_2;
    findIkConstraint(constraintName: string): IkConstraintData;
    findTransformConstraint(constraintName: string): TransformConstraintData;
    findPathConstraint(constraintName: string): PathConstraintData;
    findPathConstraintIndex(pathConstraintName: string): number;
}

/**
 * @public
 */
export declare class SkeletonJson {
    attachmentLoader: AttachmentLoader;
    scale: number;
    private linkedMeshes;
    constructor(attachmentLoader: AttachmentLoader);
    readSkeletonData(json: string | any): SkeletonData;
    readAttachment(map: any, skin: Skin, slotIndex: number, name: string, skeletonData: SkeletonData): Attachment;
    readVertices(map: any, attachment: VertexAttachment, verticesLength: number): void;
    readAnimation(map: any, name: string, skeletonData: SkeletonData): void;
    readCurve(map: any, timeline: CurveTimeline, frameIndex: number): void;
    getValue(map: any, prop: string, defaultValue: any): any;
    static blendModeFromString(str: string): BLEND_MODES.NORMAL | BLEND_MODES.ADD | BLEND_MODES.MULTIPLY | BLEND_MODES.SCREEN;
    static positionModeFromString(str: string): PositionMode;
    static spacingModeFromString(str: string): SpacingMode;
    static rotateModeFromString(str: string): RotateMode;
    static transformModeFromString(str: string): TransformMode;
}

/**
 * @public
 */
export declare class Skin implements ISkin {
    name: string;
    attachments: Map_2<Attachment>[];
    constructor(name: string);
    addAttachment(slotIndex: number, name: string, attachment: Attachment): void;
    /** @return May be null. */
    getAttachment(slotIndex: number, name: string): Attachment;
    /** Attach each attachment in this skin if the corresponding attachment in the old skin is currently attached. */
    attachAll(skeleton: Skeleton, oldSkin: Skin): void;
}

/**
 * @public
 */
export declare class Slot implements ISlot {
    blendMode: number;
    data: SlotData;
    bone: Bone;
    color: Color;
    darkColor: Color;
    attachment: Attachment;
    private attachmentTime;
    attachmentVertices: number[];
    constructor(data: SlotData, bone: Bone);
    /** @return May be null. */
    getAttachment(): Attachment;
    /** Sets the attachment and if it changed, resets {@link #getAttachmentTime()} and clears {@link #getAttachmentVertices()}.
     * @param attachment May be null. */
    setAttachment(attachment: Attachment): void;
    setAttachmentTime(time: number): void;
    /** Returns the time since the attachment was set. */
    getAttachmentTime(): number;
    setToSetupPose(): void;
}

/**
 * @public
 */
export declare class SlotData implements ISlotData {
    index: number;
    name: string;
    boneData: BoneData;
    color: Color;
    darkColor: Color;
    attachmentName: string;
    blendMode: BLEND_MODES;
    constructor(index: number, name: string, boneData: BoneData);
}

/**
 * @public
 */
export declare enum SpacingMode {
    Length = 0,
    Fixed = 1,
    Percent = 2
}

/**
 * @public
 */
export declare class Spine extends SpineBase<Skeleton, SkeletonData, AnimationState, AnimationStateData> {
    createSkeleton(spineData: SkeletonData): void;
}

/**
 * @public
 */
export declare class SwirlEffect implements VertexEffect {
    static interpolation: PowOut;
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
    private worldX;
    private worldY;
    constructor(radius: number);
    begin(skeleton: Skeleton): void;
    transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
    end(): void;
}

/**
 * @public
 */
export declare interface Timeline extends ITimeline {
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    getPropertyId(): number;
}

/**
 * @public
 */
export declare enum TimelineType {
    rotate = 0,
    translate = 1,
    scale = 2,
    shear = 3,
    attachment = 4,
    color = 5,
    deform = 6,
    event = 7,
    drawOrder = 8,
    ikConstraint = 9,
    transformConstraint = 10,
    pathConstraintPosition = 11,
    pathConstraintSpacing = 12,
    pathConstraintMix = 13,
    twoColor = 14
}

/**
 * @public
 */
export declare class TrackEntry implements ITrackEntry {
    animation: Animation_2;
    next: TrackEntry;
    mixingFrom: TrackEntry;
    mixingTo: TrackEntry;
    listener: AnimationStateListener;
    trackIndex: number;
    loop: boolean;
    holdPrevious: boolean;
    eventThreshold: number;
    attachmentThreshold: number;
    drawOrderThreshold: number;
    animationStart: number;
    animationEnd: number;
    animationLast: number;
    nextAnimationLast: number;
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
    mixBlend: MixBlend;
    timelineMode: number[];
    timelineHoldMix: TrackEntry[];
    timelinesRotation: number[];
    reset(): void;
    getAnimationTime(): number;
    setAnimationLast(animationLast: number): void;
    isComplete(): boolean;
    resetRotationDirections(): void;
    onComplete: (trackIndex: number, loopCount: number) => any;
    onEvent: (trackIndex: number, event: Event_2) => any;
    onStart: (trackIndex: number) => any;
    onEnd: (trackIndex: number) => any;
    private static deprecatedWarning1;
    private static deprecatedWarning2;
    get time(): number;
    set time(value: number);
    get endTime(): number;
    set endTime(value: number);
    loopsCount(): number;
}

/**
 * @public
 */
export declare class TransformConstraint implements Constraint {
    data: TransformConstraintData;
    bones: Array<Bone>;
    target: Bone;
    rotateMix: number;
    translateMix: number;
    scaleMix: number;
    shearMix: number;
    temp: Vector2;
    constructor(data: TransformConstraintData, skeleton: Skeleton);
    apply(): void;
    update(): void;
    applyAbsoluteWorld(): void;
    applyRelativeWorld(): void;
    applyAbsoluteLocal(): void;
    applyRelativeLocal(): void;
    getOrder(): number;
}

/**
 * @public
 */
export declare class TransformConstraintData {
    name: string;
    order: number;
    bones: BoneData[];
    target: BoneData;
    rotateMix: number;
    translateMix: number;
    scaleMix: number;
    shearMix: number;
    offsetRotation: number;
    offsetX: number;
    offsetY: number;
    offsetScaleX: number;
    offsetScaleY: number;
    offsetShearY: number;
    relative: boolean;
    local: boolean;
    constructor(name: string);
}

/**
 * @public
 */
export declare class TransformConstraintTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_ROTATE: number;
    static PREV_TRANSLATE: number;
    static PREV_SCALE: number;
    static PREV_SHEAR: number;
    static ROTATE: number;
    static TRANSLATE: number;
    static SCALE: number;
    static SHEAR: number;
    transformConstraintIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and mixes of the specified keyframe. */
    setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number, scaleMix: number, shearMix: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class TranslateTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_X: number;
    static PREV_Y: number;
    static X: number;
    static Y: number;
    boneIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and value of the specified keyframe. */
    setFrame(frameIndex: number, time: number, x: number, y: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class TwoColorTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_R: number;
    static PREV_G: number;
    static PREV_B: number;
    static PREV_A: number;
    static PREV_R2: number;
    static PREV_G2: number;
    static PREV_B2: number;
    static R: number;
    static G: number;
    static B: number;
    static A: number;
    static R2: number;
    static G2: number;
    static B2: number;
    slotIndex: number;
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and value of the specified keyframe. */
    setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare interface Updatable {
    update(): void;
}

/**
 * @public
 */
export declare abstract class VertexAttachment extends Attachment {
    private static nextID;
    id: number;
    bones: Array<number>;
    vertices: ArrayLike_2<number>;
    worldVerticesLength: number;
    constructor(name: string);
    computeWorldVerticesOld(slot: Slot, worldVertices: ArrayLike_2<number>): void;
    /** Transforms local vertices to world coordinates.
     * @param start The index of the first local vertex value to transform. Each vertex has 2 values, x and y.
     * @param count The number of world vertex values to output. Must be <= {@link #getWorldVerticesLength()} - start.
     * @param worldVertices The output world vertices. Must have a length >= offset + count.
     * @param offset The worldVertices index to begin writing values. */
    computeWorldVertices(slot: Slot, start: number, count: number, worldVertices: ArrayLike_2<number>, offset: number, stride: number): void;
    /** Returns true if a deform originally applied to the specified attachment should be applied to this attachment. */
    applyDeform(sourceAttachment: VertexAttachment): boolean;
}

/**
 * @public
 */
export declare interface VertexEffect {
    begin(skeleton: Skeleton): void;
    transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
    end(): void;
}

export { }
