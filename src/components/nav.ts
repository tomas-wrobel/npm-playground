import Component from "../classes/component";
import {FileDeleteEvent, FileOpenEvent} from "../classes/file-events";
import fileExplorer from "./file-explorer";
import preview from "./preview";
import "../assets/fontello.css";
import getIcon from "./get-icon";

class Nav extends Component.create({
    tag: "nav",
    events: {
        open: FileOpenEvent,
        delete: FileDeleteEvent
    },
    props: {
        tabs: ["index.tsx"],
        current: "index.tsx"
    }
}) {
    init() {
        fileExplorer.on("open", e => {
            this.open(e.file);
        });

        fileExplorer.on("delete", e => {
            const index = this.tabs.indexOf(e.file);

            if (index > -1) {
                this.current = this.tabs[this.tabs.length - 1];
                this.tabs.splice(index, 1);
                this.update();
            }
        });

        this.update();
    }

    update() {
        this.element.innerHTML = "";

        for (const tab of this.tabs) {
            const button = document.createElement("button");
            button.onclick = this.open.bind(this, tab);
            button.append(getIcon(tab), tab, this.closeButton(tab));
            button.dataset.tab = tab;
            this.element.appendChild(button);
        }

        this.activate();

        this.element.appendChild(document.createElement("div"));

        const button = document.createElement("button");
        button.textContent = "▶";
        button.onclick = () => {
            preview.emit("run");
        };
        this.element.appendChild(button);
    }

    open(tab: string) {
        if (this.tabs.indexOf(tab) === -1) {
            this.tabs.push(tab);
        }
        this.current = tab;
        this.update();
        this.emit("open", tab);
    }

    activate() {
        for (const active of this.element.getElementsByClassName("active")) {
            active.classList.remove("active");
        }
        if (this.current) {
            this.element.querySelector(`[data-tab="${this.current}"]`)!.classList.add("active");
        }
    }

    closeButton(tab: string) {
        const element = document.createElement("span");

        element.classList.add("close");
        element.onclick = e => {
            e.stopPropagation();

            if (this.tabs.length === 1) {
                return;
            }
            
            this.tabs.splice(this.tabs.indexOf(tab), 1);

            if (tab === this.current) {
                this.open(this.tabs[this.tabs.length - 1]);
            } else {
                this.update();
            }
            this.emit("delete", this.current);
        };

        return element;
    }
}

export default new Nav();