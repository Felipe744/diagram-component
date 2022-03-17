import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  DiagramComponent,
  NodeModel,
  HierarchicalTree,
  ConnectorModel,
  StackPanel,
  TextElement,
  Segments,
  ConnectorConstraints,
  NodeConstraints,
  PointPortModel,
  PortVisibility,
  BasicShapeModel,
  LayoutModel,
  ConnectorEditing,
} from '@syncfusion/ej2-angular-diagrams';
import {
  Diagram,
  SnapConstraints,
  SnapSettingsModel,
  randomId,
  LayerModel,
  BpmnDiagrams,
  DiagramConstraints,
} from '@syncfusion/ej2-diagrams';
import { ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';
Diagram.Inject(BpmnDiagrams);

/**
 * Sample for Connectors
 */

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @ViewChild('diagram')
  public diagram: DiagramComponent;

  public layout: LayoutModel = {
    type: 'HierarchicalTree',
    orientation: 'LeftToRight',
    verticalSpacing: 75,
    margin: { left: 90, right: 0, top: 0, bottom: 0 },
  };

  obj: NodeModel = {};

  controler: number = 0;
  controler2: number = -1;
  lstAux: string[] = [];

  public newLayers: LayerModel = {
    id: 'layer1',
    visible: true,
    //zIndex: 1000,
    addInfo: this.nodeDefaultsTeste(this.obj),
  };

  public shape: BasicShapeModel = {
    type: 'Basic',
    shape: 'Rectangle',
    cornerRadius: 10,
  };
  public snapSettings: SnapSettingsModel = {
    constraints: SnapConstraints.None,
  };

  public getNodeDefaults: Function = this.nodeDefaults.bind(this);
  public getConnectorDefaults: Function = this.connectorDefaults.bind(this);

  public setNodeTemplate: Function = this.nodeTemplate.bind(this);
  public constraints: DiagramConstraints;
  public node1Port: PointPortModel[] = [];

  getPhases(): Phases {
    let phases: Phases = {
      phase: [
        {
          name: PhasesEnum.causeAnalysis,
          enabled: true,
          aproval: false,
          index: 0,
        },
      ],
    };

    phases.phase.push({
      name: PhasesEnum.causeAnalysisAproval,
      enabled: true,
      aproval: true,
      index: 1,
    });
    phases.phase.push({
      name: PhasesEnum.actionPlanElaboration,
      enabled: true,
      aproval: false,
      index: 2,
    });
    phases.phase.push({
      name: PhasesEnum.actionPlanElaborationAproval,
      enabled: true,
      aproval: true,
      index: 3,
    });
    phases.phase.push({
      name: PhasesEnum.actionPlanExecution,
      enabled: true,
      aproval: false,
      index: 4,
    });
    phases.phase.push({
      name: PhasesEnum.actionPlanExecutionAproval,
      enabled: true,
      aproval: true,
      index: 5,
    });
    phases.phase.push({
      name: PhasesEnum.effectivenessCheck,
      enabled: true,
      aproval: false,
      index: 6,
    });
    phases.phase.push({
      name: PhasesEnum.effectivenessCheckAproval,
      enabled: true,
      aproval: true,
      index: 7,
    });
    phases.phase.push({
      name: PhasesEnum.standardization,
      enabled: true,
      aproval: false,
      index: 8,
    });
    phases.phase.push({
      name: PhasesEnum.standardizationAproval,
      enabled: true,
      aproval: true,
      index: 9,
    });

    return phases;
  }

  createDiagramFlow(): void {
    let incrementOffsetX = 0;
    let incrementOffsetY = 0;
    this.getPhases().phase.forEach((p) => {
      incrementOffsetX += 150;
      incrementOffsetY += 50;
      this.createNodes(p, incrementOffsetX, incrementOffsetY);
    });
    this.getPhases().phase.forEach((p) => {
      if (p.index < 9) this.createConnectors(p.index);
    });
  }

  createNodes(
    phase: PhasesElements,
    incrementOffsetX: number,
    incrementOffsetY: number
  ): void {
    let nodeModel: NodeModel;
    let label: string;

    if (!phase.aproval) {
      nodeModel = {
        shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task' }},
      };
      label = 'teste';
    } else {
      nodeModel = {
        shape: {
          type: 'Bpmn',
          shape: 'Gateway',
          gateway: { type: 'Exclusive' },
        },
      };
      label = '';
    }

    this.diagram.addNode({
      shape: nodeModel.shape,
      annotations: [{ content: label }],
      id: 'node' + phase.index,
      offsetX: incrementOffsetX,
      offsetY: incrementOffsetY,
      width: 100,
      ports: [
        {
          id: 'port' + phase.index + 4,
          shape: 'Circle',
          offset: { x: 0.3, y: 1 },
        },
        {
          id: 'port' + phase.index + 3,
          shape: 'Circle',
          offset: { x: 0.4, y: 1 },
        },
        {
          id: 'port' + phase.index + 2,
          shape: 'Circle',
          offset: { x: 0.5, y: 1 },
        },
        {
          id: 'port' + phase.index + 1,
          shape: 'Circle',
          offset: { x: 0.6, y: 1 },
        },
        {
          id: 'port' + phase.index + 0,
          shape: 'Circle',
          offset: { x: 0.7, y: 1 },
        },
      ],
    });

    //this.getPhases().phase.forEach((p) => {
    //    if (p.index  phase.index)
    //        this.createConnectors(p.index);
    //  });
    if (phase.aproval) {
      this.controler2++;
      this.controler += 20;
      this.createAprovalConnectors(phase.index);
    }
  }

  createConnectors(index: number, target?: string, port?: string): void {
    this.diagram.addConnector({
      id: 'connector' + index,
      sourceID: 'node' + index,
      targetID: 'node' + (index + 1),
      annotations: [{ content: 'Sim' }],
    });
    this.diagram.connectors.find((c) => c.id === 'connector' + index).type =
      'Orthogonal';
    this.diagram.connectors.find((c) => c.id === 'connector' + index).segments =
      [{ type: 'Orthogonal', length: this.controler, direction: 'Right' }];
  }

  aprovalConnectors(): void {
    this.getPhases().phase.forEach((p) => {
      if (p.aproval) {
        this.createAprovalConnectors(p.index);
      }
    });
  }

  createBasicNodes(): void {
    this.diagram.addNode({
      shape: { type: 'Basic', shape: 'Ellipse' },
      annotations: [{ content: 'start' }],
      id: 'basic1',
      offsetX: -100,
      offsetY: 400,
    });
  }

  createAprovalConnectors(index: number): void {
    this.getPhases().phase.forEach((p) => {
      if (p.index < index && !p.aproval) {
        this.diagram.addConnector({
          id: 'connector1' + p.index + this.controler2,
          sourceID: 'node' + index,
          targetID: 'node' + p.index,
          targetPortID: 'port' + p.index + this.controler2,
          annotations: [{ content: 'Não' }],
          //bridgeSpace: 100,
        });
        this.diagram.connectors.find(
          (c) => c.id === 'connector1' + p.index + this.controler2
        ).type = 'Orthogonal';
        debugger;
        this.diagram.connectors.find(
          (c) => c.id === 'connector1' + p.index + this.controler2
        ).segments = [
          { type: 'Orthogonal', length: this.controler, direction: 'Bottom' },
        ];
      }
    });
  }

  ngOnInit(): void {
    this.constraints =
DiagramConstraints.Bridging;
  }

  private nodeDefaults(node: NodeModel, diagram: Diagram): NodeModel {
    let obj: NodeModel = {};
    return obj;
  }

  private connectorDefaults(obj: ConnectorModel): void {
    obj.type = 'Bezier';
    obj.style.strokeColor = '#6f409f';
    obj.style.strokeWidth = 2;
    obj.targetDecorator = {
      style: { strokeColor: '#6f409f', fill: '#6f409f' },
    };
  }

  public created(): void {
    console.log(this.getPhases());
    //let teste: CustomPort = {text: 'teste'}
    //this.createDiagram();
    this.createDiagramFlow();
    this.createBasicNodes();
    this.diagram.refresh();
    this.diagram.fitToPage();
  }

  createDiagram(): void {
    this.diagram.addNode({
      shape: { type: 'Flow', shape: 'Terminator' },
      annotations: [{ content: 'Terminator1' }],
      id: 'sourceId',
      offsetX: 100,
      offsetY: 200,
      ports: [
        {
          id: 'port1',
          shape: 'Circle',
          offset: { x: 0, y: 0.5 },
        },
        {
          id: 'port2',
          shape: 'Circle',
          offset: { x: 1, y: 0.5 },
        },
        {
          id: 'port3',
          shape: 'Circle',
          offset: { x: 0.8, y: 10 },
        },
        {
          id: 'port4',
          shape: 'Circle',
          offset: { x: 0.5, y: 1 },
        },
        {
          id: 'port5',
          shape: 'Circle',
          offset: { x: 0.75, y: 1 },
        },
      ],
    });

    this.diagram.addNode({
      shape: { type: 'Flow', shape: 'Terminator' },
      annotations: [{ content: 'Terminator2' }],
      id: 'targetId',
      offsetX: 400,
      offsetY: 200,
    });

    this.diagram.addNode({
      shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
      id: 'decision',
      offsetX: 250,
      offsetY: 200,
    });

    let connector1: ConnectorModel = {
      targetID: 'decision',
      sourceID: 'targetId',
    };

    let connector2: ConnectorModel = {
      targetID: 'sourceId',
      sourceID: 'decision',
    };

    let connector3: ConnectorModel = {
      id: 'xD',
      targetID: 'sourceId',
      sourceID: 'decision',
      //type: 'Orthogonal',
      targetPortID: 'port3',
    };

    //this.diagram.addConnector(connector1);
    //this.diagram.addConnector(connector2);
    this.diagram.addConnector(connector3);
    this.diagram.connectors.find((c) => c.id === 'xD').type = 'Orthogonal';
    this.diagram.connectors.find((c) => c.id === 'xD').segments = [
      { type: 'Orthogonal', length: 30, direction: 'Bottom' },
    ];
    //this.diagram.connectors[0].targetPortID = 'port1';
    //this.diagram.getConnectorObject('xD').cornerRadius = 10;
    console.log(this.diagram.getConnectorObject('xD'));
    console.log(this.diagram.getConnectorObject('targetId'));
    console.log(this.diagram.getConnectorObject('sourceId'));
  }

  public nodeDefaultsTeste(obj: NodeModel): NodeModel {
    obj.style = { fill: '#37909A', strokeColor: '#024249' };
    return obj;
  }

  private nodeTemplate(node: NodeModel): StackPanel {
    return null;
  }

  private getPorts(obj: NodeModel): PointPortModel[] {
    if (obj.id === 'node2') {
      let node2Ports: PointPortModel[] = [
        {
          id: 'port1',
          offset: { x: 1, y: 0.25 },
          visibility: PortVisibility.Hidden,
        },
        {
          id: 'port2',
          offset: { x: 1, y: 0.5 },
          visibility: PortVisibility.Hidden,
        },
        {
          id: 'port3',
          offset: { x: 1, y: 0.75 },
          visibility: PortVisibility.Hidden,
        },
      ];
      return node2Ports;
    } else if (obj.id === 'node6') {
      let node6Ports: PointPortModel[] = [
        {
          id: 'port4',
          offset: { x: 0, y: 0.46 },
          visibility: PortVisibility.Hidden,
        },
        {
          id: 'port5',
          offset: { x: 0, y: 0.5 },
          visibility: PortVisibility.Hidden,
        },
        {
          id: 'port6',
          offset: { x: 0, y: 0.54 },
          visibility: PortVisibility.Hidden,
        },
      ];
      return node6Ports;
    } else {
      let ports: PointPortModel[] = [
        {
          id: 'portIn',
          offset: { x: 0, y: 0.5 },
          visibility: PortVisibility.Hidden,
        },
        {
          id: 'portOut',
          offset: { x: 1, y: 0.5 },
          visibility: PortVisibility.Hidden,
        },
      ];
      return ports;
    }
  }

  private getTextElement(text: string, color: string): TextElement {
    let textElement: TextElement = new TextElement();
    textElement.id = randomId();
    textElement.width = 80;
    textElement.height = 35;
    textElement.content = text;
    textElement.style.fill = '#6f409f';
    textElement.style.color = 'white';
    textElement.style.strokeColor = '#6f409f';
    textElement.cornerRadius = 5;
    textElement.margin = { top: 10, bottom: 10, left: 10, right: 10 };
    textElement.relativeMode = 'Object';
    return textElement;
  }
}

export interface Phases {
  phase: PhasesElements[];
}

interface PhasesElements {
  name: PhasesEnum;
  enabled: boolean;
  aproval: boolean;
  index: number;
}

export enum PhasesEnum {
  causeAnalysis = 'AnaliseDeCausa',
  causeAnalysisAproval = 'AnaliseDeCausaAprovacao',
  actionPlanElaboration = 'ElaboracaoDoPlanoDeAcao',
  actionPlanElaborationAproval = 'ElaboracaoDoPlanoDeAcaoAprovacao',
  actionPlanExecution = 'ExecucaoDoPlanoDeAcao',
  actionPlanExecutionAproval = 'ExecucaoDoPlanoDeAcaoAprovacao',
  effectivenessCheck = 'VerificacaoDeEficacia',
  effectivenessCheckAproval = 'VerificacaoDeEficaciaAprovacao',
  standardization = 'Padronizacao',
  standardizationAproval = 'PadronizacaoAprovacao',
}
