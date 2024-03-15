import { Component } from "react";
import { Button } from "@/components/ui/button.tsx";

type CommandItem = {
    name: string;
    description: string;
    image: string;
};

class CommandList extends Component<{
    items: CommandItem[];
    command: (item: any) => void;
}> {
    state = {
        selectedIndex: 0,
    };

    componentDidUpdate(oldProps: any) {
        if (this.props.items !== oldProps.items) {
            this.setState({
                selectedIndex: 0,
            });
        }
    }

    onKeyDown({ event, component }: { event: any; component: HTMLElement }) {
        if (event.key === "ArrowUp") {
            this.upHandler(component);
            return true;
        }

        if (event.key === "ArrowDown") {
            this.downHandler(component);
            return true;
        }

        if (event.key === "Enter") {
            this.enterHandler();
            return true;
        }

        return false;
    }

    upHandler(component: Element) {
        const newIndex = (this.state.selectedIndex - 1) % this.props.items.length;
        this.setState({
            selectedIndex: newIndex < 0 ? this.props.items.length - 1 : newIndex,
        });
        const item = component.firstChild?.childNodes[newIndex] as Element;
        if (item) {
            item.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }

    downHandler(component: Element) {
        const newIndex = (this.state.selectedIndex + 1) % this.props.items.length;
        this.setState({
            selectedIndex: newIndex,
        });
        const item = component.firstChild?.childNodes[newIndex] as Element;
        if (item) {
            item.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }

    enterHandler() {
        this.selectItem(this.state.selectedIndex);
    }

    selectItem(index: number) {
        const item = this.props.items[index];

        if (item) {
            this.props.command(item);
        }
    }

    render() {
        const { items } = this.props;
        return (
            <div tabIndex={0} role="menu" className="flex flex-col gap-2 w-full h-full overflow-auto p-2 rounded-md bg-secondary/10 ring-1 ring-secondary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                {items.map((item, index) => {
                    const isSelected = index === this.state.selectedIndex;

                    return (
                        <Button
                            key={index}
                            tabIndex={-1}
                            id={`command-${index}`}
                            variant={isSelected ? "outline" : "ghost"}
                            onClick={() => this.selectItem(index)}
                        >
                            <img src={item.image} alt={item.name}  />
                            <div>
                                <div >{item.name}</div>
                                <div>{item.description}</div>
                            </div>
                        </Button>
                    );
                })}
            </div>
        );
    }
}

export default CommandList;
