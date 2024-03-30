import { ViewImage } from "@/components/view-image.tsx";
import { JSONContent } from "@tiptap/core";

const traverseNodes = (nodes: any) => {
  if (!nodes) {
    return null;
  }

  return nodes.map(convertNodeToElement);
};

const handleMark = (
    element: any,
    mark: any,
    node: any
) => {
  switch (mark.type) {
    case "textStyle":
      const { color } = mark.attrs;
      return <span key={node.id} style={{ color }}>{element}</span>;
    case "bold":
      return <strong key={node.id}>{element}</strong>;
    case "italic":
      return <em key={node.id}>{element}</em>;
    case "code":
      return <code key={node.id} className="graf code">{element}</code>;
    case "link":
      const { href, target } = mark.attrs;
      return <a
          key={node.id}
          className="graf markup--anchor markup--anchor-readOnly"
          target={target}
          rel="noopener noreferrer nofollow"
          href={href}
      >{element}</a>;
    default:
      console.warn(
          "no handler for mark",
          mark
      );
      return element;
  }
};

function convertNodeToElement(node: JSONContent) {
  switch (node.type) {
    case "heading": {
      switch (node.attrs?.level) {
        case 1:
          return <h1 key={node.id}>{traverseNodes(node.content)}</h1>;
        case 2:
          return <h2 key={node.id}>{traverseNodes(node.content)}</h2>;
        case 3:
          return <h3 key={node.id}>{traverseNodes(node.content)}</h3>;
      }
      break;
    }
    case "blockquote":
      return <blockquote key={node.id}>{traverseNodes(node.content)}</blockquote>;
    case "paragraph": {
      return (<p key={node.id}>
        {traverseNodes(node.content)}
      </p>);
    }
    case "text": {
      const textElement = <>{node.text}</>;

      if (node.marks && node.marks.length > 0) {
        return node.marks.reduce(
            (
                element: any,
                mark: any
            ) => {
              return handleMark(
                  element,
                  mark,
                  node
              );
            },
            textElement
        );
      }
      return textElement;
    }
    case "custom-image": {
      console.log(node);
      return <ViewImage key={node.id} {...node.attrs} />
    }
    case "hardBreak": {
      return <br key={node.id} />;
    }
    default: {
      console.error(
          "no handler for node",
          node
      );
      return null;
    }
  }
}

export function Renderer({ raw }: {
  raw: any
}) {

  return (
      <div>
        {traverseNodes(raw.content)}
      </div>
  );
}
