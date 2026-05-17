import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path, Text as SvgText, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { WheelOption } from '@/types';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - 32, 340);
const RADIUS = WHEEL_SIZE / 2;
const CENTER = RADIUS;

const NEON = ['#FF3CAC','#FF6B35','#FFD23F','#3BF4FB','#A855F7','#22D3EE','#F59E0B','#10B981','#EC4899','#6366F1'];

export interface SpinWheelRef {
  spin: (onFinish: (winner: WheelOption) => void) => void;
  isSpinning: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`, 'Z'].join(' ');
}

const AnimatedG = Animated.createAnimatedComponent(G);

const SpinWheel = forwardRef<SpinWheelRef, { options: WheelOption[] }>(({ options }, ref) => {
  const rotation = useSharedValue(0);
  const spinning = useSharedValue(false);

  const spin = useCallback((onFinish: (winner: WheelOption) => void) => {
    if (spinning.value || options.length === 0) return;
    spinning.value = true;
    const sliceAngle = 360 / options.length;
    const extraSpins = (5 + Math.floor(Math.random() * 5)) * 360;
    const landingOffset = Math.random() * 360;
    const totalRotation = rotation.value + extraSpins + landingOffset;
    rotation.value = withTiming(totalRotation, { duration: 4500, easing: Easing.bezier(0.17, 0.67, 0.12, 0.99) }, (finished) => {
      if (finished) {
        spinning.value = false;
        const normalised = ((totalRotation % 360) + 360) % 360;
        const pointerAngle = (360 - normalised + 360) % 360;
        const idx = Math.floor(pointerAngle / sliceAngle) % options.length;
        runOnJS(onFinish)(options[idx]);
      }
    });
  }, [options, rotation, spinning]);

  useImperativeHandle(ref, () => ({ spin, get isSpinning() { return spinning.value; } }));

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  if (options.length === 0) return null;
  const sliceAngle = 360 / options.length;

  return (
    <View style={styles.container}>
      <View style={styles.glowRing} />
      <View style={styles.pointerContainer}>
        <View style={styles.pointer} />
      </View>
      <Animated.View style={[styles.wheelWrapper, animatedStyle]}>
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
          <Defs>
            <RadialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#2A2A3E" />
              <Stop offset="100%" stopColor="#12121A" />
            </RadialGradient>
          </Defs>
          {options.map((opt, i) => {
            const startAngle = i * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            const textPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.62, midAngle);
            const path = buildSlicePath(CENTER, CENTER, RADIUS - 2, startAngle, endAngle);
            return (
              <G key={opt.id}>
                <Path d={path} fill={opt.color ?? NEON[i % NEON.length]} stroke="#0A0A0F" strokeWidth={2} />
                <SvgText x={textPos.x} y={textPos.y} textAnchor="middle" alignmentBaseline="middle" fill="#fff" fontSize={options.length > 8 ? 10 : 13} fontWeight="700" rotation={midAngle} origin={`${textPos.x}, ${textPos.y}`}>
                  {opt.label.length > 10 ? opt.label.slice(0, 9) + '…' : opt.label}
                </SvgText>
              </G>
            );
          })}
          <Circle cx={CENTER} cy={CENTER} r={28} fill="url(#centerGrad)" stroke="#FF3CAC" strokeWidth={2} />
          <Circle cx={CENTER} cy={CENTER} r={10} fill="#FF3CAC" />
        </Svg>
      </Animated.View>
    </View>
  );
});

SpinWheel.displayName = 'SpinWheel';
export default SpinWheel;

const styles = StyleSheet.create({
  container: { width: WHEEL_SIZE, height: WHEEL_SIZE, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  glowRing: { position: 'absolute', width: WHEEL_SIZE + 20, height: WHEEL_SIZE + 20, borderRadius: (WHEEL_SIZE + 20) / 2, borderWidth: 2, borderColor: 'rgba(255, 60, 172, 0.4)', shadowColor: '#FF3CAC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 24 },
  wheelWrapper: { width: WHEEL_SIZE, height: WHEEL_SIZE },
  pointerContainer: { position: 'absolute', top: -18, zIndex: 10, alignItems: 'center' },
  pointer: { width: 0, height: 0, borderLeftWidth: 14, borderRightWidth: 14, borderBottomWidth: 36, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FF3CAC', shadowColor: '#FF3CAC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10 },
});
