import { MatDialogRef } from '@angular/material/dialog';
import {
  ChangeDetectionStrategy,
  OnInit,
  Component,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
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
Diagram.Inject(BpmnDiagrams);
/**
 * Sample for Connectors
 */

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('diagram') diagram: DiagramComponent;

  snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };
  constraints: DiagramConstraints;

  controler: number = 0; //TROCAR
  controler2: number = -1; //TROCAR
  phasesCount: number;
  phases: Phases;

  ngOnInit(): void {
    this.constraints = DiagramConstraints.Bridging;
    this.getPhases();
    this.phasesCount = 9;
  }

  public created(): void {
    this.createDiagramFlow();
    //this.createBasicNodes();
    //this.diagram.constraints = DiagramConstraints.Bridging;
    //this.diagram.refresh();
    this.diagram.fitToPage();
  }

  createDiagramFlow(): void {
    let incrementOffsetX = 0;
    let incrementOffsetY = 0;

    this.phases.phase.forEach((p) => {
      incrementOffsetX += 150;
      incrementOffsetY += 50;
      this.createNodes(p, incrementOffsetX, incrementOffsetY);
    });

    this.phases.phase.forEach((p) => {
      if (p.index < this.phasesCount) this.createConnectors(p.index);
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
        shape: {
          type: 'Bpmn',
          shape: 'Activity',
          activity: { activity: 'Task' },
        },
        width: 100,
      };
      label = 'teste';
    } else {
      nodeModel = {
        shape: {
          type: 'Bpmn',
          shape: 'Gateway',
          gateway: { type: 'Exclusive' },
        },
        width: 50,
      };
      label = '';
    }

    this.diagram.addNode({
      shape: nodeModel.shape,
      annotations: [{ content: label }],
      id: 'node' + phase.index,
      offsetX: incrementOffsetX,
      offsetY: incrementOffsetY,
      width: nodeModel.width,
      ports: this.getNodePorts(phase.index),
    });

    if (phase.aproval) {
      this.createAprovalConnectors(phase.index);
    }
  }

  getNodePorts(index: number): PointPortModel[] {
    const ports: PointPortModel[] = [
      {
        id: 'port' + index + 4,
        shape: 'Circle',
        offset: { x: 0.2, y: 1 },
      },
      {
        id: 'port' + index + 3,
        shape: 'Circle',
        offset: { x: 0.35, y: 1 },
      },
      {
        id: 'port' + index + 2,
        shape: 'Circle',
        offset: { x: 0.5, y: 1 },
      },
      {
        id: 'port' + index + 1,
        shape: 'Circle',
        offset: { x: 0.65, y: 1 },
      },
      {
        id: 'port' + index + 0,
        shape: 'Circle',
        offset: { x: 0.8, y: 1 },
      },
    ];

    return ports;
  }

  createConnectors(index: number): void {
    this.diagram.addConnector({
      id: 'connector' + index,
      sourceID: 'node' + index,
      targetID: 'node' + (index + 1),
      annotations: [
        {
          content: this.getConnectorsContent(index),
          verticalAlignment: 'Bottom',
        },
      ],
    });
    this.diagram.connectors.find((c) => c.id === 'connector' + index).type =
      'Orthogonal';
    this.diagram.connectors.find((c) => c.id === 'connector' + index).segments =
      [{ type: 'Orthogonal', length: this.controler, direction: 'Right' }];
  }

  getConnectorsContent(index: number): string {
    if (this.phases.phase.find((p) => p.index === index + 1).aproval === true) {
      return '';
    } else {
      return 'Sim';
    }
  }

  createAprovalConnectors(index: number): void {
    this.controler2++;
    this.controler += 5;

    this.phases.phase.forEach((p) => {
      if (p.index < index && !p.aproval) {
        this.diagram.addConnector({
          id: 'connector1' + p.index + this.controler2,
          sourceID: 'node' + index,
          targetID: 'node' + p.index,
          targetPortID: 'port' + p.index + this.controler2,
          annotations: [{ content: 'Não', verticalAlignment: 'Bottom' }],
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

  getPhases(): void {
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

    this.phases = phases;
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
