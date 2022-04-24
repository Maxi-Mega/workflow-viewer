export interface IStep {
  isBetween(): boolean;
  getDuration(): number;
}

export class Step implements IStep {
  public name: string;
  public start: Date;
  public end: Date | undefined;

  constructor(stepName: string, rawStep: Record<string, string>) {
    this.name = stepName;
    this.start = new Date(rawStep.start);
    if (rawStep.end !== undefined) {
      this.end = new Date(rawStep.end);
    }
  }

  public isBetween(): boolean {
    return false;
  }

  public getDuration(): number {
    if (this.end != undefined) {
      return this.end.getTime() - this.start.getTime();
    }
    return Date.now() - this.start.getTime();
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

  public getDuration(): number {
    return this.duration;
  }
}
