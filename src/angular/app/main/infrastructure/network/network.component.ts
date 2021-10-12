import {AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {StateService} from "../../../common/service/state.service";
import {SubscriberComponent} from "../../../common/abstract/subscriber.component";
import {Network} from "../../../common/model/network";

@Component({
  selector: 'div[network]',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkComponent extends SubscriberComponent implements OnInit, AfterViewInit {

  @HostBinding('class') clazz = 'network';

  @ViewChild('diagram') diagramDiv: ElementRef<HTMLDivElement>;

  constructor(
    private stateService: StateService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    nx.graphic.Icons.registerFontIcon("cfg-globe", "configurator", "\ue903", 32);
    nx.graphic.Icons.registerFontIcon("cfg-network-time", "configurator", "\ue909", 32);
    nx.graphic.Icons.registerFontIcon("cfg-envelope", "configurator", "\ue908", 32);
    nx.graphic.Icons.registerFontIcon("cfg-phone-office", "configurator", "\ue907", 32);
    nx.graphic.Icons.registerFontIcon("cfg-file-certificate", "configurator", "\ue906", 32);
    nx.graphic.Icons.registerFontIcon("cfg-openvpn", "configurator", "\ue905", 32);
    nx.graphic.Icons.registerFontIcon("cfg-ip-lock", "configurator", "\ue904", 32);

    const topologyData: any = {
      nodes: [],
      links: [],
      nodeSet: []
    };
    const hosts = this.stateService.getCurrent().hosts;
    const dmzHosts = hosts.filter(host => host.network === Network.DMZ);
    const expHosts = hosts.filter(host => host.network === Network.EXPLOITATION);

    let links = [];
    let id = 0;
    let nodeSet = [];
    const groups: any = {};
    [{hosts: expHosts, x: -40}, {hosts: dmzHosts, x: 40}].forEach(conf => {

      let dY = 200;
      conf.hosts.forEach(host => {
        let dX = conf.x;
        const hostNodes = [];
        host.virtualMachines.forEach(vm => {
          const nodes = [];
          const nodesData = [];
          vm.services.forEach(service => {
            nodesData.push({
              id,
              name: `S - ${service.name}`,
              device_type: service.icon,
              color: "red",
              fixed: true
            });
            nodes.push(id);
            id++;
          });
          if (nodes.length > 0) {
            const t = 360 / nodes.length;
            const r = 10;
            nodesData.forEach((node, index) => {
              node.x = dX + r * Math.cos(index * t);
              node.y = dY + r * Math.sin(index * t);
            });
            topologyData.nodes.push(...nodesData);
            // nodeSet.push({
            //   nodes: nodes,
            //   x: dX,
            //   y: dY,
            //   // name: `VM - ${vm.name}`,
            //   iconType: "server",
            //   group: host.name
            // });
            hostNodes.push(...nodes);

          }
          // else {
            topologyData.nodes.push({
              id,
              x: dX,
              y: dY,
              name: `VM - ${vm.name}`,
              device_type: "server",
              color: "blue"
            });
          nodes.forEach(node => topologyData.links.push({"source": node, "target": id, width: 5, color: "red"}))
            hostNodes.push(id);
            id++;
          // }
          dX += 25;
        });
        groups[host.name] = hostNodes;
        dY += 10;
      });
    });

    nodeSet.forEach(ns => {
      topologyData.nodeSet.push({
        id,
        nodes: ns.nodes,
        x: ns.x,
        y: ns.y,
        name: ns.name,
        iconType: "server",
        color: "blue"
      });
      groups[ns.group] = groups[ns.group] || [];
      groups[ns.group].push(id);
      id++;
    });

    console.log(topologyData);

    const app = new nx.ui.Application();

    // app must run inside a specific container. In our case this is the one with id="topology-container"
    app.container(this.diagramDiv.nativeElement);

    // configuration object
    const topologyConfig = {
      adaptive: true,
      // configuration for nodes
      width: this.diagramDiv.nativeElement.clientWidth,
      height: this.diagramDiv.nativeElement.clientHeight,
      nodeConfig: {
        label: "model.name",
        iconType: "model.device_type",
        color: "model.color",
      },
      // configuration for links
      linkConfig: {
        linkType: "straight",
        color: "model.color",
        width: "model.width"
      },
      nodeSetConfig: {
        label: 'model.name',
        iconType: 'model.iconType',
        color: "model.color"
      },
      // if true, the nodes' icons are shown, a dot is shown instead
      showIcon: true,
    };

    // instantiate Topology class
    const topology = new nx.graphic.Topology(topologyConfig);

    // load topology data from app/data.js
    topology.data(topologyData);

    // bind the topology object to the app
    topology.attach(app);

    // @ts-ignore
    topology.on('topologyGenerated', (sender: any, events: any) => {
      const groupsLayer = sender.getLayer('groups');
      Object.keys(groups).forEach(name => {
        const nodes = groups[name].map(id => {
          const nodesLayer = sender.getLayer("nodes");
          const nodeSetLayer = sender.getLayer("nodeSet");
          let node = nodesLayer.getNode(id);
          if (!node) {
            node = nodeSetLayer.getNodeSet(id);
            node.on("expandNode", (nodeSet) => {
              const nodes = nodeSet.nodes.call(nodeSet);
              Object.keys(nodes).forEach(key => group.addNode(nodes[key]));
            });
            node.on("beforeCollapseNode", (nodeSet) => {
              const nodes = nodeSet.nodes.call(nodeSet);
              Object.keys(nodes).forEach(key => group.removeNode(nodes[key]));
            });
          }
          return node;
        });
        const group = groupsLayer.addGroup({
          nodes: nodes,
          label: name,
          shapeType: 'rect',
          color: 'rgb(67,91,119)',
          blockDrawing: true
        });
        group.on('clickGroupLabel', (sender: any, events: any) => {
          console.log(group.nodes());
        }, this);
      });
    });
  }
}

declare namespace nx {

}

declare namespace nx.ui {
  class Application {
    container(element: HTMLElement): void;
  }
}

declare namespace nx.graphic {
  class Topology {
    constructor(data: any);

    data(data: any): void;

    attach(app: nx.ui.Application): void;

    getLayer(groups: string): any;
  }

  class Icons {
    static registerIcon(name: string, url: string, width: number, height: number): void;

    static registerFontIcon(name: string, fontfamily: string, fontCharacter: string, fontSize: number): void;
  }
}
