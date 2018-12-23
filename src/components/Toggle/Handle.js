// @flow
import React from 'react';
import styled from 'styled-components';

const Handle = ({ size }) => (
  <svg
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    style={{ display: 'block' }}
  >
    <circle cx="11.2272" cy="11.4802" r="10" fill="#000000" fillOpacity="0.4" />
    <circle cx="10" cy="10" r="10" fill="url(#toggle-handle-0)" />
    <circle
      cx="9.5"
      cy="8.5"
      r="7.5"
      fill="url(#toggle-handle-1)"
      fillOpacity="0.5"
    />
    <circle
      cx="10"
      cy="10"
      r="10"
      transform="rotate(-90 10 10)"
      fill="url(#toggle-handle-2)"
      fillOpacity="0.5"
      style={{ mixBlendMode: 'hard-light' }}
    />
    <defs>
      <radialGradient
        id="toggle-handle-0"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(10 10) rotate(90) scale(10)"
      >
        <stop stopColor="#FF27FF" />
        <stop offset="1" stopColor="#F218BC" />
      </radialGradient>
      <linearGradient
        id="toggle-handle-1"
        x1="4.14286"
        y1="-0.730769"
        x2="11.3164"
        y2="10.9262"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="0.684545" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="toggle-handle-2"
        x1="6"
        y1="30.6667"
        x2="12.9067"
        y2="13.5586"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default Handle;
