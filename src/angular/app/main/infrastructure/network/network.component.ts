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

    const nodes = [{
      id: 0,
      name: `Mobile`,
      device_type: "phone",
      color: "gray",
      fixed: true,
      x: 0,
      y: 0
    }, {
      id: 1,
      name: `Internet`,
      device_type: "cloud",
      color: "gray",
      fixed: true,
      x: 100,
      y: 0
    }, {
      id: 2,
      name: `Firewall`,
      device_type: "firewall",
      color: "gray",
      fixed: true,
      x: 200,
      y: 0
    }];

    const links: any[] = [{
      color: "gray",
      source: 0,
      target: 1
    }, {
      color: "gray",
      source: 1,
      target: 2
    }];

    const nodeSet = [];
    let nodesLength = 1;
    const hosts = this.stateService.getCurrent().hosts;
    const dmzHosts = hosts.filter(host => {
      nodesLength += host.virtualMachines.length;
      return host.network === Network.DMZ;
    });
    const expHosts = hosts.filter(host => {
      return host.network === Network.EXPLOITATION;
    });
    let id = 3;
    const center = {x: 200, y: 0};
    let i = 0;
    const nodeT = 2 * Math.PI / nodesLength;
    [dmzHosts, expHosts].forEach(network => {
      network.forEach(host => {
        host.virtualMachines.forEach(vm => {
          i++;
          let nodeX = center.x + 200 * Math.cos(i * nodeT + Math.PI);
          let nodeY = center.y + 200 * Math.sin(i * nodeT + Math.PI);
          nodes.push({
            id,
            name: `VM - ${vm.name} - ${vm.ip}`,
            device_type: "server",
            color: host.network === Network.DMZ ? "black" : null,
            fixed: true,
            x: nodeX,
            y: nodeY
          });
          links.push({
            color: host.network === Network.DMZ ? "black" : null,
            source: 2,
            target: id
          });
          const sNodes = [id];
          id++;
          const t = 2 * Math.PI / vm.services.length;
          const r = 40;
          vm.services.forEach((service, index) => {
            let nX = nodeX + r * Math.cos(index * t - Math.PI / 2);
            let nY = nodeY + r * Math.sin(index * t - Math.PI / 2);
            sNodes.push(id);
            nodes.push({
              id,
              name: `Service - ${service.name}`,
              device_type: service.icon,
              color: "red",
              fixed: true,
              x: nX,
              y: nY
            });
            links.push({
              color: "red",
              width: 1,
              source: sNodes[0],
              target: id
            });
            id++;
          });
          if (sNodes.length > 1) {
            nodeSet.push({
              nodes: sNodes,
              x: nodeX,
              y: nodeY,
              name: `VM - ${vm.name} - ${vm.ip}`,
              iconType: "server",
              color: host.network === Network.DMZ ? "black" : null
            });
          }
        });
      });
    });

    const topologyData: any = {
      nodes,
      nodeSet,
      links
    };

    const app = new nx.ui.Application();

    // app must run inside a specific container. In our case this is the one with id="topology-container"
    app.container(this.diagramDiv.nativeElement);

    // configuration object
    const topologyConfig = {
      adaptive: true,
      // if true, the nodes' icons are shown, a dot is shown instead
      showIcon: true,
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
      }
    };

    // instantiate Topology class
    const topology = new nx.graphic.Topology(topologyConfig);

    // load topology data from app/data.js
    topology.data(topologyData);

    // bind the topology object to the app
    topology.attach(app);
  }
}

// const drawMethod = (model, link) => {
//   console.log(model, link);
//   var _offset = link.getOffset();
//   // @ts-ignore
//   var offset = new nx.geometry.Vector(0, _offset);
//   var width = (link._width || 1) * (link._stageScale || 1);
//   var line = link.reverse() ? link.line().negate() : link.line();
//   var d;
//   var pathEL = link.view('path');
//   var lineEl = link.view('line');
//   var lineBGEl = link.view('line_bg');
//
//   var path = [];
//   var n, point;
//   n = line.normal().multiply(_offset * 3);
//   point = line.center().add(n);
//   path.push('M', line.start.x, line.start.y);
//   path.push('Q', point.x, point.y, line.end.x, line.end.y);
//   d = path.join(' ');
//
//   return d;
// }

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
