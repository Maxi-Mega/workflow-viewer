export interface IStep {
  isBetween(): boolean;
  // getTotalDuration returns the number of milliseconds this step represents
  getTotalDuration(endTime: Date): number;
}

export class Step implements IStep {
  public readonly name: string;
  // When the Step is fully initialized, startPending is perforce defined.
  public startPending: Date | undefined;
  public endPending: Date | undefined;
  public startActive: Date | undefined;
  public endActive: Date | undefined;

  public constructor(
    stepName: string,
    startPending: Date | undefined,
    endPending: Date | undefined,
    startActive: Date | undefined,
    endActive: Date | undefined
  ) {
    this.name = stepName;
    this.startPending = startPending;
    this.endPending = endPending;
    this.startActive = startActive;
    this.endActive = endActive;
  }

  /*constructor(stepName: string, rawStep: Record<string, string>) {
    this.name = stepName;
    this.start = new Date(rawStep.start);
    if (rawStep.end !== undefined) {
      this.end = new Date(rawStep.end);
    }
  }*/

  // isActive returns whether the step is in its active state or not
  public isActive(): boolean {
    return this.startActive != undefined;
  }

  public isBetween(): boolean {
    return false;
  }

  public getPendingDuration(endTime: Date): number {
    if (this.endPending != undefined) {
      return this.endPending.getTime() - (this.startPending as Date).getTime();
    }
    return endTime.getTime() - (this.startPending as Date).getTime();
  }

  public getActiveDuration(endTime: Date): number {
    if (this.startActive === undefined) {
      return 0;
    }
    if (this.endActive != undefined) {
      return this.endActive.getTime() - (this.startActive as Date).getTime();
    }
    return endTime.getTime() - (this.startActive as Date).getTime();
  }

  public getTotalDuration(endTime: Date): number {
    /*if (this.endActive != undefined) {
      return this.endActive.getTime() - (this.startPending as Date).getTime();
    }
    if (this.endPending != undefined) {
      return this.endPending.getTime() - (this.startPending as Date).getTime();
    }
    return endTime.getTime() - (this.startPending as Date).getTime();*/
    return this.getPendingDuration(endTime) + this.getActiveDuration(endTime);
  }

  // getCurrentEndTime return the latest known state of the Step
  public getCurrentEndTime(): Date {
    if (this.endActive !== undefined) {
      return this.endActive;
    }
    if (this.startActive !== undefined) {
      return this.startActive;
    }
    if (this.endPending !== undefined) {
      return this.endPending;
    }
    return this.startPending as Date;
  }
}

export class BetweenStep implements IStep {
  private readonly duration: number;

  constructor(previousEnd: Date, nextStart: Date) {
    this.duration = nextStart.getTime() - previousEnd.getTime();
  }

  public isBetween(): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getTotalDuration(endTime: Date): number {
    return this.duration;
  }
}

export class StepUtils {
  public static sortSteps(steps: Array<Step>): Array<Step> {
    steps.sort((step1, step2): number => {
      return (
        (step1.startPending as Date).getTime() -
        (step2.startPending as Date).getTime()
      );
    });
    return steps;
  }
}
