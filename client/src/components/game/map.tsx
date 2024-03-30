import {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Layer,
  Image,
  Stage,
  Group,
  Transformer,
  Arc
} from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import {
  useColyseusRoom,
  useColyseusState
} from "@/colyseus";
import { MapContextMenu } from "@/components/map-context-menu.tsx";

const map = "https://i.pinimg.com/originals/8f/a9/21/8fa921d8a63955010c4371d247b881ab.png";

interface Props extends ComponentPropsWithoutRef<typeof Stage> {
  image?: string;
}

const sceneWidth = 1920;
const sceneHeight = 1080;

export function GameMap({ image = map, ...props }: Props) {
  const [loadedImage] = useImage(image);
  const [stageSize, setStageSize] = useState({ width: 1000, height: 1000 });

  const players = useColyseusState(state => state.players);

  const parentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const resize = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        const height = parentRef.current.offsetHeight;

        setStageSize({
          width,
          height

        });
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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

      map.position(newPos);
      map.batchDraw();
    };

    map.on("wheel", handler);

    return () => map.off("wheel", handler);
  }, [stageRef]);

  return (
      <MapContextMenu>
        <div ref={parentRef} className="relative border flex-1 rounded min-w-0 min-h-0 overflow-hidden">
          <Stage draggable={true} ref={stageRef} width={stageSize.width} height={stageSize.height} {...props}>
            <Layer ref={mapRef}>
              <Image
                  image={loadedImage}
                  fillPatternImage={loadedImage}
                  fillPatternOffset={{ x: -sceneWidth / 2, y: -sceneHeight / 2 }}
              />
              {[...players.entries()].map(([id, player]) => (
                  <Token
                      id={id}
                      x={player.position.x}
                      y={player.position.y}
                      image="https://www.gravatar.com/avatar/"
                  />
              ))}
            </Layer>
          </Stage>
        </div>
      </MapContextMenu>
  );
}

const Token = ({ id, x, y, image }: {
  id: string,
  x: number,
  y: number,
  image: string
}) => {
  const [loadedImage] = useImage(image);
  const [isSelected, setIsSelected] = useState(false);
  const shapeRef = useRef<Konva.Group | null>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const room = useColyseusRoom(state => state.room);

  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      room?.send("move", { id, x: position.x, y: position.y });
    }, 1000);
    return () => clearTimeout(timer);
  }, [position]);

  return (
      <>
        <Group
            ref={shapeRef}
            x={x} y={y}
            draggable={true}
            onClick={() => setIsSelected(!isSelected)}
            onDragEnd={(e) => {
              setPosition({
                x: e.target.x(),
                y: e.target.y()
              });
            }}
        >
          <Image image={loadedImage} width={50} height={50} />
          <Arc
              x={50}
              y={25}
              innerRadius={50}
              outerRadius={150}
              angle={60}
              rotation={-30}
              fill="grey"
              opacity={0.5}
          />
        </Group>
        {isSelected && (
            <Transformer
                ref={trRef}
                flipEnabled={false}
                resizeEnabled={false}
                boundBoxFunc={(oldBox, newBox) => {
                  // limit resize
                  if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
            />)
        }
      </>
  );
};
