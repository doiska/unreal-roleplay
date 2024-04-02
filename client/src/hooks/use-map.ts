import {
  useRef,
} from "react";

export function useMap() {
  const parentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const getCurrentMousePosition = () => {
    const stage = stageRef.current;
    const position = stage.getPointerPosition();
    if (!position) {
      return;
    }

    const { x, y } = position;

    return {
      x: x / stage.scaleX() - stage.x() / stage.scaleX(),
      y: y / stage.scaleY() - stage.y() / stage.scaleY()
    };
  }

  return {
    parentRef,
    stageRef,
    mapRef,
    getCurrentMousePosition
  }
}
