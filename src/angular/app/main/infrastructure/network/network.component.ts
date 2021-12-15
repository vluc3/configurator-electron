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

    /**
     * Register icons that not exists in ui toolkit
     */
    nx.graphic.Icons.registerFontIcon("cfg-globe", "configurator", "\ue903", 32);
    nx.graphic.Icons.registerFontIcon("cfg-network-time", "configurator", "\ue909", 32);
    nx.graphic.Icons.registerFontIcon("cfg-envelope", "configurator", "\ue908", 32);
    nx.graphic.Icons.registerFontIcon("cfg-phone-office", "configurator", "\ue907", 32);
    nx.graphic.Icons.registerFontIcon("cfg-file-certificate", "configurator", "\ue906", 32);
    nx.graphic.Icons.registerFontIcon("cfg-openvpn", "configurator", "\ue905", 32);
    nx.graphic.Icons.registerFontIcon("cfg-ip-lock", "configurator", "\ue904", 32);
    nx.graphic.Icons.registerFontIcon("cfg-ldap", "configurator", "\ue923", 32);
    nx.graphic.Icons.registerFontIcon("cfg-nrpe", "configurator", "\ue926", 32);
    nx.graphic.Icons.registerFontIcon("cfg-elastic", "configurator", "\ue924", 32);
    nx.graphic.Icons.registerFontIcon("cfg-debian-repo", "configurator", "\ue921", 32);
    nx.graphic.Icons.registerFontIcon("cfg-proxy", "configurator", "\ue922", 32);
    nx.graphic.Icons.registerFontIcon("cfg-nagios", "configurator", "\ue925", 32);

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
    const store = this.stateService.getCurrent();
    const hosts = store.hosts;
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
          vm.services.forEach((serviceId, index) => {
            let nX = nodeX + r * Math.cos(index * t - Math.PI / 2);
            let nY = nodeY + r * Math.sin(index * t - Math.PI / 2);
            sNodes.push(id);
            nodes.push({
              id,
              name: `Service - ${store.services[serviceId].name}`,
              device_type: store.services[serviceId].icon,
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
