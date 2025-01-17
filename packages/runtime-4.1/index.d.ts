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
import { IHasTextureRegion } from '@pixi-spine/base';
import { IMeshAttachment } from '@pixi-spine/base';
import { IRegionAttachment } from '@pixi-spine/base';
import { ISequence } from '@pixi-spine/base';
import { ISkeleton } from '@pixi-spine/base';
import type { ISkeletonData } from '@pixi-spine/base';
import type { ISkin } from '@pixi-spine/base';
import { ISlot } from '@pixi-spine/base';
import type { ISlotData } from '@pixi-spine/base';
import { ITimeline } from '@pixi-spine/base';
import { ITrackEntry } from '@pixi-spine/base';
import { Matrix } from '@pixi/core';
import { MixBlend } from '@pixi-spine/base';
import { MixDirection } from '@pixi-spine/base';
import { NumberArrayLike } from '@pixi-spine/base';
import { Pool } from '@pixi-spine/base';
import { PositionMode } from '@pixi-spine/base';
import { RotateMode } from '@pixi-spine/base';
import { SkeletonBoundsBase } from '@pixi-spine/base';
import { SpineBase } from '@pixi-spine/base';
import type { StringMap } from '@pixi-spine/base';
import { StringSet } from '@pixi-spine/base';
import type { TextureAtlas } from '@pixi-spine/base';
import { TextureRegion } from '@pixi-spine/base';
import { TransformMode } from '@pixi-spine/base';
import { Vector2 } from '@pixi-spine/base';

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
export declare class AlphaTimeline extends CurveTimeline1 implements SlotTimeline {
    slotIndex: number;
    constructor(frameCount: number, bezierCount: number, slotIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * A simple container for a list of timelines and a name.
 * @public
 * */
declare class Animation_2 implements IAnimation<Timeline> {
    /** The animation's name, which is unique across all animations in the skeleton. */
    name: string;
    timelines: Array<Timeline>;
    timelineIds: StringSet;
    /** The duration of the animation in seconds, which is the highest time of all keys in the timeline. */
    duration: number;
    constructor(name: string, timelines: Array<Timeline>, duration: number);
    setTimelines(timelines: Array<Timeline>): void;
    hasTimeline(ids: string[]): boolean;
    /** Applies all the animation's timelines to the specified skeleton.
     *
     * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
     * @param loop If true, the animation repeats after {@link #getDuration()}.
     * @param events May be null to ignore fired events. */
    apply(skeleton: Skeleton, lastTime: number, time: number, loop: boolean, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}
export { Animation_2 as Animation }

/** Applies animations over time, queues animations for later playback, mixes (crossfading) between animations, and applies
 * multiple animations on top of each other (layering).
 *
 * See [Applying Animations](http://esotericsoftware.com/spine-applying-animations/) in the Spine Runtimes Guide.
 * @public
 * */
export declare class AnimationState implements IAnimationState<AnimationStateData> {
    static _emptyAnimation: Animation_2;
    private static emptyAnimation;
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
    propertyIDs: StringSet;
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
    setAttachment(skeleton: Skeleton, slot: Slot, attachmentName: string | null, attachments: boolean): void;
    applyRotateTimeline(timeline: RotateTimeline, skeleton: Skeleton, time: number, alpha: number, blend: MixBlend, timelinesRotation: Array<number>, i: number, firstFrame: boolean): void;
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
     * See {@link #setAnimationWith()}. */
    setAnimation(trackIndex: number, animationName: string, loop?: boolean): TrackEntry;
    /** Sets the current animation for a track, discarding any queued animations. If the formerly current track entry was never
     * applied to a skeleton, it is replaced (not mixed from).
     * @param loop If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
     *           duration. In either case {@link TrackEntry#trackEnd} determines when the track is cleared.
     * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    setAnimationWith(trackIndex: number, animation: Animation_2, loop?: boolean): TrackEntry;
    /** Queues an animation by name.
     *
     * See {@link #addAnimationWith()}. */
    addAnimation(trackIndex: number, animationName: string, loop?: boolean, delay?: number): TrackEntry;
    /** Adds an animation to be played after the current or last queued animation for a track. If the track is empty, it is
     * equivalent to calling {@link #setAnimationWith()}.
     * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
     *           minus any mix duration (from the {@link AnimationStateData}) plus the specified `delay` (ie the mix
     *           ends at (`delay` = 0) or before (`delay` < 0) the previous track entry duration). If the
     *           previous entry is looping, its next loop completion is used instead of its duration.
     * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    addAnimationWith(trackIndex: number, animation: Animation_2, loop?: boolean, delay?: number): TrackEntry;
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
    setEmptyAnimation(trackIndex: number, mixDuration?: number): TrackEntry;
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
    addEmptyAnimation(trackIndex: number, mixDuration?: number, delay?: number): TrackEntry;
    /** Sets an empty animation for every track, discarding any queued animations, and mixes to it over the specified mix
     * duration. */
    setEmptyAnimations(mixDuration?: number): void;
    expandToIndex(index: number): TrackEntry;
    /** @param last May be null. */
    trackEntry(trackIndex: number, animation: Animation_2, loop: boolean, last: TrackEntry | null): TrackEntry;
    /** Removes the {@link TrackEntry#getNext() next entry} and all entries after it for the specified entry. */
    clearNext(entry: TrackEntry): void;
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

/** Stores mix (crossfade) durations to be applied when {@link AnimationState} animations are changed.
 * @public
 * */
export declare class AnimationStateData implements IAnimationStateData<SkeletonData, Animation_2> {
    /** The SkeletonData to look up animations when they are specified by name. */
    skeletonData: SkeletonData;
    animationToMixTime: StringMap<number>;
    /** The mix duration to use when no mix duration has been defined between two animations. */
    defaultMix: number;
    constructor(skeletonData: SkeletonData);
    /** Sets a mix duration by animation name.
     *
     * See {@link #setMixWith()}. */
    setMix(fromName: string, toName: string, duration: number): void;
    /** Sets the mix duration when changing from the specified animation to the other.
     *
     * See {@link TrackEntry#mixDuration}. */
    setMixWith(from: Animation_2, to: Animation_2, duration: number): void;
    /** Returns the mix duration to use when changing from the specified animation to the other, or the {@link #defaultMix} if
     * no mix duration has been set. */
    getMix(from: Animation_2, to: Animation_2): number;
}

/** The interface to implement for receiving TrackEntry events. It is always safe to call AnimationState methods when receiving
 * events.
 *
 * See TrackEntry {@link TrackEntry#listener} and AnimationState
 * {@link AnimationState#addListener()}.
 * @public
 * */
export declare interface AnimationStateListener extends IAnimationStateListener {
    /** Invoked when this entry has been set as the current entry. */
    start?: (entry: TrackEntry) => void;
    /** Invoked when another entry has replaced this entry as the current entry. This entry may continue being applied for
     * mixing. */
    interrupt?: (entry: TrackEntry) => void;
    /** Invoked when this entry is no longer the current entry and will never be applied again. */
    end?: (entry: TrackEntry) => void;
    /** Invoked when this entry will be disposed. This may occur without the entry ever being set as the current entry.
     * References to the entry should not be kept after dispose is called, as it may be destroyed or reused. */
    dispose?: (entry: TrackEntry) => void;
    /** Invoked every time this entry's animation completes a loop. */
    complete?: (entry: TrackEntry) => void;
    /** Invoked when this entry's animation triggers an event. */
    event?: (entry: TrackEntry, event: Event_2) => void;
}

/**
 * @public
 */
export declare class AtlasAttachmentLoader implements AttachmentLoader {
    atlas: TextureAtlas;
    constructor(atlas: TextureAtlas);
    loadSequence(name: string, basePath: string, sequence: Sequence): void;
    newRegionAttachment(skin: Skin, name: string, path: string, sequence: Sequence): RegionAttachment;
    newMeshAttachment(skin: Skin, name: string, path: string, sequence: Sequence): MeshAttachment;
    newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
    newPathAttachment(skin: Skin, name: string): PathAttachment;
    newPointAttachment(skin: Skin, name: string): PointAttachment;
    newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
}

/**
 * The base class for all attachments.
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
    newRegionAttachment(skin: Skin, name: string, path: string, sequence: Sequence | null): RegionAttachment;
    /** @return May be null to not load an attachment. */
    newMeshAttachment(skin: Skin, name: string, path: string, sequence: Sequence | null): MeshAttachment;
    /** @return May be null to not load an attachment. */
    newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
    /** @return May be null to not load an attachment */
    newPathAttachment(skin: Skin, name: string): PathAttachment;
    /** @return May be null to not load an attachment */
    newPointAttachment(skin: Skin, name: string): PointAttachment;
    /** @return May be null to not load an attachment */
    newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
}

/** Changes a slot's {@link Slot#attachment}.
 * @public
 * */
export declare class AttachmentTimeline extends Timeline implements SlotTimeline {
    slotIndex: number;
    /** The attachment name for each key frame. May contain null values to clear the attachment. */
    attachmentNames: Array<string | null>;
    constructor(frameCount: number, slotIndex: number);
    getFrameCount(): number;
    /** Sets the time in seconds and the attachment name for the specified key frame. */
    setFrame(frame: number, time: number, attachmentName: string | null): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    setAttachment(skeleton: Skeleton, slot: Slot, attachmentName: string | null): void;
}

/** Stores a bone's current pose.
 *
 * A bone has a local transform which is used to compute its world transform. A bone also has an applied transform, which is a
 * local transform that can be applied to compute the world transform. The local transform and applied transform may differ if a
 * constraint or application code modifies the world transform after it was computed from the local transform.
 * @public
 * */
export declare class Bone implements Updatable, IBone {
    matrix: Matrix;
    get worldX(): number;
    get worldY(): number;
    /** The bone's setup pose data. */
    data: BoneData;
    /** The skeleton this bone belongs to. */
    skeleton: Skeleton;
    /** The parent bone, or null if this is the root bone. */
    parent: Bone | null;
    /** The immediate children of this bone. */
    children: Bone[];
    /** The local x translation. */
    x: number;
    /** The local y translation. */
    y: number;
    /** The local rotation in degrees, counter clockwise. */
    rotation: number;
    /** The local scaleX. */
    scaleX: number;
    /** The local scaleY. */
    scaleY: number;
    /** The local shearX. */
    shearX: number;
    /** The local shearY. */
    shearY: number;
    /** The applied local x translation. */
    ax: number;
    /** The applied local y translation. */
    ay: number;
    /** The applied local rotation in degrees, counter clockwise. */
    arotation: number;
    /** The applied local scaleX. */
    ascaleX: number;
    /** The applied local scaleY. */
    ascaleY: number;
    /** The applied local shearX. */
    ashearX: number;
    /** The applied local shearY. */
    ashearY: number;
    sorted: boolean;
    active: boolean;
    /** @param parent May be null. */
    constructor(data: BoneData, skeleton: Skeleton, parent: Bone | null);
    /** Returns false when the bone has not been computed because {@link BoneData#skinRequired} is true and the
     * {@link Skeleton#skin active skin} does not {@link Skin#bones contain} this bone. */
    isActive(): boolean;
    /** Computes the world transform using the parent bone and this bone's local applied transform. */
    update(): void;
    /** Computes the world transform using the parent bone and this bone's local transform.
     *
     * See {@link #updateWorldTransformWith()}. */
    updateWorldTransform(): void;
    /** Computes the world transform using the parent bone and the specified local transform. The applied transform is set to the
     * specified local transform. Child bones are not updated.
     *
     * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
     * Runtimes Guide. */
    updateWorldTransformWith(x: number, y: number, rotation: number, scaleX: number, scaleY: number, shearX: number, shearY: number): void;
    /** Sets this bone's local transform to the setup pose. */
    setToSetupPose(): void;
    /** The world rotation for the X axis, calculated using {@link #a} and {@link #c}. */
    getWorldRotationX(): number;
    /** The world rotation for the Y axis, calculated using {@link #b} and {@link #d}. */
    getWorldRotationY(): number;
    /** The magnitude (always positive) of the world scale X, calculated using {@link #a} and {@link #c}. */
    getWorldScaleX(): number;
    /** The magnitude (always positive) of the world scale Y, calculated using {@link #b} and {@link #d}. */
    getWorldScaleY(): number;
    /** Computes the applied transform values from the world transform.
     *
     * If the world transform is modified (by a constraint, {@link #rotateWorld(float)}, etc) then this method should be called so
     * the applied transform matches the world transform. The applied transform may be needed by other code (eg to apply other
     * constraints).
     *
     * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. The applied transform after
     * calling this method is equivalent to the local transform used to compute the world transform, but may not be identical. */
    updateAppliedTransform(): void;
    /** Transforms a point from world coordinates to the bone's local coordinates. */
    worldToLocal(world: Vector2): Vector2;
    /** Transforms a point from the bone's local coordinates to world coordinates. */
    localToWorld(local: Vector2): Vector2;
    /** Transforms a world rotation to a local rotation. */
    worldToLocalRotation(worldRotation: number): number;
    /** Transforms a local rotation to a world rotation. */
    localToWorldRotation(localRotation: number): number;
    /** Rotates the world transform the specified amount.
     * <p>
     * After changes are made to the world transform, {@link #updateAppliedTransform()} should be called and {@link #update()} will
     * need to be called on any child bones, recursively. */
    rotateWorld(degrees: number): void;
}

/** Stores the setup pose for a {@link Bone}.
 * @public
 * */
export declare class BoneData {
    /** The index of the bone in {@link Skeleton#getBones()}. */
    index: number;
    /** The name of the bone, which is unique across all bones in the skeleton. */
    name: string;
    /** @returns May be null. */
    parent: BoneData | null;
    /** The bone's length. */
    length: number;
    /** The local x translation. */
    x: number;
    /** The local y translation. */
    y: number;
    /** The local rotation. */
    rotation: number;
    /** The local scaleX. */
    scaleX: number;
    /** The local scaleY. */
    scaleY: number;
    /** The local shearX. */
    shearX: number;
    /** The local shearX. */
    shearY: number;
    /** The transform mode for how parent world transforms affect this bone. */
    transformMode: TransformMode;
    /** When true, {@link Skeleton#updateWorldTransform()} only updates this bone if the {@link Skeleton#skin} contains this
     * bone.
     * @see Skin#bones */
    skinRequired: boolean;
    /** The color of the bone as it was in Spine. Available only when nonessential data was exported. Bones are not usually
     * rendered at runtime. */
    color: Color;
    constructor(index: number, name: string, parent: BoneData | null);
}

/**
 * @public
 */
export declare interface BoneTimeline {
    /** The index of the bone in {@link Skeleton#bones} that will be changed. */
    boneIndex: number;
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
    /** Clipping is performed between the clipping polygon's slot and the end slot. Returns null if clipping is done until the end of
     * the skeleton's rendering. */
    endSlot: SlotData | null;
    /** The color of the clipping polygon as it was in Spine. Available only when nonessential data was exported. Clipping polygons
     * are not usually rendered at runtime. */
    color: Color;
    constructor(name: string);
    copy(): Attachment;
}

/** The base class for all constraint datas.
 * @public
 * */
export declare abstract class ConstraintData {
    name: string;
    order: number;
    skinRequired: boolean;
    constructor(name: string, order: number, skinRequired: boolean);
}

/** The base class for timelines that use interpolation between key frame values.
 * @public
 * */
export declare abstract class CurveTimeline extends Timeline {
    protected curves: NumberArrayLike;
    constructor(frameCount: number, bezierCount: number, propertyIds: string[]);
    /** Sets the specified key frame to linear interpolation. */
    setLinear(frame: number): void;
    /** Sets the specified key frame to stepped interpolation. */
    setStepped(frame: number): void;
    /** Shrinks the storage for Bezier curves, for use when <code>bezierCount</code> (specified in the constructor) was larger
     * than the actual number of Bezier curves. */
    shrink(bezierCount: number): void;
    /** Stores the segments for the specified Bezier curve. For timelines that modify multiple values, there may be more than
     * one curve per frame.
     * @param bezier The ordinal of this Bezier curve for this timeline, between 0 and <code>bezierCount - 1</code> (specified
     *           in the constructor), inclusive.
     * @param frame Between 0 and <code>frameCount - 1</code>, inclusive.
     * @param value The index of the value for this frame that this curve is used for.
     * @param time1 The time for the first key.
     * @param value1 The value for the first key.
     * @param cx1 The time for the first Bezier handle.
     * @param cy1 The value for the first Bezier handle.
     * @param cx2 The time of the second Bezier handle.
     * @param cy2 The value for the second Bezier handle.
     * @param time2 The time for the second key.
     * @param value2 The value for the second key. */
    setBezier(bezier: number, frame: number, value: number, time1: number, value1: number, cx1: number, cy1: number, cx2: number, cy2: number, time2: number, value2: number): void;
    /** Returns the Bezier interpolated value for the specified time.
     * @param frameIndex The index into {@link #getFrames()} for the values of the frame before <code>time</code>.
     * @param valueOffset The offset from <code>frameIndex</code> to the value this curve is used for.
     * @param i The index of the Bezier segments. See {@link #getCurveType(int)}. */
    getBezierValue(time: number, frameIndex: number, valueOffset: number, i: number): number;
}

/**
 * @public
 */
export declare abstract class CurveTimeline1 extends CurveTimeline {
    constructor(frameCount: number, bezierCount: number, propertyId: string);
    getFrameEntries(): number;
    /** Sets the time and value for the specified frame.
     * @param frame Between 0 and <code>frameCount</code>, inclusive.
     * @param time The frame time in seconds. */
    setFrame(frame: number, time: number, value: number): void;
    /** Returns the interpolated value for the specified time. */
    getCurveValue(time: number): number;
}

/** The base class for a {@link CurveTimeline} which sets two properties.
 * @public
 * */
export declare abstract class CurveTimeline2 extends CurveTimeline {
    /** @param bezierCount The maximum number of Bezier curves. See {@link #shrink(int)}.
     * @param propertyIds Unique identifiers for the properties the timeline modifies. */
    constructor(frameCount: number, bezierCount: number, propertyId1: string, propertyId2: string);
    getFrameEntries(): number;
    /** Sets the time and values for the specified frame.
     * @param frame Between 0 and <code>frameCount</code>, inclusive.
     * @param time The frame time in seconds. */
    setFrame(frame: number, time: number, value1: number, value2: number): void;
}

/** Changes a slot's {@link Slot#deform} to deform a {@link VertexAttachment}.
 * @public
 * */
export declare class DeformTimeline extends CurveTimeline implements SlotTimeline {
    slotIndex: number;
    /** The attachment that will be deformed. */
    attachment: VertexAttachment;
    /** The vertices for each key frame. */
    vertices: Array<NumberArrayLike>;
    constructor(frameCount: number, bezierCount: number, slotIndex: number, attachment: VertexAttachment);
    getFrameCount(): number;
    /** Sets the time in seconds and the vertices for the specified key frame.
     * @param vertices Vertex positions for an unweighted VertexAttachment, or deform offsets if it has weights. */
    setFrame(frame: number, time: number, vertices: NumberArrayLike): void;
    /** @param value1 Ignored (0 is used for a deform timeline).
     * @param value2 Ignored (1 is used for a deform timeline). */
    setBezier(bezier: number, frame: number, value: number, time1: number, value1: number, cx1: number, cy1: number, cx2: number, cy2: number, time2: number, value2: number): void;
    getCurvePercent(time: number, frame: number): number;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a skeleton's {@link Skeleton#drawOrder}.
 * @public
 * */
export declare class DrawOrderTimeline extends Timeline {
    static propertyIds: string[];
    /** The draw order for each key frame. See {@link #setFrame(int, float, int[])}. */
    drawOrders: Array<Array<number> | null>;
    constructor(frameCount: number);
    getFrameCount(): number;
    /** Sets the time in seconds and the draw order for the specified key frame.
     * @param drawOrder For each slot in {@link Skeleton#slots}, the index of the new draw order. May be null to use setup pose
     *           draw order. */
    setFrame(frame: number, time: number, drawOrder: Array<number> | null): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Stores the current pose values for an {@link Event}.
 *
 * See Timeline {@link Timeline#apply()},
 * AnimationStateListener {@link AnimationStateListener#event()}, and
 * [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide.
 * @public
 * */
declare class Event_2 implements IEvent {
    data: EventData;
    intValue: number;
    floatValue: number;
    stringValue: string | null;
    time: number;
    volume: number;
    balance: number;
    constructor(time: number, data: EventData);
}
export { Event_2 as Event }

/** Stores the setup pose values for an {@link Event}.
 *
 * See [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide.
 * @public
 * */
export declare class EventData implements IEventData {
    name: string;
    intValue: number;
    floatValue: number;
    stringValue: string | null;
    audioPath: string | null;
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
    drain(): void;
    clear(): void;
}

/** Fires an {@link Event} when specific animation times are reached.
 * @public
 * */
export declare class EventTimeline extends Timeline {
    static propertyIds: string[];
    /** The event for each key frame. */
    events: Array<Event_2>;
    constructor(frameCount: number);
    getFrameCount(): number;
    /** Sets the time in seconds and the event for the specified key frame. */
    setFrame(frame: number, event: Event_2): void;
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

/** Stores the current pose for an IK constraint. An IK constraint adjusts the rotation of 1 or 2 constrained bones so the tip of
 * the last bone is as close to the target bone as possible.
 *
 * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide.
 * @public
 * */
export declare class IkConstraint implements Updatable {
    /** The IK constraint's setup pose data. */
    data: IkConstraintData;
    /** The bones that will be modified by this IK constraint. */
    bones: Array<Bone>;
    /** The bone that is the IK target. */
    target: Bone;
    /** Controls the bend direction of the IK bones, either 1 or -1. */
    bendDirection: number;
    /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
    compress: boolean;
    /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
     * and the parent bone has local nonuniform scale, stretch is not applied. */
    stretch: boolean;
    /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
    mix: number;
    /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
    softness: number;
    active: boolean;
    constructor(data: IkConstraintData, skeleton: Skeleton);
    isActive(): boolean;
    update(): void;
    /** Applies 1 bone IK. The target is specified in the world coordinate system. */
    apply1(bone: Bone, targetX: number, targetY: number, compress: boolean, stretch: boolean, uniform: boolean, alpha: number): void;
    /** Applies 2 bone IK. The target is specified in the world coordinate system.
     * @param child A direct descendant of the parent bone. */
    apply2(parent: Bone, child: Bone, targetX: number, targetY: number, bendDir: number, stretch: boolean, uniform: boolean, softness: number, alpha: number): void;
}

/** Stores the setup pose for an {@link IkConstraint}.
 * <p>
 * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide.
 * @public
 * */
export declare class IkConstraintData extends ConstraintData {
    /** The bones that are constrained by this IK constraint. */
    bones: BoneData[];
    /** The bone that is the IK target. */
    private _target;
    set target(boneData: BoneData);
    get target(): BoneData;
    /** Controls the bend direction of the IK bones, either 1 or -1. */
    bendDirection: number;
    /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
    compress: boolean;
    /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
     * and the parent bone has local nonuniform scale, stretch is not applied. */
    stretch: boolean;
    /** When true, only a single bone is being constrained, and {@link #getCompress()} or {@link #getStretch()} is used, the bone
     * is scaled on both the X and Y axes. */
    uniform: boolean;
    /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
    mix: number;
    /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
    softness: number;
    constructor(name: string);
}

/** Changes an IK constraint's {@link IkConstraint#mix}, {@link IkConstraint#softness},
 * {@link IkConstraint#bendDirection}, {@link IkConstraint#stretch}, and {@link IkConstraint#compress}.
 * @public
 * */
export declare class IkConstraintTimeline extends CurveTimeline {
    /** The index of the IK constraint slot in {@link Skeleton#ikConstraints} that will be changed. */
    ikConstraintIndex: number;
    constructor(frameCount: number, bezierCount: number, ikConstraintIndex: number);
    getFrameEntries(): number;
    /** Sets the time in seconds, mix, softness, bend direction, compress, and stretch for the specified key frame. */
    setFrame(frame: number, time: number, mix: number, softness: number, bendDirection: number, compress: boolean, stretch: boolean): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class MeshAttachment extends VertexAttachment implements IMeshAttachment, IHasTextureRegion {
    type: AttachmentType;
    region: TextureRegion | null;
    /** The name of the texture region for this attachment. */
    path: string;
    /** The UV pair for each vertex, normalized within the texture region. */
    regionUVs: Float32Array;
    /** Triplets of vertex indices which describe the mesh's triangulation. */
    triangles: Array<number>;
    /** The color to tint the mesh. */
    color: Color;
    /** The width of the mesh's image. Available only when nonessential data was exported. */
    width: number;
    /** The height of the mesh's image. Available only when nonessential data was exported. */
    height: number;
    /** The number of entries at the beginning of {@link #vertices} that make up the mesh hull. */
    hullLength: number;
    /** Vertex index pairs describing edges for controling triangulation. Mesh triangles will never cross edges. Only available if
     * nonessential data was exported. Triangulation is not performed at runtime. */
    edges: Array<number>;
    private parentMesh;
    sequence: Sequence | null;
    tempColor: Color;
    constructor(name: string, path: string);
    /** The parent mesh if this is a linked mesh, else null. A linked mesh shares the {@link #bones}, {@link #vertices},
     * {@link #regionUVs}, {@link #triangles}, {@link #hullLength}, {@link #edges}, {@link #width}, and {@link #height} with the
     * parent mesh, but may have a different {@link #name} or {@link #path} (and therefore a different texture). */
    getParentMesh(): MeshAttachment;
    /** @param parentMesh May be null. */
    setParentMesh(parentMesh: MeshAttachment): void;
    copy(): Attachment;
    computeWorldVertices(slot: Slot, start: number, count: number, worldVertices: NumberArrayLike, offset: number, stride: number): void;
    /** Returns a new mesh with the {@link #parentMesh} set to this mesh's parent mesh, if any, else to this mesh. **/
    newLinkedMesh(): MeshAttachment;
}

/**
 * @public
 */
export declare class PathAttachment extends VertexAttachment {
    type: AttachmentType;
    /** The lengths along the path in the setup pose from the start of the path to the end of each Bezier curve. */
    lengths: Array<number>;
    /** If true, the start and end knots are connected. */
    closed: boolean;
    /** If true, additional calculations are performed to make calculating positions along the path more accurate. If false, fewer
     * calculations are performed but calculating positions along the path is less accurate. */
    constantSpeed: boolean;
    /** The color of the path as it was in Spine. Available only when nonessential data was exported. Paths are not usually
     * rendered at runtime. */
    color: Color;
    constructor(name: string);
    copy(): Attachment;
}

/** Stores the current pose for a path constraint. A path constraint adjusts the rotation, translation, and scale of the
 * constrained bones so they follow a {@link PathAttachment}.
 *
 * See [Path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide.
 * @public
 * */
export declare class PathConstraint implements Updatable {
    static NONE: number;
    static BEFORE: number;
    static AFTER: number;
    static epsilon: number;
    /** The path constraint's setup pose data. */
    data: PathConstraintData;
    /** The bones that will be modified by this path constraint. */
    bones: Array<Bone>;
    /** The slot whose path attachment will be used to constrained the bones. */
    target: Slot;
    /** The position along the path. */
    position: number;
    /** The spacing between bones. */
    spacing: number;
    mixRotate: number;
    mixX: number;
    mixY: number;
    spaces: number[];
    positions: number[];
    world: number[];
    curves: number[];
    lengths: number[];
    segments: number[];
    active: boolean;
    constructor(data: PathConstraintData, skeleton: Skeleton);
    isActive(): boolean;
    update(): void;
    computeWorldPositions(path: PathAttachment, spacesCount: number, tangents: boolean): number[];
    addBeforePosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
    addAfterPosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
    addCurvePosition(p: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, out: Array<number>, o: number, tangents: boolean): void;
}

/** Stores the setup pose for a {@link PathConstraint}.
 *
 * See [Path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide.
 * @public
 * */
export declare class PathConstraintData extends ConstraintData {
    /** The bones that will be modified by this path constraint. */
    bones: BoneData[];
    /** The slot whose path attachment will be used to constrained the bones. */
    private _target;
    set target(slotData: SlotData);
    get target(): SlotData;
    /** The mode for positioning the first bone on the path. */
    positionMode: PositionMode;
    /** The mode for positioning the bones after the first bone on the path. */
    spacingMode: SpacingMode;
    /** The mode for adjusting the rotation of the bones. */
    rotateMode: RotateMode;
    /** An offset added to the constrained bone rotation. */
    offsetRotation: number;
    /** The position along the path. */
    position: number;
    /** The spacing between bones. */
    spacing: number;
    mixRotate: number;
    mixX: number;
    mixY: number;
    constructor(name: string);
}

/** Changes a transform constraint's {@link PathConstraint#getMixRotate()}, {@link PathConstraint#getMixX()}, and
 * {@link PathConstraint#getMixY()}.
 * @public
 * */
export declare class PathConstraintMixTimeline extends CurveTimeline {
    /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
    pathConstraintIndex: number;
    constructor(frameCount: number, bezierCount: number, pathConstraintIndex: number);
    getFrameEntries(): number;
    setFrame(frame: number, time: number, mixRotate: number, mixX: number, mixY: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a path constraint's {@link PathConstraint#position}.
 * @public
 * */
export declare class PathConstraintPositionTimeline extends CurveTimeline1 {
    /** The index of the path constraint slot in {@link Skeleton#pathConstraints} that will be changed. */
    pathConstraintIndex: number;
    constructor(frameCount: number, bezierCount: number, pathConstraintIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a path constraint's {@link PathConstraint#spacing}.
 * @public
 * */
export declare class PathConstraintSpacingTimeline extends CurveTimeline1 {
    /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
    pathConstraintIndex: number;
    constructor(frameCount: number, bezierCount: number, pathConstraintIndex: number);
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
    /** The color of the point attachment as it was in Spine. Available only when nonessential data was exported. Point attachments
     * are not usually rendered at runtime. */
    color: Color;
    constructor(name: string);
    computeWorldPosition(bone: Bone, point: Vector2): Vector2;
    computeWorldRotation(bone: Bone): number;
    copy(): Attachment;
}

/**
 * @public
 */
export declare class RegionAttachment extends Attachment implements IRegionAttachment, IHasTextureRegion {
    type: AttachmentType;
    /** The local x translation. */
    x: number;
    /** The local y translation. */
    y: number;
    /** The local scaleX. */
    scaleX: number;
    /** The local scaleY. */
    scaleY: number;
    /** The local rotation. */
    rotation: number;
    /** The width of the region attachment in Spine. */
    width: number;
    /** The height of the region attachment in Spine. */
    height: number;
    /** The color to tint the region attachment. */
    color: Color;
    /** The name of the texture region for this attachment. */
    path: string;
    private rendererObject;
    region: TextureRegion | null;
    sequence: Sequence | null;
    /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
     *
     * See {@link #updateOffset()}. */
    offset: NumberArrayLike;
    uvs: NumberArrayLike;
    tempColor: Color;
    constructor(name: string, path: string);
    /** Calculates the {@link #offset} using the region settings. Must be called after changing region settings. */
    updateRegion(): void;
    /** Transforms the attachment's four vertices to world coordinates. If the attachment has a {@link #sequence}, the region may
     * be changed.
     * <p>
     * See <a href="http://esotericsoftware.com/spine-runtime-skeletons#World-transforms">World transforms</a> in the Spine
     * Runtimes Guide.
     * @param worldVertices The output world vertices. Must have a length >= <code>offset</code> + 8.
     * @param offset The <code>worldVertices</code> index to begin writing values.
     * @param stride The number of <code>worldVertices</code> entries between the value pairs written. */
    computeWorldVertices(slot: Slot, worldVertices: NumberArrayLike, offset: number, stride: number): void;
    copy(): Attachment;
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
}

/** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting.
 * @public
 * */
export declare class RGB2Timeline extends CurveTimeline implements SlotTimeline {
    slotIndex: number;
    constructor(frameCount: number, bezierCount: number, slotIndex: number);
    getFrameEntries(): number;
    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame(frame: number, time: number, r: number, g: number, b: number, r2: number, g2: number, b2: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting.
 * @public
 * */
export declare class RGBA2Timeline extends CurveTimeline implements SlotTimeline {
    slotIndex: number;
    constructor(frameCount: number, bezierCount: number, slotIndex: number);
    getFrameEntries(): number;
    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame(frame: number, time: number, r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a slot's {@link Slot#color}.
 * @public
 * */
export declare class RGBATimeline extends CurveTimeline implements SlotTimeline {
    slotIndex: number;
    constructor(frameCount: number, bezierCount: number, slotIndex: number);
    getFrameEntries(): number;
    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame(frame: number, time: number, r: number, g: number, b: number, a: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a slot's {@link Slot#color}.
 * @public
 * */
export declare class RGBTimeline extends CurveTimeline implements SlotTimeline {
    slotIndex: number;
    constructor(frameCount: number, bezierCount: number, slotIndex: number);
    getFrameEntries(): number;
    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame(frame: number, time: number, r: number, g: number, b: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#rotation}.
 * @public
 * */
export declare class RotateTimeline extends CurveTimeline1 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2> | null, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
 * @public
 * */
export declare class ScaleTimeline extends CurveTimeline2 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
 * @public
 * */
export declare class ScaleXTimeline extends CurveTimeline1 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
 * @public
 * */
export declare class ScaleYTimeline extends CurveTimeline1 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/**
 * @public
 */
export declare class Sequence implements ISequence {
    private static _nextID;
    id: number;
    regions: TextureRegion[];
    start: number;
    digits: number;
    /** The index of the region to show for the setup pose. */
    setupIndex: number;
    constructor(count: number);
    copy(): Sequence;
    apply(slot: Slot, attachment: IHasTextureRegion): void;
    getPath(basePath: string, index: number): string;
    private static nextID;
}

/**
 * @public
 */
export declare enum SequenceMode {
    hold = 0,
    once = 1,
    loop = 2,
    pingpong = 3,
    onceReverse = 4,
    loopReverse = 5,
    pingpongReverse = 6
}

/**
 * @public
 */
export declare const SequenceModeValues: SequenceMode[];

/** Changes a slot's {@link Slot#getSequenceIndex()} for an attachment's {@link Sequence}.
 * @public
 * */
export declare class SequenceTimeline extends Timeline implements SlotTimeline {
    static ENTRIES: number;
    static MODE: number;
    static DELAY: number;
    slotIndex: number;
    attachment: IHasTextureRegion;
    constructor(frameCount: number, slotIndex: number, attachment: IHasTextureRegion);
    getFrameEntries(): number;
    getSlotIndex(): number;
    getAttachment(): Attachment;
    /** Sets the time, mode, index, and frame time for the specified frame.
     * @param frame Between 0 and <code>frameCount</code>, inclusive.
     * @param time Seconds between frames. */
    setFrame(frame: number, time: number, mode: SequenceMode, index: number, delay: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
export declare class ShearTimeline extends CurveTimeline2 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
export declare class ShearXTimeline extends CurveTimeline1 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
export declare class ShearYTimeline extends CurveTimeline1 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Stores the current pose for a skeleton.
 *
 * See [Instance objects](http://esotericsoftware.com/spine-runtime-architecture#Instance-objects) in the Spine Runtimes Guide.
 * @public
 * */
export declare class Skeleton implements ISkeleton<SkeletonData, Bone, Slot, Skin> {
    /** The skeleton's setup pose data. */
    data: SkeletonData;
    /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
    bones: Array<Bone>;
    /** The skeleton's slots. */
    slots: Array<Slot>;
    /** The skeleton's slots in the order they should be drawn. The returned array may be modified to change the draw order. */
    drawOrder: Array<Slot>;
    /** The skeleton's IK constraints. */
    ikConstraints: Array<IkConstraint>;
    /** The skeleton's transform constraints. */
    transformConstraints: Array<TransformConstraint>;
    /** The skeleton's path constraints. */
    pathConstraints: Array<PathConstraint>;
    /** The list of bones and constraints, sorted in the order they should be updated, as computed by {@link #updateCache()}. */
    _updateCache: Updatable[];
    /** The skeleton's current skin. May be null. */
    skin: Skin | null;
    /** The color to tint all the skeleton's attachments. */
    color: Color;
    /** Scales the entire skeleton on the X axis. This affects all bones, even if the bone's transform mode disallows scale
     * inheritance. */
    scaleX: number;
    /** Scales the entire skeleton on the Y axis. This affects all bones, even if the bone's transform mode disallows scale
     * inheritance. */
    scaleY: number;
    /** Sets the skeleton X position, which is added to the root bone worldX position. */
    x: number;
    /** Sets the skeleton Y position, which is added to the root bone worldY position. */
    y: number;
    constructor(data: SkeletonData);
    /** Caches information about bones and constraints. Must be called if the {@link #getSkin()} is modified or if bones,
     * constraints, or weighted path attachments are added or removed. */
    updateCache(): void;
    sortIkConstraint(constraint: IkConstraint): void;
    sortPathConstraint(constraint: PathConstraint): void;
    sortTransformConstraint(constraint: TransformConstraint): void;
    sortPathConstraintAttachment(skin: Skin, slotIndex: number, slotBone: Bone): void;
    sortPathConstraintAttachmentWith(attachment: Attachment, slotBone: Bone): void;
    sortBone(bone: Bone): void;
    sortReset(bones: Array<Bone>): void;
    /** Updates the world transform for each bone and applies all constraints.
     *
     * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
     * Runtimes Guide. */
    updateWorldTransform(): void;
    updateWorldTransformWith(parent: Bone): void;
    /** Sets the bones, constraints, and slots to their setup pose values. */
    setToSetupPose(): void;
    /** Sets the bones and constraints to their setup pose values. */
    setBonesToSetupPose(): void;
    /** Sets the slots and draw order to their setup pose values. */
    setSlotsToSetupPose(): void;
    /** @returns May return null. */
    getRootBone(): Bone;
    /** @returns May be null. */
    findBone(boneName: string): Bone;
    /** @returns -1 if the bone was not found. */
    findBoneIndex(boneName: string): number;
    /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
     * repeatedly.
     * @returns May be null. */
    findSlot(slotName: string): Slot;
    /** @returns -1 if the bone was not found. */
    findSlotIndex(slotName: string): number;
    /** Sets a skin by name.
     *
     * See {@link #setSkin()}. */
    setSkinByName(skinName: string): void;
    /** Sets the skin used to look up attachments before looking in the {@link SkeletonData#defaultSkin default skin}. If the
     * skin is changed, {@link #updateCache()} is called.
     *
     * Attachments from the new skin are attached if the corresponding attachment from the old skin was attached. If there was no
     * old skin, each slot's setup mode attachment is attached from the new skin.
     *
     * After changing the skin, the visible attachments can be reset to those attached in the setup pose by calling
     * {@link #setSlotsToSetupPose()}. Also, often {@link AnimationState#apply()} is called before the next time the
     * skeleton is rendered to allow any attachment keys in the current animation(s) to hide or show attachments from the new skin.
     * @param newSkin May be null. */
    setSkin(newSkin: Skin): void;
    /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot name and attachment
     * name.
     *
     * See {@link #getAttachment()}.
     * @returns May be null. */
    getAttachmentByName(slotName: string, attachmentName: string): Attachment | null;
    /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot index and
     * attachment name. First the skin is checked and if the attachment was not found, the default skin is checked.
     *
     * See [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
     * @returns May be null. */
    getAttachment(slotIndex: number, attachmentName: string): Attachment | null;
    /** A convenience method to set an attachment by finding the slot with {@link #findSlot()}, finding the attachment with
     * {@link #getAttachment()}, then setting the slot's {@link Slot#attachment}.
     * @param attachmentName May be null to clear the slot's attachment. */
    setAttachment(slotName: string, attachmentName: string): void;
    /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
     * than to call it repeatedly.
     * @return May be null. */
    findIkConstraint(constraintName: string): IkConstraint;
    /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
     * this method than to call it repeatedly.
     * @return May be null. */
    findTransformConstraint(constraintName: string): TransformConstraint;
    /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
     * than to call it repeatedly.
     * @return May be null. */
    findPathConstraint(constraintName: string): PathConstraint;
    /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose as `{ x: number, y: number, width: number, height: number }`.
     * Note that this method will create temporary objects which can add to garbage collection pressure. Use `getBounds()` if garbage collection is a concern. */
    getBoundsRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
     * @param offset An output value, the distance from the skeleton origin to the bottom left corner of the AABB.
     * @param size An output value, the width and height of the AABB.
     * @param temp Working memory to temporarily store attachments' computed world vertices. */
    getBounds(offset: Vector2, size: Vector2, temp?: Array<number>): void;
    get flipX(): boolean;
    set flipX(value: boolean);
    get flipY(): boolean;
    set flipY(value: boolean);
    private static deprecatedWarning1;
}

/** Loads skeleton data in the Spine binary format.
 *
 * See [Spine binary format](http://esotericsoftware.com/spine-binary-format) and
 * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
 * Runtimes Guide.
 * @public
 * */
export declare class SkeletonBinary {
    ver40: boolean;
    static BlendModeValues: BLEND_MODES[];
    /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
     * runtime than were used in Spine.
     *
     * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
    scale: number;
    attachmentLoader: AttachmentLoader;
    private linkedMeshes;
    constructor(attachmentLoader: AttachmentLoader);
    readSkeletonData(binary: Uint8Array): SkeletonData;
    private readSkin;
    private readAttachment;
    private readSequence;
    private readDeformTimelineType;
    private readVertices;
    private readFloatArray;
    private readShortArray;
    private readAnimation;
}

/** Collects each visible {@link BoundingBoxAttachment} and computes the world vertices for its polygon. The polygon vertices are
 * provided along with convenience methods for doing hit detection.
 * @public
 * */
export declare class SkeletonBounds extends SkeletonBoundsBase<BoundingBoxAttachment> {
}

/** Stores the setup pose and all of the stateless data for a skeleton.
 *
 * See [Data objects](http://esotericsoftware.com/spine-runtime-architecture#Data-objects) in the Spine Runtimes
 * Guide.
 * @public
 * */
export declare class SkeletonData implements ISkeletonData<BoneData, SlotData, Skin, Animation_2, EventData, IkConstraintData, TransformConstraintData, PathConstraintData> {
    /** The skeleton's name, which by default is the name of the skeleton data file, if possible. May be null. */
    name: string | null;
    /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
    bones: BoneData[];
    /** The skeleton's slots. */
    slots: SlotData[];
    skins: Skin[];
    /** The skeleton's default skin. By default this skin contains all attachments that were not in a skin in Spine.
     *
     * See {@link Skeleton#getAttachmentByName()}.
     * May be null. */
    defaultSkin: Skin | null;
    /** The skeleton's events. */
    events: EventData[];
    /** The skeleton's animations. */
    animations: Animation_2[];
    /** The skeleton's IK constraints. */
    ikConstraints: IkConstraintData[];
    /** The skeleton's transform constraints. */
    transformConstraints: TransformConstraintData[];
    /** The skeleton's path constraints. */
    pathConstraints: PathConstraintData[];
    /** The X coordinate of the skeleton's axis aligned bounding box in the setup pose. */
    x: number;
    /** The Y coordinate of the skeleton's axis aligned bounding box in the setup pose. */
    y: number;
    /** The width of the skeleton's axis aligned bounding box in the setup pose. */
    width: number;
    /** The height of the skeleton's axis aligned bounding box in the setup pose. */
    height: number;
    /** The Spine version used to export the skeleton data, or null. */
    version: string | null;
    /** The skeleton data hash. This value will change if any of the skeleton data has changed. May be null. */
    hash: string | null;
    /** The dopesheet FPS in Spine. Available only when nonessential data was exported. */
    fps: number;
    /** The path to the images directory as defined in Spine. Available only when nonessential data was exported. May be null. */
    imagesPath: string | null;
    /** The path to the audio directory as defined in Spine. Available only when nonessential data was exported. May be null. */
    audioPath: string | null;
    /** Finds a bone by comparing each bone's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findBone(boneName: string): BoneData;
    /** removed from spine-ts runtime **/
    findBoneIndex(boneName: string): number;
    /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findSlot(slotName: string): SlotData;
    /** removed from spine-ts runtime **/
    findSlotIndex(slotName: string): number;
    /** Finds a skin by comparing each skin's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findSkin(skinName: string): Skin;
    /** Finds an event by comparing each events's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findEvent(eventDataName: string): EventData;
    /** Finds an animation by comparing each animation's name. It is more efficient to cache the results of this method than to
     * call it multiple times.
     * @returns May be null. */
    findAnimation(animationName: string): Animation_2;
    /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
     * than to call it multiple times.
     * @return May be null. */
    findIkConstraint(constraintName: string): IkConstraintData;
    /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
     * this method than to call it multiple times.
     * @return May be null. */
    findTransformConstraint(constraintName: string): TransformConstraintData;
    /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
     * than to call it multiple times.
     * @return May be null. */
    findPathConstraint(constraintName: string): PathConstraintData;
    /** removed from spine-ts runtime **/ findPathConstraintIndex(pathConstraintName: string): number;
}

/** Loads skeleton data in the Spine JSON format.
 *
 * See [Spine JSON format](http://esotericsoftware.com/spine-json-format) and
 * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
 * Runtimes Guide.
 * @public
 * */
export declare class SkeletonJson {
    attachmentLoader: AttachmentLoader;
    /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
     * runtime than were used in Spine.
     *
     * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
    scale: number;
    private linkedMeshes;
    constructor(attachmentLoader: AttachmentLoader);
    readSkeletonData(json: string | any): SkeletonData;
    readAttachment(map: any, skin: Skin, slotIndex: number, name: string, skeletonData: SkeletonData): Attachment | null;
    readSequence(map: any): Sequence;
    readVertices(map: any, attachment: VertexAttachment, verticesLength: number): void;
    readAnimation(map: any, name: string, skeletonData: SkeletonData): void;
    static blendModeFromString(str: string): BLEND_MODES.NORMAL | BLEND_MODES.ADD | BLEND_MODES.MULTIPLY | BLEND_MODES.SCREEN;
}

/** Stores attachments by slot index and attachment name.
 *
 * See SkeletonData {@link SkeletonData#defaultSkin}, Skeleton {@link Skeleton#skin}, and
 * [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
 * @public
 * */
export declare class Skin implements ISkin {
    /** The skin's name, which is unique across all skins in the skeleton. */
    name: string;
    attachments: StringMap<Attachment>[];
    bones: BoneData[];
    constraints: ConstraintData[];
    constructor(name: string);
    /** Adds an attachment to the skin for the specified slot index and name. */
    setAttachment(slotIndex: number, name: string, attachment: Attachment): void;
    /** Adds all attachments, bones, and constraints from the specified skin to this skin. */
    addSkin(skin: Skin): void;
    /** Adds all bones and constraints and copies of all attachments from the specified skin to this skin. Mesh attachments are not
     * copied, instead a new linked mesh is created. The attachment copies can be modified without affecting the originals. */
    copySkin(skin: Skin): void;
    /** Returns the attachment for the specified slot index and name, or null. */
    getAttachment(slotIndex: number, name: string): Attachment | null;
    /** Removes the attachment in the skin for the specified slot index and name, if any. */
    removeAttachment(slotIndex: number, name: string): void;
    /** Returns all attachments in this skin. */
    getAttachments(): Array<SkinEntry>;
    /** Returns all attachments in this skin for the specified slot index. */
    getAttachmentsForSlot(slotIndex: number, attachments: Array<SkinEntry>): void;
    /** Clears all attachments, bones, and constraints. */
    clear(): void;
    /** Attach each attachment in this skin if the corresponding attachment in the old skin is currently attached. */
    attachAll(skeleton: Skeleton, oldSkin: Skin): void;
}

/** Stores an entry in the skin consisting of the slot index, name, and attachment
 * @public
 * **/
export declare class SkinEntry {
    slotIndex: number;
    name: string;
    attachment: Attachment;
    constructor(slotIndex: number, name: string, attachment: Attachment);
}

/** Stores a slot's current pose. Slots organize attachments for {@link Skeleton#drawOrder} purposes and provide a place to store
 * state for an attachment. State cannot be stored in an attachment itself because attachments are stateless and may be shared
 * across multiple skeletons.
 * @public
 * */
export declare class Slot implements ISlot {
    blendMode: number;
    /** The slot's setup pose data. */
    data: SlotData;
    /** The bone this slot belongs to. */
    bone: Bone;
    /** The color used to tint the slot's attachment. If {@link #getDarkColor()} is set, this is used as the light color for two
     * color tinting. */
    color: Color;
    /** The dark color used to tint the slot's attachment for two color tinting, or null if two color tinting is not used. The dark
     * color's alpha is not used. */
    darkColor: Color | null;
    attachment: Attachment | null;
    attachmentState: number;
    /** The index of the texture region to display when the slot's attachment has a {@link Sequence}. -1 represents the
     * {@link Sequence#getSetupIndex()}. */
    sequenceIndex: number;
    /** Values to deform the slot's attachment. For an unweighted mesh, the entries are local positions for each vertex. For a
     * weighted mesh, the entries are an offset for each vertex which will be added to the mesh's local vertex positions.
     *
     * See {@link VertexAttachment#computeWorldVertices()} and {@link DeformTimeline}. */
    deform: number[];
    constructor(data: SlotData, bone: Bone);
    /** The skeleton this slot belongs to. */
    getSkeleton(): Skeleton;
    /** The current attachment for the slot, or null if the slot has no attachment. */
    getAttachment(): Attachment | null;
    /** Sets the slot's attachment and, if the attachment changed, resets {@link #sequenceIndex} and clears the {@link #deform}.
     * The deform is not cleared if the old attachment has the same {@link VertexAttachment#getTimelineAttachment()} as the
     * specified attachment. */
    setAttachment(attachment: Attachment | null): void;
    /** Sets this slot to the setup pose. */
    setToSetupPose(): void;
}

/** Stores the setup pose for a {@link Slot}.
 * @public
 * */
export declare class SlotData implements ISlotData {
    /** The index of the slot in {@link Skeleton#getSlots()}. */
    index: number;
    /** The name of the slot, which is unique across all slots in the skeleton. */
    name: string;
    /** The bone this slot belongs to. */
    boneData: BoneData;
    /** The color used to tint the slot's attachment. If {@link #getDarkColor()} is set, this is used as the light color for two
     * color tinting. */
    color: Color;
    /** The dark color used to tint the slot's attachment for two color tinting, or null if two color tinting is not used. The dark
     * color's alpha is not used. */
    darkColor: Color | null;
    /** The name of the attachment that is visible for this slot in the setup pose, or null if no attachment is visible. */
    attachmentName: string | null;
    /** The blend mode for drawing the slot's attachment. */
    blendMode: BLEND_MODES;
    constructor(index: number, name: string, boneData: BoneData);
}

/**
 * @public
 */
export declare interface SlotTimeline {
    /** The index of the slot in {@link Skeleton#slots} that will be changed. */
    slotIndex: number;
}

/** Controls how bones after the first bone are positioned along the path.
 *
 * [Spacing mode](http://esotericsoftware.com/spine-path-constraints#Spacing-mode) in the Spine User Guide.
 * @public
 * */
export declare enum SpacingMode {
    Length = 0,
    Fixed = 1,
    Percent = 2,
    Proportional = 3
}

/**
 * @public
 */
export declare class Spine extends SpineBase<Skeleton, SkeletonData, AnimationState, AnimationStateData> {
    createSkeleton(spineData: SkeletonData): void;
}

/** The interface for all timelines.
 * @public
 * */
export declare abstract class Timeline implements ITimeline {
    propertyIds: string[];
    frames: NumberArrayLike;
    constructor(frameCount: number, propertyIds: string[]);
    getPropertyIds(): string[];
    getFrameEntries(): number;
    getFrameCount(): number;
    getDuration(): number;
    abstract apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2> | null, alpha: number, blend: MixBlend, direction: MixDirection): void;
    static search1(frames: NumberArrayLike, time: number): number;
    static search(frames: NumberArrayLike, time: number, step: number): number;
}

/** Stores settings and other state for the playback of an animation on an {@link AnimationState} track.
 *
 * References to a track entry must not be kept after the {@link AnimationStateListener#dispose()} event occurs.
 * @public
 * */
export declare class TrackEntry implements ITrackEntry {
    /** The animation to apply for this track entry. */
    animation: Animation_2 | null;
    previous: TrackEntry | null;
    /** The animation queued to start after this animation, or null. `next` makes up a linked list. */
    next: TrackEntry | null;
    /** The track entry for the previous animation when mixing from the previous animation to this animation, or null if no
     * mixing is currently occuring. When mixing from multiple animations, `mixingFrom` makes up a linked list. */
    mixingFrom: TrackEntry | null;
    /** The track entry for the next animation when mixing from this animation to the next animation, or null if no mixing is
     * currently occuring. When mixing to multiple animations, `mixingTo` makes up a linked list. */
    mixingTo: TrackEntry | null;
    /** The listener for events generated by this track entry, or null.
     *
     * A track entry returned from {@link AnimationState#setAnimation()} is already the current animation
     * for the track, so the track entry listener {@link AnimationStateListener#start()} will not be called. */
    listener: AnimationStateListener | null;
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
    reverse: boolean;
    shortestRotation: boolean;
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
    getTrackComplete(): number;
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

/** Stores the current pose for a transform constraint. A transform constraint adjusts the world transform of the constrained
 * bones to match that of the target bone.
 *
 * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide.
 * @public
 * */
export declare class TransformConstraint implements Updatable {
    /** The transform constraint's setup pose data. */
    data: TransformConstraintData;
    /** The bones that will be modified by this transform constraint. */
    bones: Array<Bone>;
    /** The target bone whose world transform will be copied to the constrained bones. */
    target: Bone;
    mixRotate: number;
    mixX: number;
    mixY: number;
    mixScaleX: number;
    mixScaleY: number;
    mixShearY: number;
    temp: Vector2;
    active: boolean;
    constructor(data: TransformConstraintData, skeleton: Skeleton);
    isActive(): boolean;
    update(): void;
    applyAbsoluteWorld(): void;
    applyRelativeWorld(): void;
    applyAbsoluteLocal(): void;
    applyRelativeLocal(): void;
}

/** Stores the setup pose for a {@link TransformConstraint}.
 *
 * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide.
 * @public
 * */
export declare class TransformConstraintData extends ConstraintData {
    /** The bones that will be modified by this transform constraint. */
    bones: BoneData[];
    /** The target bone whose world transform will be copied to the constrained bones. */
    private _target;
    set target(boneData: BoneData);
    get target(): BoneData;
    mixRotate: number;
    mixX: number;
    mixY: number;
    mixScaleX: number;
    mixScaleY: number;
    mixShearY: number;
    /** An offset added to the constrained bone rotation. */
    offsetRotation: number;
    /** An offset added to the constrained bone X translation. */
    offsetX: number;
    /** An offset added to the constrained bone Y translation. */
    offsetY: number;
    /** An offset added to the constrained bone scaleX. */
    offsetScaleX: number;
    /** An offset added to the constrained bone scaleY. */
    offsetScaleY: number;
    /** An offset added to the constrained bone shearY. */
    offsetShearY: number;
    relative: boolean;
    local: boolean;
    constructor(name: string);
}

/** Changes a transform constraint's {@link TransformConstraint#rotateMix}, {@link TransformConstraint#translateMix},
 * {@link TransformConstraint#scaleMix}, and {@link TransformConstraint#shearMix}.
 * @public
 * */
export declare class TransformConstraintTimeline extends CurveTimeline {
    /** The index of the transform constraint slot in {@link Skeleton#transformConstraints} that will be changed. */
    transformConstraintIndex: number;
    constructor(frameCount: number, bezierCount: number, transformConstraintIndex: number);
    getFrameEntries(): number;
    /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for the specified key frame. */
    setFrame(frame: number, time: number, mixRotate: number, mixX: number, mixY: number, mixScaleX: number, mixScaleY: number, mixShearY: number): void;
    apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#x} and {@link Bone#y}.
 * @public
 * */
export declare class TranslateTimeline extends CurveTimeline2 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#x}.
 * @public
 * */
export declare class TranslateXTimeline extends CurveTimeline1 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** Changes a bone's local {@link Bone#x}.
 * @public
 * */
export declare class TranslateYTimeline extends CurveTimeline1 implements BoneTimeline {
    boneIndex: number;
    constructor(frameCount: number, bezierCount: number, boneIndex: number);
    apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event_2>, alpha: number, blend: MixBlend, direction: MixDirection): void;
}

/** The interface for items updated by {@link Skeleton#updateWorldTransform()}.
 * @public
 * */
export declare interface Updatable {
    update(): void;
    /** Returns false when this item has not been updated because a skin is required and the {@link Skeleton#skin active skin}
     * does not contain this item.
     * @see Skin#getBones()
     * @see Skin#getConstraints() */
    isActive(): boolean;
}

/**
 * Base class for an attachment with vertices that are transformed by one or more bones and can be deformed by a slot's
 * {@link Slot#deform}.
 * @public
 */
export declare abstract class VertexAttachment extends Attachment {
    private static nextID;
    /** The unique ID for this attachment. */
    id: number;
    /** The bones which affect the {@link #getVertices()}. The array entries are, for each vertex, the number of bones affecting
     * the vertex followed by that many bone indices, which is the index of the bone in {@link Skeleton#bones}. Will be null
     * if this attachment has no weights. */
    bones: Array<number> | null;
    /** The vertex positions in the bone's coordinate system. For a non-weighted attachment, the values are `x,y`
     * entries for each vertex. For a weighted attachment, the values are `x,y,weight` entries for each bone affecting
     * each vertex. */
    vertices: NumberArrayLike;
    /** The maximum number of world vertex values that can be output by
     * {@link #computeWorldVertices()} using the `count` parameter. */
    worldVerticesLength: number;
    /** Timelines for the timeline attachment are also applied to this attachment.
     * May be null if no attachment-specific timelines should be applied. */
    timelineAttachment: Attachment;
    constructor(name: string);
    computeWorldVerticesOld(slot: Slot, worldVertices: ArrayLike<number>): void;
    /** Transforms the attachment's local {@link #vertices} to world coordinates. If the slot's {@link Slot#deform} is
     * not empty, it is used to deform the vertices.
     *
     * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
     * Runtimes Guide.
     * @param start The index of the first {@link #vertices} value to transform. Each vertex has 2 values, x and y.
     * @param count The number of world vertex values to output. Must be <= {@link #worldVerticesLength} - `start`.
     * @param worldVertices The output world vertices. Must have a length >= `offset` + `count` *
     *           `stride` / 2.
     * @param offset The `worldVertices` index to begin writing values.
     * @param stride The number of `worldVertices` entries between the value pairs written. */
    computeWorldVertices(slot: Slot, start: number, count: number, worldVertices: NumberArrayLike, offset: number, stride: number): void;
    /** Does not copy id (generated) or name (set on construction). **/
    copyTo(attachment: VertexAttachment): void;
}

export { }
