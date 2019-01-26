// @flow
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { clamp, normalize, throttle } from '../../utils';
import {
  getScaledCanvasProps,
  getDevicePixelRatio,
} from '../../helpers/canvas.helpers';
import useBoundingBox from '../../hooks/bounding-box.hook';

import { generateDotCoords, getColorForColIndex } from './TouchSlider.helpers';

import UnstyledButton from '../UnstyledButton';

import type { Colorway } from './TouchSlider.helpers';

type Props = {
  value: number,
  updateValue: (num: number) => void,
  width: number,
  height: number,
  isDisabled?: boolean,
  // Aesthetic choices
  dotSize: number,
  colorway: Colorway,
};

// All sliders expect values to be between 0 and 100
const min = 0;
const max = 100;

const useOffscreenCanvasIfAvailable = (
  canvasRef,
  devicePixelRatio,
  width,
  height,
  value,
  hoveredValue,
  dotSize,
  colorway
) => {
  // No SSR
  if (typeof window === 'undefined') {
    return;
  }

  const supportsOffscreenCanvas = 'OffscreenCanvas' in window;

  const contextRef = useRef(null);

  // On mount
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    // If the browser supports it, we want to allow the canvas to be painted
    // off of the main thread.
    if (supportsOffscreenCanvas) {
      canvasRef.current = canvasRef.current.transferControlToOffscreen();
    }

    contextRef.current = canvasRef.current.getContext('2d');
    contextRef.current.scale(devicePixelRatio, devicePixelRatio);
  }, []);

  // On every update
  const handleUpdate = () => {
    const ctx = contextRef.current;

    if (!ctx) {
      return;
    }

    const { dotCoords, numOfCols } = generateDotCoords(width, height, dotSize);

    const numOfSelectedDots = Math.round(dotCoords.length * (value / max));

    const numOfHoveredDots = hoveredValue
      ? Math.round(dotCoords.length * (hoveredValue / max))
      : null;

    const numToDisplay = Math.max(numOfSelectedDots, numOfHoveredDots || 0);

    ctx.clearRect(0, 0, width, height);

    dotCoords.slice(0, numToDisplay).forEach(([x, y, colIndex], index) => {
      ctx.beginPath();
      ctx.arc(x, y, dotSize / 2, 0, 2 * Math.PI);
      ctx.fillStyle = getColorForColIndex(colorway, colIndex, numOfCols);

      let opacity = 1;
      if (index + 1 > numOfSelectedDots) {
        opacity = 0.25;
      }

      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.closePath();
    });
  };
  useEffect(throttle(handleUpdate, 25));
};

const TouchSlider = ({
  value,
  updateValue,
  width,
  height,
  isDisabled,
  dotSize,
  colorway,
}: Props) => {
  if (typeof width !== 'number') {
    throw new Error('Please give TouchSlider an explicit width');
  }

  const [dragging, setDragging] = useState(false);
  const [hoveredValue, setHoveredValue] = useState(null);

  const [ref, boundingBox] = useBoundingBox();
  const canvasRef = useRef(null);

  const scaledCanvasProps = getScaledCanvasProps(width, height);

  useOffscreenCanvasIfAvailable(
    canvasRef,
    getDevicePixelRatio(),
    width,
    height,
    value,
    hoveredValue,
    dotSize,
    colorway
  );

  const calculateAndSetNewValue = (ev, setter = updateValue) => {
    if (!boundingBox || isDisabled) {
      return;
    }

    // Figure out what value this click represents, from 0-100.
    // We want to make it easier to select edge values (0 and 100), so we'll
    // pad it a bit
    const CLICK_PADDING_AMOUNT = 8;
    const paddedBoundingBox = {
      left: boundingBox.left + CLICK_PADDING_AMOUNT,
      width: boundingBox.width - CLICK_PADDING_AMOUNT * 2,
    };
    const relativeLeft = ev.clientX - paddedBoundingBox.left;
    const ratio = clamp(relativeLeft / paddedBoundingBox.width, 0, 1);

    const newValue = normalize(ratio, 0, 1, min, max);

    setter(newValue);
  };

  useEffect(
    () => {
      if (!dragging || !document.body) {
        return;
      }

      document.body.style.cursor = 'pointer';

      const handleMouseUp = () => {
        setDragging(false);
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', calculateAndSetNewValue);

      return () => {
        // $FlowIgnore
        document.body.style.cursor = null;

        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', calculateAndSetNewValue);
      };
    },
    [dragging]
  );

  return (
    <UnstyledButton
      ref={ref}
      tabIndex={isDisabled ? -1 : undefined}
      onKeyDown={ev => {
        const incrementAmount = 3;

        switch (ev.key) {
          case 'ArrowLeft': {
            const newValue = clamp(value - incrementAmount, 0, 100);
            updateValue(newValue);
            break;
          }
          case 'ArrowRight': {
            const newValue = clamp(value + incrementAmount, 0, 100);
            updateValue(newValue);
            break;
          }
        }
      }}
    >
      <Canvas
        ref={canvasRef}
        {...scaledCanvasProps}
        onMouseDown={ev => {
          setDragging(true);
          setHoveredValue(null);
          calculateAndSetNewValue(ev);
        }}
        onMouseMove={ev => {
          // When the user hovers over the space, set the hover value
          if (ev.buttons === 0) {
            calculateAndSetNewValue(ev, setHoveredValue);
          }
        }}
        onMouseLeave={() => {
          setHoveredValue(null);
        }}
      />
    </UnstyledButton>
  );
};

TouchSlider.defaultProps = {
  dotSize: 3,
  colorway: 'cool',
};

const Canvas = styled.canvas`
  display: block;
  cursor: pointer;
`;

export default TouchSlider;
