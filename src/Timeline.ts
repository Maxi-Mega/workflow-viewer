import type { Step } from "@/Steps";

export class Timeline {
  public readonly name: string;
  public readonly steps: Array<Step>;

  public constructor(name: string, firstStep?: Step) {
    this.name = name;
    this.steps = firstStep ? new Array<Step>(firstStep) : [];
  }

  public addStep(step: Step): void {
    this.steps.push(step);
  }

  public getStep(stepName: string): Step | undefined {
    return this.steps.find((step) => {
      if (step && !step.isBetween()) {
        return (step as Step).name === stepName;
      }
      return false;
    });
  }
}
