import {
  useEffect,
  useState
} from "react";

export function useZoom({ mapRef }: {
  mapRef: any,
}) {
  const [currentZoom, setCurrentZoom] = useState(1);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const handler = (e: any) => {
      e.evt.preventDefault();
      const scaleBy = 1.2;
      const oldScale = map.scaleX();
      const pointer = map.getStage().getPointerPosition() as any;
      const mousePointTo = {
        x: (pointer.x - map.x()) / oldScale,
        y: (pointer.y - map.y()) / oldScale
      };
      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

      map.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale
      };

      setCurrentZoom(newScale);

      map.position(newPos);
      map.batchDraw();
    };

    map.on("wheel", handler);

    return () => map.off("wheel", handler);
  }, [mapRef]);

  return {
    currentZoom,
    setCurrentZoom
  };
}
