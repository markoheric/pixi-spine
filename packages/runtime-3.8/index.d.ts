import { ArrayLike as ArrayLike_2 } from '@pixi-spine/base';
import { AttachmentType } from '@pixi-spine/base';
import { BLEND_MODES } from '@pixi/core';
import { Color } from '@pixi-spine/base';
import type { IAnimation } from '@pixi-spine/base';
import { IAnimationState } from '@pixi-spine/base';
import type { IAnimationStateData } from '@pixi-spine/base';
import { IAnimationStateListener } from '@pixi-spine/base';
import type { IAttachment } from '@pixi-spine/base';
import { IBone } from '@pixi-spine/base';
import { IClippingAttachment } from '@pixi-spine/base';
import type { IEvent } from '@pixi-spine/base';
import type { IEventData } from '@pixi-spine/base';
import { IIkConstraint } from '@pixi-spine/base';
import type { IIkConstraintData } from '@pixi-spine/base';
import { IMeshAttachment } from '@pixi-spine/base';
import { IntSet } from '@pixi-spine/base';
import { IRegionAttachment } from '@pixi-spine/base';
import { ISkeleton } from '@pixi-spine/base';
import type { ISkeletonData } from '@pixi-spine/base';
import type { ISkin } from '@pixi-spine/base';
import { ISlot } from '@pixi-spine/base';
import type { ISlotData } from '@pixi-spine/base';
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

/** A simple container for a list of timelines and a name. */
/**
 * @public
 */
