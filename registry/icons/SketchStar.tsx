import type { SVGProps } from "react";
const SvgSketchStar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m12 3.5 2.6 6.1 6.6.5-5 4.2 1.6 6.4-5.8-3.5-5.8 3.5 1.6-6.4-5-4.2 6.6-.5Z" />
  </svg>
);
export default SvgSketchStar;
