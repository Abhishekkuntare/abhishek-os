import React, { useEffect, useId, useRef, useState } from 'react';

interface TrackingFaceProps {
  size?: number;
  className?: string;
}

export const TrackingFace: React.FC<TrackingFaceProps> = ({
  size = 32,
  className = '',
}) => {
  const gradientId = useId().replace(/:/g, '');
  const faceRef = useRef<SVGSVGElement>(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let blinkTimer = 0;
    let reopenTimer = 0;
    let reactionTimer = 0;

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setIsBlinking(true);
        reopenTimer = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 130);
      }, 2600 + Math.random() * 2800);
    };

    const trackPointer = (event: PointerEvent) => {
      const faceBounds = faceRef.current?.getBoundingClientRect();
      setIsHovered(Boolean(
        faceBounds &&
        event.clientX >= faceBounds.left &&
        event.clientX <= faceBounds.right &&
        event.clientY >= faceBounds.top &&
        event.clientY <= faceBounds.bottom,
      ));
      const bounds = document.documentElement.getBoundingClientRect();
      const x = (event.clientX / bounds.width - 0.5) * 2;
      const y = (event.clientY / bounds.height - 0.5) * 2;
      setGaze({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };

    const reactToClick = () => {
      setIsReacting(true);
      setIsBlinking(true);
      window.clearTimeout(reactionTimer);
      reactionTimer = window.setTimeout(() => {
        setIsBlinking(false);
        reactionTimer = window.setTimeout(() => setIsReacting(false), 420);
      }, 180);
    };

    scheduleBlink();
    window.addEventListener('pointermove', trackPointer, { passive: true });
    window.addEventListener('pointerdown', reactToClick, { passive: true });

    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(reopenTimer);
      window.clearTimeout(reactionTimer);
      window.removeEventListener('pointermove', trackPointer);
      window.removeEventListener('pointerdown', reactToClick);
    };
  }, []);

  const pupilX = gaze.x * 3.5;
  const pupilY = gaze.y * 2.5;

  return (
    <svg
      aria-hidden="true"
      className={className}
      ref={faceRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isReacting
          ? 'scale(.9) rotate(-4deg)'
          : isHovered
            ? 'scale(1.12) rotate(2deg)'
            : 'scale(1)',
        filter: isHovered
          ? 'drop-shadow(0 0 10px rgba(56,189,248,.8))'
          : 'drop-shadow(0 2px 3px rgba(2,8,23,.28))',
        transition: 'transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease',
      }}
    >
      <defs>
        <linearGradient id={`${gradientId}-sky`} x1="8" y1="6" x2="92" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={`${gradientId}-shine`} x1="50" y1="3" x2="50" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity=".3" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="25" fill={`url(#${gradientId}-sky)`} />
      <rect x="2" y="2" width="96" height="96" rx="25" stroke="white" strokeOpacity=".46" strokeWidth="2" />
      <path d="M27 3h46c11 0 20 9 22 20H5C7 12 16 3 27 3Z" fill={`url(#${gradientId}-shine)`} />

      {[34, 66].map((eyeX) => (
        <g
          key={eyeX}
          style={{
            transform: `translateY(${isBlinking ? 7 : 0}px) scaleY(${isBlinking ? 0.08 : 1})`,
            transformOrigin: `${eyeX}px 43px`,
            transition: 'transform 110ms ease-in-out',
          }}
        >
          <ellipse cx={eyeX} cy="42" rx="12" ry="14" fill="#F8FAFC" />
          <circle
            cx={eyeX + pupilX}
            cy={42 + pupilY}
            r="7"
            fill="#08090D"
            style={{ transition: 'cx 90ms ease-out, cy 90ms ease-out' }}
          />
          {!isBlinking && (
            <circle
              cx={eyeX + pupilX - 2}
              cy={39 + pupilY}
              r="2.3"
              fill="#fff"
              style={{ transition: 'cx 90ms ease-out, cy 90ms ease-out' }}
            />
          )}
        </g>
      ))}

      <path
        d={isReacting ? 'M36 62 Q50 78 64 62' : 'M38 63 Q50 74 62 63'}
        stroke="#082F49"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
