import {AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {StateService} from "../../common/service/state.service";
import {SubscriberComponent} from "../../common/abstract/subscriber.component";
import {takeUntil} from "rxjs/operators";
import {Network} from "../../common/model/network";

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
    this.stateService.state$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      console.log(value);
    });
  }

  ngAfterViewInit(): void {
    const topologyData: any = {
      nodes: [],
      links: []
    };
    const hosts = this.stateService.getHosts();
    let id = 0;
    const dmzIds: number[] = [];
    const expIds: number[] = [];
    let x = 400;
    let y = -50;
    hosts.forEach(host => {
      topologyData.nodes.push({
        id,
        x,
        y,
        name: `${host.name} - ${id}`,
        device_type: "server",
        color: "grey"
      });
      if (host.network === Network.EXPLOITATION) {
        expIds.push(id);
      } else {
        dmzIds.push(id);
      }
      id++;
      x += 10;
    });

    if (expIds.length > 0) {
      topologyData.nodes.push({
          id,
          x: 425,
          y: -100,
          name: `EXP - ${id}`,
          device_type: "switch",
          color: "red"
        }
      );
      expIds.forEach(expId => {
        topologyData.links.push({
          source: id,
          target: expId
        });
      });
      expIds.push(id);
      id++;
    }

    if (dmzIds.length > 0) {
      topologyData.nodes.push({
        id,
        x: 525,
        y: -100,
        name: `DMZ - ${id}`,
        device_type: "switch",
        color: "red"
      });
      dmzIds.forEach(dmzId => {
        topologyData.links.push({
          source: id,
          target: dmzId
        });
      })
      dmzIds.push(id);
      id++;
    }

    const app = new nx.ui.Application();

    // app must run inside a specific container. In our case this is the one with id="topology-container"
    app.container(this.diagramDiv.nativeElement);

    // configuration object
    const topologyConfig = {
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
      if (dmzIds.length > 0) {
        const nodes = dmzIds.map(id => sender.getNode(id));
        const group = groupsLayer.addGroup({
          nodes: nodes,
          label: 'DMZ',
          shapeType: 'rect',
          color: 'rgb(67,91,119)'
        });
        group.on('clickGroupLabel', (sender: any, events: any) => {
          console.log(group.nodes());
        }, this);
      }
      if (expIds.length > 0) {
        const nodes = expIds.map(id => sender.getNode(id));
        const group = groupsLayer.addGroup({
          nodes: nodes,
          label: 'EXP',
          shapeType: 'rect',
          color: 'rgb(67,91,119)'
        });
        group.on('clickGroupLabel', (sender: any, events: any) => {
          console.log(group.nodes());
        }, this);
      }

      const nodes1 = [
        sender.getNode(6),
        sender.getNode(7),
        sender.getNode(8),
        sender.getNode(9)
      ];
      dmzIds.forEach(id => {

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
}
