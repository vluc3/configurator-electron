import {AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {StateService} from "../../../common/service/state.service";
import {SubscriberComponent} from "../../../common/abstract/subscriber.component";

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

    // // @ts-ignore
    // nx.define("ExtendLink", nx.graphic.Topology.Link, {
    //   view: function (view) {
    //     view.content.push({
    //       name: 'startText',
    //       type: 'nx.graphic.Text',
    //       props: {
    //         value: "",
    //         x: 20,
    //         y: -5
    //       },
    //       methods: {
    //         init: function (options) {
    //           this.inherited(options);
    //           this.view("icon").watch("scale", this._updateScale, this);
    //           this._updateScale("scale", this.view("icon").scale());
    //         },
    //         dispose: function () {
    //           this.view("icon").unwatch("scale", this._updateScale, this);
    //           this.inherited();
    //         },
    //         _updateScale: function (pname, pvalue) {
    //           pvalue = pvalue || 1;
    //           var statusIcon = this.view("status");
    //           statusIcon.sets({
    //             width: 16 * pvalue,
    //             height: 16 * pvalue,
    //             x: 20 * pvalue,
    //             y: -5 * pvalue
    //           });
    //         },
    //         setModel: function (model) {
    //           this.inherited(model);
    //           var status = model.get('status') || 'normal';
    //           this.view('status').set('src', statusIconMap[status]);
    //         }
    //       }
    //     });
    //     return view;
    //   }
    // });
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
      nodes: [{
        id: 0,
        name: `Mobile`,
        device_type: "phone",
        color: "black",
        fixed: true,
        x: -200,
        y: 100

      }, {
        id: 1,
        name: `Internet`,
        device_type: "cloud",
        color: "black",
        fixed: true,
        x: -150,
        y: 100
      }, {
        id: 2,
        name: `Firewall`,
        device_type: "firewall",
        color: "black",
        fixed: true,
        x: -100,
        y: 100
      }, {
        id: 3,
        name: `VM Proxy`,
        device_type: "server",
        color: "black",
        fixed: true,
        x: -150,
        y: 150
      },

        {
          id: 4,
          name: `Service DNS/DHCP`,
          device_type: "cfg-globe",
          color: "black",
          fixed: true,
          x: -90,
          y: 175
        }, {
          id: 5,
          name: `Service NTP`,
          device_type: "cfg-network-time",
          color: "black",
          fixed: true,
          x: -110,
          y: 175
        }, {
          id: 6,
          name: `VM 1`,
          device_type: "server",
          color: "black",
          fixed: true,
          x: -100,
          y: 150
        },

        {
          id: 7,
          name: `Service EJBCA`,
          device_type: "cfg-file-certificate",
          color: "black",
          fixed: true,
          x: -40,
          y: 175
        }, {
          id: 8,
          name: `Service Mail`,
          device_type: "cfg-envelope",
          color: "black",
          fixed: true,
          x: -60,
          y: 175
        }, {
          id: 9,
          name: `VM 2`,
          device_type: "server",
          color: "black",
          fixed: true,
          x: -50,
          y: 150
        }],
      nodeSet: [{
        nodes: [4, 5, 6],
        x: -100,
        y: 150,
        name: "VM 1",
        iconType: "server",
        color: "black"
      }, {
        nodes: [7, 8, 9],
        x: -50,
        y: 150,
        name: "VM 2",
        iconType: "server",
        color: "black"
      }],
      links: [{
        color: "black",
        width: 1,
        source: 0,
        target: 1
      }, {
        color: "black",
        width: 1,
        source: 1,
        target: 2
      }, {
        // label: "192.168.1.2 - DMZ - 192.168.1.30",
        color: "black",
        width: 1,
        source: 2,
        target: 3
      }, {
        // label: "192.168.1.2 - EXPLOITATION - 192.168.1.22",
        color: "black",
        width: 1,
        source: 2,
        target: 6
      }, {
        color: "red",
        width: 1,
        source: 4,
        target: 6
      }, {
        color: "red",
        width: 1,
        source: 5,
        target: 6
      },

        {
          // label: "192.168.1.2 - EXPLOITATION - 192.168.1.23",
          color: "black",
          width: 1,
          source: 2,
          target: 9
        }, {
          color: "red",
          width: 1,
          source: 7,
          target: 9
        }, {
          color: "red",
          width: 1,
          source: 8,
          target: 9
        }]
    };

    /*
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
*/

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
        label: "model.label",
        linkType: "model.linkType",
        color: "model.color",
        width: "model.width",
        // drawMethod,
      },
      nodeSetConfig: {
        label: 'model.name',
        iconType: 'model.iconType',
        color: "model.color",
        collapsed: "model.collapsed"
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
    // topology.on('topologyGenerated', (sender: any, events: any) => {
    //   const groupsLayer = sender.getLayer('groups');
    //   Object.keys(groups).forEach(name => {
    //     const nodes = groups[name].map(id => {
    //       const nodesLayer = sender.getLayer("nodes");
    //       const nodeSetLayer = sender.getLayer("nodeSet");
    //       let node = nodesLayer.getNode(id);
    //       if (!node) {
    //         node = nodeSetLayer.getNodeSet(id);
    //         node.on("expandNode", (nodeSet) => {
    //           const nodes = nodeSet.nodes.call(nodeSet);
    //           Object.keys(nodes).forEach(key => group.addNode(nodes[key]));
    //         });
    //         node.on("beforeCollapseNode", (nodeSet) => {
    //           const nodes = nodeSet.nodes.call(nodeSet);
    //           Object.keys(nodes).forEach(key => group.removeNode(nodes[key]));
    //         });
    //       }
    //       return node;
    //     });
    //     const group = groupsLayer.addGroup({
    //       nodes: nodes,
    //       label: name,
    //       shapeType: 'rect',
    //       color: 'rgb(67,91,119)',
    //       blockDrawing: true
    //     });
    //     group.on('clickGroupLabel', (sender: any, events: any) => {
    //       console.log(group.nodes());
    //     }, this);
    //   });
    // });
  }
}

const drawMethod = (model, link) => {
  console.log(model, link);
  var _offset = link.getOffset();
  // @ts-ignore
  var offset = new nx.geometry.Vector(0, _offset);
  var width = (link._width || 1) * (link._stageScale || 1);
  var line = link.reverse() ? link.line().negate() : link.line();
  var d;
  var pathEL = link.view('path');
  var lineEl = link.view('line');
  var lineBGEl = link.view('line_bg');

  var path = [];
  var n, point;
  n = line.normal().multiply(_offset * 3);
  point = line.center().add(n);
  path.push('M', line.start.x, line.start.y);
  path.push('Q', point.x, point.y, line.end.x, line.end.y);
  d = path.join(' ');

  return d;
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
