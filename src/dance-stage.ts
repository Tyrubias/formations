import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import paper from 'paper';

@customElement('dance-stage')
export class DanceStage extends LitElement {
  static override styles = css`
    canvas[resize] {
      width: 100%;
      height: 100%;
    }

    #stage-wrapper {
      width: 75vw;
      height: 75vh;
      border: 1px solid black;
    }

    .active-tool {
      color: green;
      box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
    }
  `;

  addDancerTool?: paper.Tool;

  removeDancerTool?: paper.Tool;

  override firstUpdated(): void {
    const canvas: HTMLCanvasElement | null =
      this.renderRoot.querySelector('canvas[id="stage"]');

    if (canvas) {
      paper.setup(canvas);

      drawGrid(paper.view.bounds, 30);

      paper.view.onResize = () => {
        paper.project.layers.at(0)?.activate();
        drawGrid(paper.view.bounds, 30);
      };

      const dancerLayer = new paper.Layer();

      this.addDancerTool = new paper.Tool();

      this.addDancerTool.onMouseUp = (event: paper.ToolEvent) => {
        const previousLayer = paper.project.activeLayer;
        dancerLayer.activate();

        const dancer = new paper.Path.Circle(event.downPoint, 20);
        dancer.name = 'dancer';
        dancer.fillColor = new paper.Color('red');

        previousLayer.activate();
      };

      this.removeDancerTool = new paper.Tool();

      this.removeDancerTool.onMouseUp = (event: paper.ToolEvent) => {
        const previousLayer = paper.project.activeLayer;
        dancerLayer.activate();

        const target = event.item;
        if (target) {
          if (target.name === 'dancer') {
            target.remove();
          }
        }

        previousLayer.activate();
      };

      paper.view.play();
    }
  }

  activateAddDancer(event: Event): void {
    const activeToolButtons = this.renderRoot.querySelectorAll('.active-tool');
    activeToolButtons.forEach((value) => value.classList.remove('active-tool'));

    (event.target as HTMLButtonElement | null)?.classList.add('active-tool');

    this.addDancerTool?.activate();
  }

  activateRemoveDancer(event: Event): void {
    const activeToolButtons = this.renderRoot.querySelectorAll('.active-tool');
    activeToolButtons.forEach((value) => value.classList.remove('active-tool'));

    (event.target as HTMLButtonElement | null)?.classList.add('active-tool');

    this.removeDancerTool?.activate();
  }

  protected override render(): TemplateResult {
    return html`<div id="stage-wrapper">
        <canvas id="stage" resize></canvas>
      </div>
      <div id="controls">
        <button @click=${this.activateAddDancer}>Add Dancer</button>
        <button @click=${this.activateRemoveDancer}>Remove Dancer</button>
      </div>`;
  }
}

function drawGrid(boundingRectangle: paper.Rectangle, cellSize: number) {
  const verticalCellCount = boundingRectangle.height / cellSize;
  const horizontalCellCount = boundingRectangle.width / cellSize;

  for (let i = 0; i <= horizontalCellCount; i += 1) {
    const horizontalOffset =
      Math.ceil(boundingRectangle.left / cellSize) * cellSize;
    const horizontalPosition = horizontalOffset + i * cellSize;

    const topPoint = new paper.Point(horizontalPosition, boundingRectangle.top);
    const bottomPoint = new paper.Point(
      horizontalPosition,
      boundingRectangle.bottom
    );

    const line = new paper.Path.Line(topPoint, bottomPoint);
    line.strokeColor = new paper.Color('black');
  }

  for (let i = 0; i <= verticalCellCount; i += 1) {
    const verticalOffset =
      Math.ceil(boundingRectangle.top / cellSize) * cellSize;
    const verticalPosition = verticalOffset + i * cellSize;

    const leftPoint = new paper.Point(boundingRectangle.left, verticalPosition);
    const rightPoint = new paper.Point(
      boundingRectangle.right,
      verticalPosition
    );

    const line = new paper.Path.Line(leftPoint, rightPoint);
    line.strokeColor = new paper.Color('black');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dance-stage': DanceStage;
  }
}