declare class Animation_2 {
    /** The animation's name, which is unique across all animations in the skeleton. */
    name: string;
    timelines: Array<Timeline>;
    timelineIds: Array<boolean>;
    /** The duration of the animation in seconds, which is the highest time of all keys in the timeline. */
    duration: number;
    constructor(name: string, timelines: Array<Timeline>, duration: number);
    hasTimeline(id: number): boolean;
    /** Applies all the animation's timelines to the specified skeleton.
     *
     * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
     * @param loop If true, the animation repeats after {@link #getDuration()}.
     * @param events May be null to ignore fired events. */
    apply(skeleton: Skeleton, lastTime: number, time: number, loop: boolean, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    /** @param target After the first and before the last value.
     * @returns index of first value greater than the target. */
    static binarySearch(values: ArrayLike_2<number>, target: number, step?: number): number;
    static linearSearch(values: ArrayLike_2<number>, target: number, step: number): number;
}
export { Animation_2 as Animation }

/** Applies animations over time, queues animations for later playback, mixes (crossfading) between animations, and applies
 * multiple animations on top of each other (layering).
 *
 * See [Applying Animations](http://esotericsoftware.com/spine-applying-animations/) in the Spine Runtimes Guide. */
/**
 * @public
 */
export declare class AnimationState implements IAnimationState<AnimationStateData> {
    static emptyAnimation: Animation_2;
    /** 1. A previously applied timeline has set this property.
     *
     * Result: Mix from the current pose to the timeline pose. */
    static SUBSEQUENT: number;
    /** 1. This is the first timeline to set this property.
     * 2. The next track entry applied after this one does not have a timeline to set this property.
     *
     * Result: Mix from the setup pose to the timeline pose. */
    static FIRST: number;
    /** 1) A previously applied timeline has set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the current pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading
     * animations that key the same property. A subsequent timeline will set this property using a mix. */
    static HOLD_SUBSEQUENT: number;
    /** 1) This is the first timeline to set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the setup pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading animations
     * that key the same property. A subsequent timeline will set this property using a mix. */
    static HOLD_FIRST: number;
    /** 1. This is the first timeline to set this property.
     * 2. The next track entry to be applied does have a timeline to set this property.
     * 3. The next track entry after that one does have a timeline to set this property.
     * 4. timelineHoldMix stores the first subsequent track entry that does not have a timeline to set this property.
     *
     * Result: The same as HOLD except the mix percentage from the timelineHoldMix track entry is used. This handles when more than
     * 2 track entries in a row have a timeline that sets the same property.
     *
     * Eg, A -> B -> C -> D where A, B, and C have a timeline setting same property, but D does not. When A is applied, to avoid
     * "dipping" A is not mixed out, however D (the first entry that doesn't set the property) mixing in is used to mix out A
     * (which affects B and C). Without using D to mix out, A would be applied fully until mixing completes, then snap into
     * place. */
    static HOLD_MIX: number;
    static SETUP: number;
    static CURRENT: number;
    /** The AnimationStateData to look up mix durations. */
    data: AnimationStateData;
    /** The list of tracks that currently have animations, which may contain null entries. */
    tracks: TrackEntry[];
    /** Multiplier for the delta time when the animation state is updated, causing time for all animations and mixes to play slower
     * or faster. Defaults to 1.
     *
     * See TrackEntry {@link TrackEntry#timeScale} for affecting a single animation. */
    timeScale: number;
    unkeyedState: number;
    events: Event_2[];
    listeners: AnimationStateListener[];
    queue: EventQueue;
    propertyIDs: IntSet;
    animationsChanged: boolean;
    trackEntryPool: Pool<TrackEntry>;
    constructor(data: AnimationStateData);
    /** Increments each track entry {@link TrackEntry#trackTime()}, setting queued animations as current if needed. */
    update(delta: number): void;
    /** Returns true when all mixing from entries are complete. */
    updateMixingFrom(to: TrackEntry, delta: number): boolean;
    /** Poses the skeleton using the track entry animations. There are no side effects other than invoking listeners, so the
     * animation state can be applied to multiple skeletons to pose them identically.
     * @returns True if any animations were applied. */
    apply(skeleton: Skeleton): boolean;
    applyMixingFrom(to: TrackEntry, skeleton: Skeleton, blend: MixBlend): number;
    applyAttachmentTimeline(timeline: AttachmentTimeline, skeleton: Skeleton, time: number, blend: MixBlend, attachments: boolean): void;
    setAttachment(skeleton: Skeleton, slot: Slot, attachmentName: string, attachments: boolean): void;
    applyRotateTimeline(timeline: Timeline, skeleton: Skeleton, time: number, alpha: number, blend: MixBlend, timelinesRotation: Array<number>, i: number, firstFrame: boolean): void;
    queueEvents(entry: TrackEntry, animationTime: number): void;
    /** Removes all animations from all tracks, leaving skeletons in their current pose.
     *
     * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
     * rather than leaving them in their current pose. */
    clearTracks(): void;
    /** Removes all animations from the track, leaving skeletons in their current pose.
     *
     * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
     * rather than leaving them in their current pose. */
    clearTrack(trackIndex: number): void;
    setCurrent(index: number, current: TrackEntry, interrupt: boolean): void;
    /** Sets an animation by name.
     *
     * {@link #setAnimationWith(}. */
    setAnimation(trackIndex: number, animationName: string, loop: boolean): TrackEntry;
    /** Sets the current animation for a track, discarding any queued animations. If the formerly current track entry was never
     * applied to a skeleton, it is replaced (not mixed from).
     * @param loop If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
     *           duration. In either case {@link TrackEntry#trackEnd} determines when the track is cleared.
     * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    setAnimationWith(trackIndex: number, animation: Animation_2, loop: boolean): TrackEntry;
    /** Queues an animation by name.
     *
     * See {@link #addAnimationWith()}. */
    addAnimation(trackIndex: number, animationName: string, loop: boolean, delay: number): TrackEntry;
    /** Adds an animation to be played after the current or last queued animation for a track. If the track is empty, it is
     * equivalent to calling {@link #setAnimationWith()}.
     * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
     *           minus any mix duration (from the {@link AnimationStateData}) plus the specified `delay` (ie the mix
     *           ends at (`delay` = 0) or before (`delay` < 0) the previous track entry duration). If the
     *           previous entry is looping, its next loop completion is used instead of its duration.
     * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    addAnimationWith(trackIndex: number, animation: Animation_2, loop: boolean, delay: number): TrackEntry;
    /** Sets an empty animation for a track, discarding any queued animations, and sets the track entry's
     * {@link TrackEntry#mixduration}. An empty animation has no timelines and serves as a placeholder for mixing in or out.
     *
     * Mixing out is done by setting an empty animation with a mix duration using either {@link #setEmptyAnimation()},
     * {@link #setEmptyAnimations()}, or {@link #addEmptyAnimation()}. Mixing to an empty animation causes
     * the previous animation to be applied less and less over the mix duration. Properties keyed in the previous animation
     * transition to the value from lower tracks or to the setup pose value if no lower tracks key the property. A mix duration of
     * 0 still mixes out over one frame.
     *
     * Mixing in is done by first setting an empty animation, then adding an animation using
     * {@link #addAnimation()} and on the returned track entry, set the
     * {@link TrackEntry#setMixDuration()}. Mixing from an empty animation causes the new animation to be applied more and
     * more over the mix duration. Properties keyed in the new animation transition from the value from lower tracks or from the
     * setup pose value if no lower tracks key the property to the value keyed in the new animation. */
    setEmptyAnimation(trackIndex: number, mixDuration: number): TrackEntry;
    /** Adds an empty animation to be played after the current or last queued animation for a track, and sets the track entry's
     * {@link TrackEntry#mixDuration}. If the track is empty, it is equivalent to calling
     * {@link #setEmptyAnimation()}.
     *
     * See {@link #setEmptyAnimation()}.
     * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
     *           minus any mix duration plus the specified `delay` (ie the mix ends at (`delay` = 0) or
     *           before (`delay` < 0) the previous track entry duration). If the previous entry is looping, its next
     *           loop completion is used instead of its duration.
     * @return A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    addEmptyAnimation(trackIndex: number, mixDuration: number, delay: number): TrackEntry;
    /** Sets an empty animation for every track, discarding any queued animations, and mixes to it over the specified mix
     * duration. */
    setEmptyAnimations(mixDuration: number): void;
    expandToIndex(index: number): TrackEntry;
    /** @param last May be null. */
    trackEntry(trackIndex: number, animation: Animation_2, loop: boolean, last: TrackEntry): TrackEntry;
    disposeNext(entry: TrackEntry): void;
    _animationsChanged(): void;
    computeHold(entry: TrackEntry): void;
    /** Returns the track entry for the animation currently playing on the track, or null if no animation is currently playing. */
    getCurrent(trackIndex: number): TrackEntry;
    /** Adds a listener to receive events for all track entries. */
    addListener(listener: AnimationStateListener): void;
    /** Removes the listener added with {@link #addListener()}. */
    removeListener(listener: AnimationStateListener): void;
    /** Removes all listeners added with {@link #addListener()}. */
    clearListeners(): void;
    /** Discards all listener notifications that have not yet been delivered. This can be useful to call from an
     * {@link AnimationStateListener} when it is known that further notifications that may have been already queued for delivery
     * are not wanted because new animations are being set. */
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
export declare abstract class AnimationStateAdapter implements AnimationStateListener {
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
    setMixWith(from: IAnimation, to: IAnimation, duration: number): void;
    getMix(from: IAnimation, to: IAnimation): number;
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
    abstract copy(): Attachment;
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

/** Changes a slot's {@link Slot#attachment}. */
/**
 * @public
 */
export declare class AttachmentTimeline implements Timeline {
    /** The index of the slot in {@link Skeleton#slots} that will be changed. */
    slotIndex: number;
    /** The time in seconds for each key frame. */
    frames: ArrayLike_2<number>;
    /** The attachment name for each key frame. May contain null values to clear the attachment. */
    attachmentNames: Array<string>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** The number of key frames for this timeline. */
    getFrameCount(): number;
    /** Sets the time in seconds and the attachment name for the specified key frame. */
    setFrame(frameIndex: number, time: number, attachmentName: string): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    setAttachment(skeleton: Skeleton, slot: Slot, attachmentName: string): void;
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
    active: boolean;
    /** @param parent May be null. */
    constructor(data: BoneData, skeleton: Skeleton, parent: Bone);
    isActive(): boolean;
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
    skinRequired: boolean;
    color: Color;
    constructor(index: number, name: string, parent: BoneData);
}

/**
 * @public
 */
export declare class BoundingBoxAttachment extends VertexAttachment {
    type: AttachmentType;
    color: Color;
    constructor(name: string);
    copy(): Attachment;
}

/**
 * @public
 */
export declare class ClippingAttachment extends VertexAttachment implements IClippingAttachment {
    type: AttachmentType;
    endSlot: SlotData;
    color: Color;
    constructor(name: string);
    copy(): Attachment;
}

/** Changes a slot's {@link Slot#color}. */
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
    /** The index of the slot in {@link Skeleton#slots} that will be changed. */
    slotIndex: number;
    /** The time in seconds, red, green, blue, and alpha values for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare abstract class ConstraintData {
    name: string;
    order: number;
    skinRequired: boolean;
    constructor(name: string, order: number, skinRequired: boolean);
}

/** The base class for timelines that use interpolation between key frame values. */
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
    /** The number of key frames for this timeline. */
    getFrameCount(): number;
    /** Sets the specified key frame to linear interpolation. */
    setLinear(frameIndex: number): void;
    /** Sets the specified key frame to stepped interpolation. */
    setStepped(frameIndex: number): void;
    /** Returns the interpolation type for the specified key frame.
     * @returns Linear is 0, stepped is 1, Bezier is 2. */
    getCurveType(frameIndex: number): number;
    /** Sets the specified key frame to Bezier interpolation. `cx1` and `cx2` are from 0 to 1,
     * representing the percent of time between the two key frames. `cy1` and `cy2` are the percent of the
     * difference between the key frame's values. */
    setCurve(frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
    /** Returns the interpolated percentage for the specified key frame and linear percentage. */
    getCurvePercent(frameIndex: number, percent: number): number;
    abstract apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a slot's {@link Slot#deform} to deform a {@link VertexAttachment}. */
/**
 * @public
 */
export declare class DeformTimeline extends CurveTimeline {
    /** The index of the slot in {@link Skeleton#getSlots()} that will be changed. */
    slotIndex: number;
    /** The attachment that will be deformed. */
    attachment: VertexAttachment;
    /** The time in seconds for each key frame. */
    frames: ArrayLike_2<number>;
    /** The vertices for each key frame. */
    frameVertices: Array<ArrayLike_2<number>>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time in seconds and the vertices for the specified key frame.
     * @param vertices Vertex positions for an unweighted VertexAttachment, or deform offsets if it has weights. */
    setFrame(frameIndex: number, time: number, vertices: ArrayLike_2<number>): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a skeleton's {@link Skeleton#drawOrder}. */
/**
 * @public
 */
export declare class DrawOrderTimeline implements Timeline {
    /** The time in seconds for each key frame. */
    frames: ArrayLike_2<number>;
    /** The draw order for each key frame. See {@link #setFrame(int, float, int[])}. */
    drawOrders: Array<Array<number>>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** The number of key frames for this timeline. */
    getFrameCount(): number;
    /** Sets the time in seconds and the draw order for the specified key frame.
     * @param drawOrder For each slot in {@link Skeleton#slots}, the index of the new draw order. May be null to use setup pose
     *           draw order. */
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

/** Fires an {@link Event} when specific animation times are reached. */
/**
 * @public
 */
export declare class EventTimeline implements Timeline {
    /** The time in seconds for each key frame. */
    frames: ArrayLike_2<number>;
    /** The event for each key frame. */
    events: Array<Event_2>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** The number of key frames for this timeline. */
    getFrameCount(): number;
    /** Sets the time in seconds and the event for the specified key frame. */
    setFrame(frameIndex: number, event: Event_2): void;
    /** Fires events for frames > `lastTime` and <= `time`. */
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
export declare class IkConstraint implements IIkConstraint, Updatable {
    data: IkConstraintData;
    bones: Array<Bone>;
    target: Bone;
    bendDirection: number;
    compress: boolean;
    stretch: boolean;
    mix: number;
    softness: number;
    active: boolean;
    constructor(data: IkConstraintData, skeleton: Skeleton);
    isActive(): boolean;
    apply(): void;
    update(): void;
    /** Adjusts the bone rotation so the tip is as close to the target position as possible. The target is specified in the world
     * coordinate system. */
    apply1(bone: Bone, targetX: number, targetY: number, compress: boolean, stretch: boolean, uniform: boolean, alpha: number): void;
    /** Adjusts the parent and child bone rotations so the tip of the child is as close to the target position as possible. The
     * target is specified in the world coordinate system.
     * @param child A direct descendant of the parent bone. */
    apply2(parent: Bone, child: Bone, targetX: number, targetY: number, bendDir: number, stretch: boolean, softness: number, alpha: number): void;
}

/**
 * @public
 */
export declare class IkConstraintData extends ConstraintData implements IIkConstraintData {
    bones: BoneData[];
    target: BoneData;
    bendDirection: number;
    compress: boolean;
    stretch: boolean;
    uniform: boolean;
    mix: number;
    softness: number;
    constructor(name: string);
}

/** Changes an IK constraint's {@link IkConstraint#mix}, {@link IkConstraint#softness},
 * {@link IkConstraint#bendDirection}, {@link IkConstraint#stretch}, and {@link IkConstraint#compress}. */
/**
 * @public
 */
export declare class IkConstraintTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_MIX: number;
    static PREV_SOFTNESS: number;
    static PREV_BEND_DIRECTION: number;
    static PREV_COMPRESS: number;
    static PREV_STRETCH: number;
    static MIX: number;
    static SOFTNESS: number;
    static BEND_DIRECTION: number;
    static COMPRESS: number;
    static STRETCH: number;
    /** The index of the IK constraint slot in {@link Skeleton#ikConstraints} that will be changed. */
    ikConstraintIndex: number;
    /** The time in seconds, mix, softness, bend direction, compress, and stretch for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time in seconds, mix, softness, bend direction, compress, and stretch for the specified key frame. */
    setFrame(frameIndex: number, time: number, mix: number, softness: number, bendDirection: number, compress: boolean, stretch: boolean): void;
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
    triangles: Array<number>;
    color: Color;
    width: number;
    height: number;
    hullLength: number;
    edges: Array<number>;
    private parentMesh;
    tempColor: Color;
    constructor(name: string);
    getParentMesh(): MeshAttachment;
    /** @param parentMesh May be null. */
    setParentMesh(parentMesh: MeshAttachment): void;
    copy(): Attachment;
    newLinkedMesh(): MeshAttachment;
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
    copy(): Attachment;
}

/**
 * @public
 */
export declare class PathConstraint implements Updatable {
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
    active: boolean;
    constructor(data: PathConstraintData, skeleton: Skeleton);
    isActive(): boolean;
    apply(): void;
    update(): void;
    computeWorldPositions(path: PathAttachment, spacesCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): number[];
    addBeforePosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
    addAfterPosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
    addCurvePosition(p: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, out: Array<number>, o: number, tangents: boolean): void;
}

/**
 * @public
 */
export declare class PathConstraintData extends ConstraintData {
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

/** Changes a transform constraint's {@link PathConstraint#rotateMix} and
 * {@link TransformConstraint#translateMix}. */
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
    /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
    pathConstraintIndex: number;
    /** The time in seconds, rotate mix, and translate mix for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** The time in seconds, rotate mix, and translate mix for the specified key frame. */
    setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a path constraint's {@link PathConstraint#position}. */
/**
 * @public
 */
export declare class PathConstraintPositionTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_VALUE: number;
    static VALUE: number;
    /** The index of the path constraint slot in {@link Skeleton#pathConstraints} that will be changed. */
    pathConstraintIndex: number;
    /** The time in seconds and path constraint position for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time in seconds and path constraint position for the specified key frame. */
    setFrame(frameIndex: number, time: number, value: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a path constraint's {@link PathConstraint#spacing}. */
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
    copy(): Attachment;
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
    copy(): Attachment;
}

/** Changes a bone's local {@link Bone#rotation}. */
/**
 * @public
 */
export declare class RotateTimeline extends CurveTimeline {
    static ENTRIES: number;
    static PREV_TIME: number;
    static PREV_ROTATION: number;
    static ROTATION: number;
    /** The index of the bone in {@link Skeleton#bones} that will be changed. */
    boneIndex: number;
    /** The time in seconds and rotation in degrees for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time and angle of the specified keyframe. */
    setFrame(frameIndex: number, time: number, degrees: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}. */
/**
 * @public
 */
export declare class ScaleTimeline extends TranslateTimeline {
    constructor(frameCount: number);
    getPropertyId(): number;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}. */
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
    setSkin(newSkin: Skin): void;
    /** @return May be null. */
    getAttachmentByName(slotName: string, attachmentName: string): Attachment;
    /** @return May be null. */
    getAttachment(slotIndex: number, attachmentName: string): Attachment;
    /** @param attachmentName May be null. */
    setAttachment(slotName: string, attachmentName?: string): void;
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
    getBounds(offset: Vector2, size: Vector2, temp?: Array<number>): void;
    update(delta: number): void;
    get flipX(): boolean;
    set flipX(value: boolean);
    get flipY(): boolean;
    set flipY(value: boolean);
    private static deprecatedWarning1;
}

/**
 * @public
 */
export declare class SkeletonBinary {
    static AttachmentTypeValues: number[];
    static TransformModeValues: TransformMode[];
    static PositionModeValues: PositionMode[];
    static SpacingModeValues: SpacingMode[];
    static RotateModeValues: RotateMode[];
    static BlendModeValues: BLEND_MODES[];
    static BONE_ROTATE: number;
    static BONE_TRANSLATE: number;
    static BONE_SCALE: number;
    static BONE_SHEAR: number;
    static SLOT_ATTACHMENT: number;
    static SLOT_COLOR: number;
    static SLOT_TWO_COLOR: number;
    static PATH_POSITION: number;
    static PATH_SPACING: number;
    static PATH_MIX: number;
    static CURVE_LINEAR: number;
    static CURVE_STEPPED: number;
    static CURVE_BEZIER: number;
    attachmentLoader: AttachmentLoader;
    scale: number;
    private linkedMeshes;
    constructor(attachmentLoader: AttachmentLoader);
    readSkeletonData(binary: Uint8Array): SkeletonData;
    private readSkin;
    private readAttachment;
    private readVertices;
    private readFloatArray;
    private readShortArray;
    private readAnimation;
    private readCurve;
    setCurve(timeline: CurveTimeline, frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
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
    x: number;
    y: number;
    width: number;
    height: number;
    version: string;
    hash: string;
    fps: number;
    imagesPath: string;
    audioPath: string;
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
    bones: BoneData[];
    constraints: ConstraintData[];
    constructor(name: string);
    setAttachment(slotIndex: number, name: string, attachment: Attachment): void;
    addSkin(skin: Skin): void;
    copySkin(skin: Skin): void;
    /** @return May be null. */
    getAttachment(slotIndex: number, name: string): Attachment;
    removeAttachment(slotIndex: number, name: string): void;
    getAttachments(): Array<SkinEntry>;
    getAttachmentsForSlot(slotIndex: number, attachments: Array<SkinEntry>): void;
    clear(): void;
    /** Attach each attachment in this skin if the corresponding attachment in the old skin is currently attached. */
    attachAll(skeleton: Skeleton, oldSkin: Skin): void;
}

/**
 * @public
 */
export declare class SkinEntry {
    slotIndex: number;
    name: string;
    attachment: Attachment;
    constructor(slotIndex: number, name: string, attachment: Attachment);
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
    attachmentState: number;
    deform: number[];
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

/** The interface for all timelines. */
/**
 * @public
 */
export declare interface Timeline {
    /** Applies this timeline to the skeleton.
     * @param skeleton The skeleton the timeline is being applied to. This provides access to the bones, slots, and other
     *           skeleton components the timeline may change.
     * @param lastTime The time this timeline was last applied. Timelines such as {@link EventTimeline}} trigger only at specific
     *           times rather than every frame. In that case, the timeline triggers everything between `lastTime`
     *           (exclusive) and `time` (inclusive).
     * @param time The time within the animation. Most timelines find the key before and the key after this time so they can
     *           interpolate between the keys.
     * @param events If any events are fired, they are added to this list. Can be null to ignore fired events or if the timeline
     *           does not fire events.
     * @param alpha 0 applies the current or setup value (depending on `blend`). 1 applies the timeline value.
     *           Between 0 and 1 applies a value between the current or setup value and the timeline value. By adjusting
     *           `alpha` over time, an animation can be mixed in or out. `alpha` can also be useful to
     *           apply animations on top of each other (layering).
     * @param blend Controls how mixing is applied when `alpha` < 1.
     * @param direction Indicates whether the timeline is mixing in or out. Used by timelines which perform instant transitions,
     *           such as {@link DrawOrderTimeline} or {@link AttachmentTimeline}. */
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    /** Uniquely encodes both the type of this timeline and the skeleton property that it affects. */
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

/** Stores settings and other state for the playback of an animation on an {@link AnimationState} track.
 *
 * References to a track entry must not be kept after the {@link AnimationStateListener#dispose()} event occurs. */
/**
 * @public
 */
export declare class TrackEntry implements ITrackEntry {
    /** The animation to apply for this track entry. */
    animation: Animation_2;
    /** The animation queued to start after this animation, or null. `next` makes up a linked list. */
    next: TrackEntry;
    /** The track entry for the previous animation when mixing from the previous animation to this animation, or null if no
     * mixing is currently occuring. When mixing from multiple animations, `mixingFrom` makes up a linked list. */
    mixingFrom: TrackEntry;
    /** The track entry for the next animation when mixing from this animation to the next animation, or null if no mixing is
     * currently occuring. When mixing to multiple animations, `mixingTo` makes up a linked list. */
    mixingTo: TrackEntry;
    /** The listener for events generated by this track entry, or null.
     *
     * A track entry returned from {@link AnimationState#setAnimation()} is already the current animation
     * for the track, so the track entry listener {@link AnimationStateListener#start()} will not be called. */
    listener: AnimationStateListener;
    /** The index of the track where this track entry is either current or queued.
     *
     * See {@link AnimationState#getCurrent()}. */
    trackIndex: number;
    /** If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
     * duration. */
    loop: boolean;
    /** If true, when mixing from the previous animation to this animation, the previous animation is applied as normal instead
     * of being mixed out.
     *
     * When mixing between animations that key the same property, if a lower track also keys that property then the value will
     * briefly dip toward the lower track value during the mix. This happens because the first animation mixes from 100% to 0%
     * while the second animation mixes from 0% to 100%. Setting `holdPrevious` to true applies the first animation
     * at 100% during the mix so the lower track value is overwritten. Such dipping does not occur on the lowest track which
     * keys the property, only when a higher track also keys the property.
     *
     * Snapping will occur if `holdPrevious` is true and this animation does not key all the same properties as the
     * previous animation. */
    holdPrevious: boolean;
    /** When the mix percentage ({@link #mixTime} / {@link #mixDuration}) is less than the
     * `eventThreshold`, event timelines are applied while this animation is being mixed out. Defaults to 0, so event
     * timelines are not applied while this animation is being mixed out. */
    eventThreshold: number;
    /** When the mix percentage ({@link #mixtime} / {@link #mixDuration}) is less than the
     * `attachmentThreshold`, attachment timelines are applied while this animation is being mixed out. Defaults to
     * 0, so attachment timelines are not applied while this animation is being mixed out. */
    attachmentThreshold: number;
    /** When the mix percentage ({@link #mixTime} / {@link #mixDuration}) is less than the
     * `drawOrderThreshold`, draw order timelines are applied while this animation is being mixed out. Defaults to 0,
     * so draw order timelines are not applied while this animation is being mixed out. */
    drawOrderThreshold: number;
    /** Seconds when this animation starts, both initially and after looping. Defaults to 0.
     *
     * When changing the `animationStart` time, it often makes sense to set {@link #animationLast} to the same
     * value to prevent timeline keys before the start time from triggering. */
    animationStart: number;
    /** Seconds for the last frame of this animation. Non-looping animations won't play past this time. Looping animations will
     * loop back to {@link #animationStart} at this time. Defaults to the animation {@link Animation#duration}. */
    animationEnd: number;
    /** The time in seconds this animation was last applied. Some timelines use this for one-time triggers. Eg, when this
     * animation is applied, event timelines will fire all events between the `animationLast` time (exclusive) and
     * `animationTime` (inclusive). Defaults to -1 to ensure triggers on frame 0 happen the first time this animation
     * is applied. */
    animationLast: number;
    nextAnimationLast: number;
    /** Seconds to postpone playing the animation. When this track entry is the current track entry, `delay`
     * postpones incrementing the {@link #trackTime}. When this track entry is queued, `delay` is the time from
     * the start of the previous animation to when this track entry will become the current track entry (ie when the previous
     * track entry {@link TrackEntry#trackTime} >= this track entry's `delay`).
     *
     * {@link #timeScale} affects the delay. */
    delay: number;
    /** Current time in seconds this track entry has been the current track entry. The track time determines
     * {@link #animationTime}. The track time can be set to start the animation at a time other than 0, without affecting
     * looping. */
    trackTime: number;
    trackLast: number;
    nextTrackLast: number;
    /** The track time in seconds when this animation will be removed from the track. Defaults to the highest possible float
     * value, meaning the animation will be applied until a new animation is set or the track is cleared. If the track end time
     * is reached, no other animations are queued for playback, and mixing from any previous animations is complete, then the
     * properties keyed by the animation are set to the setup pose and the track is cleared.
     *
     * It may be desired to use {@link AnimationState#addEmptyAnimation()} rather than have the animation
     * abruptly cease being applied. */
    trackEnd: number;
    /** Multiplier for the delta time when this track entry is updated, causing time for this animation to pass slower or
     * faster. Defaults to 1.
     *
     * {@link #mixTime} is not affected by track entry time scale, so {@link #mixDuration} may need to be adjusted to
     * match the animation speed.
     *
     * When using {@link AnimationState#addAnimation()} with a `delay` <= 0, note the
     * {@link #delay} is set using the mix duration from the {@link AnimationStateData}, assuming time scale to be 1. If
     * the time scale is not 1, the delay may need to be adjusted.
     *
     * See AnimationState {@link AnimationState#timeScale} for affecting all animations. */
    timeScale: number;
    /** Values < 1 mix this animation with the skeleton's current pose (usually the pose resulting from lower tracks). Defaults
     * to 1, which overwrites the skeleton's current pose with this animation.
     *
     * Typically track 0 is used to completely pose the skeleton, then alpha is used on higher tracks. It doesn't make sense to
     * use alpha on track 0 if the skeleton pose is from the last frame render. */
    alpha: number;
    /** Seconds from 0 to the {@link #getMixDuration()} when mixing from the previous animation to this animation. May be
     * slightly more than `mixDuration` when the mix is complete. */
    mixTime: number;
    /** Seconds for mixing from the previous animation to this animation. Defaults to the value provided by AnimationStateData
     * {@link AnimationStateData#getMix()} based on the animation before this animation (if any).
     *
     * A mix duration of 0 still mixes out over one frame to provide the track entry being mixed out a chance to revert the
     * properties it was animating.
     *
     * The `mixDuration` can be set manually rather than use the value from
     * {@link AnimationStateData#getMix()}. In that case, the `mixDuration` can be set for a new
     * track entry only before {@link AnimationState#update(float)} is first called.
     *
     * When using {@link AnimationState#addAnimation()} with a `delay` <= 0, note the
     * {@link #delay} is set using the mix duration from the {@link AnimationStateData}, not a mix duration set
     * afterward. */
    mixDuration: number;
    interruptAlpha: number;
    totalAlpha: number;
    /** Controls how properties keyed in the animation are mixed with lower tracks. Defaults to {@link MixBlend#replace}, which
     * replaces the values from the lower tracks with the animation values. {@link MixBlend#add} adds the animation values to
     * the values from the lower tracks.
     *
     * The `mixBlend` can be set for a new track entry only before {@link AnimationState#apply()} is first
     * called. */
    mixBlend: MixBlend;
    timelineMode: number[];
    timelineHoldMix: TrackEntry[];
    timelinesRotation: number[];
    reset(): void;
    /** Uses {@link #trackTime} to compute the `animationTime`, which is between {@link #animationStart}
     * and {@link #animationEnd}. When the `trackTime` is 0, the `animationTime` is equal to the
     * `animationStart` time. */
    getAnimationTime(): number;
    setAnimationLast(animationLast: number): void;
    /** Returns true if at least one loop has been completed.
     *
     * See {@link AnimationStateListener#complete()}. */
    isComplete(): boolean;
    /** Resets the rotation directions for mixing this entry's rotate timelines. This can be useful to avoid bones rotating the
     * long way around when using {@link #alpha} and starting animations on other tracks.
     *
     * Mixing with {@link MixBlend#replace} involves finding a rotation between two others, which has two possible solutions:
     * the short way or the long way around. The two rotations likely change over time, so which direction is the short or long
     * way also changes. If the short way was always chosen, bones would flip to the other side when that direction became the
     * long way. TrackEntry chooses the short way the first time it is applied and remembers that direction. */
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
export declare class TransformConstraint implements Updatable {
    data: TransformConstraintData;
    bones: Array<Bone>;
    target: Bone;
    rotateMix: number;
    translateMix: number;
    scaleMix: number;
    shearMix: number;
    temp: Vector2;
    active: boolean;
    constructor(data: TransformConstraintData, skeleton: Skeleton);
    isActive(): boolean;
    apply(): void;
    update(): void;
    applyAbsoluteWorld(): void;
    applyRelativeWorld(): void;
    applyAbsoluteLocal(): void;
    applyRelativeLocal(): void;
}

/**
 * @public
 */
export declare class TransformConstraintData extends ConstraintData {
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

/** Changes a transform constraint's {@link TransformConstraint#rotateMix}, {@link TransformConstraint#translateMix},
 * {@link TransformConstraint#scaleMix}, and {@link TransformConstraint#shearMix}. */
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
    /** The index of the transform constraint slot in {@link Skeleton#transformConstraints} that will be changed. */
    transformConstraintIndex: number;
    /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for the specified key frame. */
    setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number, scaleMix: number, shearMix: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#x} and {@link Bone#y}. */
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
    /** The index of the bone in {@link Skeleton#bones} that will be changed. */
    boneIndex: number;
    /** The time in seconds, x, and y values for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time in seconds, x, and y values for the specified key frame. */
    setFrame(frameIndex: number, time: number, x: number, y: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting. */
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
    /** The index of the slot in {@link Skeleton#slots()} that will be changed. The {@link Slot#darkColor()} must not be
     * null. */
    slotIndex: number;
    /** The time in seconds, red, green, blue, and alpha values of the color, red, green, blue of the dark color, for each key frame. */
    frames: ArrayLike_2<number>;
    constructor(frameCount: number);
    getPropertyId(): number;
    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare interface Updatable {
    update(): void;
    isActive(): boolean;
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
    deformAttachment: VertexAttachment;
    constructor(name: string);
    computeWorldVerticesOld(slot: Slot, worldVertices: ArrayLike_2<number>): void;
    /** Transforms local vertices to world coordinates.
     * @param start The index of the first local vertex value to transform. Each vertex has 2 values, x and y.
     * @param count The number of world vertex values to output. Must be <= {@link #getWorldVerticesLength()} - start.
     * @param worldVertices The output world vertices. Must have a length >= offset + count.
     * @param offset The worldVertices index to begin writing values. */
    computeWorldVertices(slot: Slot, start: number, count: number, worldVertices: ArrayLike_2<number>, offset: number, stride: number): void;
    copyTo(attachment: VertexAttachment): void;
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
