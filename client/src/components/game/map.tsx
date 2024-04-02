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
  Text,
  Rect
} from "react-konva";
import { Html } from "react-konva-utils";

import useImage from "use-image";
import Konva from "konva";
import {
  useColyseusRoom,
  useColyseusState,
  useMyState,
} from "@/colyseus";
import { MapContextMenu } from "@/components/map-context-menu.tsx";
import { useMap } from "@/hooks/use-map.ts";
import { useZoom } from "@/hooks/use-zoom.ts";
import { useAssertSize } from "@/hooks/use-assert-size.ts";
import {
  InputPrompt,
  usePrompt
} from "@/hooks/use-prompt.tsx";

interface Props extends ComponentPropsWithoutRef<typeof Stage> {
  image: string;
}

const sceneWidth = 1920;
const sceneHeight = 1080;

export function GameMap({ image, ...props }: Props) {
  const [loadedImage] = useImage(image);

  const tokens = useColyseusState(state => state.tokens);

  const {
    mapRef,
    stageRef,
    parentRef
  } = useMap();

  const stageSize = useAssertSize({ parentRef });
  useZoom({ mapRef });

  return (
      <MapContextMenu>
        <div ref={parentRef} className="relative border flex-1 rounded min-w-0 min-h-0 overflow-hidden">
          <Stage
              onClick={console.log} draggable={true} ref={stageRef} width={stageSize.width}
              height={stageSize.height} {...props}>
            <Layer ref={mapRef}>
              <Image
                  image={loadedImage}
                  fillPatternImage={loadedImage}
                  fillPatternOffset={{ x: -sceneWidth / 2, y: -sceneHeight / 2 }}
              />
              {[...tokens.entries()].map(([id, token]) => (
                  <Token
                      id={id}
                      x={token.position.x}
                      y={token.position.y}
                      image="https://www.gravatar.com/avatar/"
                  />
              ))}
            </Layer>
          </Stage>
        </div>
      </MapContextMenu>
  );
}

const RectWithText = ({ icon, x, y, width, height, text, ...rest }: {
  x: number,
  y: number,
  width: number,
  height: number,
  text: string
}) => {
  const groupRef = useRef<Konva.Group | null>(null);

  return (
      <Group
          {...rest}
          ref={groupRef}
          x={x}
          y={y}
          width={width}
          height={height}
      >

        <Rect
            fill="#c0c0c0"
            stroke="black"
            strokeWidth={0.1}
            cornerRadius={1}
            width={width}
            height={height}
        />
        <Text
            verticalAlign="middle"
            align="center"
            fontSize={5}
            text={text}
            width={width}
            height={height}
        />
        <Image
            image={icon}
            width={6}
            height={6}
            x={2}
            y={height - 8}
        />
      </Group>);
};

const Token = ({ id, x, y, image }: {
  id: string,
  x: number,
  y: number,
  image: string
}) => {
  const [loadedImage] = useImage(image);
  const [heartImage] = useImage(
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjQyNDIiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1oZWFydCI+PHBhdGggZD0iTTE5IDE0YzEuNDktMS40NiAzLTMuMjEgMy01LjVBNS41IDUuNSAwIDAgMCAxNi41IDNjLTEuNzYgMC0zIC41LTQuNSAyLTEuNS0xLjUtMi43NC0yLTQuNS0yQTUuNSA1LjUgMCAwIDAgMiA4LjVjMCAyLjMgMS41IDQuMDUgMyA1LjVsNyA3WiIvPjwvc3ZnPg=="
  );
  const [isSelected, setIsSelected] = useState(false);
  const shapeRef = useRef<Konva.Group | null>(null);
  const trRef = useRef<Konva.Transformer>(null);

  // TODO: remove it

  //TODO: move to parent
  const room = useColyseusRoom(state => state.room);
  const colyseusState = useColyseusState(state => state);
  const myState = useMyState();


  const { dialog, open } = usePrompt();

  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      room?.send("position", { targetId: id, x: position.x, y: position.y });
    }, 1000);
    return () => clearTimeout(timer);
  }, [position]);

  //TODO: select multi https://konvajs.org/docs/select_and_transform/Basic_demo.html

  const width = 50;
  const height = 50;
  const canViewHealth = myState?.token.id === id || myState?.role === "master";
  const health = colyseusState.tokens.get(id)?.health || 0;

  return (
      <>
        <Group
            ref={shapeRef}
            x={x}
            y={y}
            width={width}
            height={height}
            draggable={true}
            onDragEnd={(e) => {
              setPosition({
                x: e.target.x(),
                y: e.target.y()
              });
            }}
        >
          <Image
              onClick={() => setIsSelected(!isSelected)}
              width={width}
              height={height}
              image={loadedImage}
          />
          <Group>
            {!isSelected && canViewHealth && (
                <>
                  <RectWithText
                      icon={heartImage}
                      onClick={() => open()} text={`Health ${health}`} x={0} y={-15} width={width} height={10}
                  />
                </>
            )}
          </Group>
        </Group>
        {isSelected && (
            <Transformer
                ref={trRef}
                flipEnabled={false}
                onTransformEnd={e => {
                  console.log(e);
                }}
            />
        )}
        <Html>
          <InputPrompt
              dialog={dialog}
              handleSubmit={data => {
                room?.send("command", `stats set ${id} health ${data}`);
              }}
          />
        </Html>
      </>
  );
};
