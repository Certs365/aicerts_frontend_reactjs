// src/components/shapes/Shape.js
import React from "react";

export const PolygonShape = () => {
  return (
    <svg
      stroke="#000000"
      viewBox="0 0 24 24" // Ensure this matches the actual dimensions of the shape
      style={{ width: "100%", height: "auto" }} // Make the SVG responsive
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21,12l-3,8H6L3,12,6,4H18Z" />
    </svg>
  );
};

export const Rectangle = () => {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="3" width="22" height="18" stroke="black" fill="none" strokeWidth={1} />
    </svg>
  );
};

export const Star = () => {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox="0 0 24 24"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const Heart = () => {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox="0 0 24 24"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const Circle = () => {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="#000000" strokeWidth="1" />
    </svg>
  );
};

export const Square = () => {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        stroke="#000000"
        strokeWidth="1"
      />
    </svg>
  );
};

export const RightArrow = () => {
  return (
    <svg
      fill="#000000"
      style={{ width: "100%", height: "auto" }}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
      xmlSpace="preserve"
    >
      <polygon points="512,261.5 298.7,90.8 298.7,218.8 0,218.8 0,304.2 298.7,304.2 298.7,432.2 " />
    </svg>
  );
};

export const LeftArrow = () => {
  return (
    <svg
    fill="#000000"
    style={{ width: "100%", height: "auto" }}
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    enableBackground="new 0 0 512 512"
    xmlSpace="preserve"
    >
      <polygon points="213.3,205.3 213.3,77.3 0,248 213.3,418.7 213.3,290.7 512,290.7 512,205.3 " />
    </svg>
  );
};

export const UpArrow = () => {
  return (
    <svg
      fill="#000000"
      style={{ width: "100%", height: "auto" }}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
      xmlSpace="preserve"
    >
      <polygon points="245,0 74.3,213.3 202.3,213.3 202.3,512 287.7,512 287.7,213.3 415.7,213.3 " />
    </svg>
  );
};

export const DownArrow = () => {
  return (
    <svg
      fill="#000000"
      style={{ width: "100%", height: "auto" }}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
      xmlSpace="preserve"
    >
      <polygon points="283.7,298.7 283.7,0 198.3,0 198.3,298.7 70.3,298.7 241,512 411.7,298.7 " />
    </svg>
  );
};

export const VerticalLine = () => {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="12" y1="0"   // Start point at the top center
        x2="12" y2="24"  // End point at the bottom center
        stroke="black"   // Line color
        strokeWidth="1"  // Line thickness
      />
    </svg>
  );
};
export const HorizontalLine = () => {
  return (
    <svg
      style={{ width: "100%", height: "auto" }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0" y1="12"   // Start point at the middle left
        x2="24" y2="12"  // End point at the middle right
        stroke="black"   // Line color
        strokeWidth="1"  // Line thickness
      />
    </svg>
  );
};



