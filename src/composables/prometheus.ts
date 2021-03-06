import { reactive } from "vue";
import { getEnv } from "@/env";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { TimeoutError } from "@/errors/TimeoutError";

const requestTimeout = 1000;

async function parseResponse(
  response: AxiosResponse | Error
): Promise<PrometheusHalfData | Error> {
  if ((await response) instanceof Error) {
    let isTimeout = false;
    if ("message" in response) {
      console.warn("Failed to fetch data:", response.message);
      if (response.message.startsWith("timeout of")) {
        isTimeout = true;
      }
    } else {
      console.warn("Error while fetching data.");
    }
    if (isTimeout) {
      return new TimeoutError(
        "Request failed, check the browser console for more informations."
      );
    }
    return new Error(
      "Request failed, check the browser console for more informations."
    );
  }
  // console.info("Response:", response);
  const resp = response as AxiosResponse;
  if (resp.status != 200) {
    console.warn("Failed to fetch data:", resp.statusText);
    return new Promise(() => {
      console.log("in promise");
      new Error("Request failed: " + resp.statusText);
    });
  }
  return resp.data;
}

async function doRequest(url: string): Promise<PrometheusHalfData | Error> {
  const axiosResponse = await axios
    .get(url, { timeout: requestTimeout })
    .catch((reason) => new Error(reason));
  return parseResponse(axiosResponse);
}

export function useFetchPrometheus() {
  let url = "/prometheus_target";
  url += url.endsWith("/") ? "api/v1/" : "/api/v1/";
  url += "query?query=%time_event%&time=%time%";

  const env = getEnv();

  const state = reactive(new PrometheusFetch());

  const fetchData = async function (time: Date): Promise<PrometheusFetch> {
    state.loading = true;
    const fetchUrl = url.replace("%time%", String(time.getTime() / 1000));
    const startData = await doRequest(
      fetchUrl.replace("%time_event%", env.VITE_START_TIME_EVENT)
    );
    if (startData instanceof Error) {
      state.errors.push(
        "Failed to fetch start time data: " + startData.message
      );
    } else {
      // console.info("Start data:", startData);
    }
    const endData = await doRequest(
      fetchUrl.replace("%time_event%", env.VITE_END_TIME_EVENT)
    );
    if (endData instanceof Error) {
      state.errors.push("Failed to fetch end time data: " + endData.message);
    } else {
      // console.info("End data:", endData);
    }
    if (state.errors.length === 0) {
      // No errors
      state.data = new PrometheusData(
        startData as PrometheusHalfData,
        endData as PrometheusHalfData
      );
    }

    state.loading = false;
    return state;
  };

  return {
    fetchData,
  };
}

class PrometheusFetch {
  public loading: boolean;
  public errors: Array<string>;
  public data: PrometheusData | null;

  constructor() {
    this.loading = false;
    this.errors = new Array<string>();
    this.data = null;
  }

  public asErrors(): boolean {
    return this.errors.length > 0;
  }
}

export class PrometheusData {
  public readonly start: PrometheusHalfData;
  public readonly end: PrometheusHalfData;

  constructor(start: PrometheusHalfData, end: PrometheusHalfData) {
    this.start = start;
    this.end = end;
  }
}

class PrometheusHalfData {
  public status: string | undefined;
  public data: PrometheusResponseData | undefined;
}

class PrometheusResponseData {
  public resultType: string | undefined;
  public result: Array<PrometheusResult> | undefined;
}

class PrometheusResult {
  public metric: PrometheusMetric | undefined;
  public value: [number, string] | undefined; // [float, string]: only the string is the good value
}

class PrometheusMetric {
  public __name__: string | undefined;
  public datastripId: string | undefined;
  public exported_instance: string | undefined;
  public exported_job: string | undefined;
  public instance: string | undefined;
  public job: string | undefined;
  public jobId: string | undefined;
  public namespace: string | undefined;
  public priority: string | undefined;
  public state: string | undefined;
  public task: string | undefined;
  public workflowId: string | undefined;
}
