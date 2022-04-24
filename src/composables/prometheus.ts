import { reactive } from "vue";
import { getEnv } from "@/env";
import axios from "axios";
import type { AxiosResponse } from "axios";

const requestTimeout = 1000;

async function parseResponse(
  response: AxiosResponse | Error
): Promise<PrometheusResponseData | Error> {
  if ((await response) instanceof Error) {
    if ("message" in response) {
      console.warn("Failed to fetch data:", response.message);
    } else {
      console.warn("Error while fetching data.");
    }
    return new Error(
      "Failed to fetch data, check the browser console for more informations."
    );
  }
  // console.info("Response:", response);
  const resp = response as AxiosResponse;
  if (resp.status != 200) {
    console.warn("Failed to fetch data:", resp.statusText);
    return new Promise(() => {
      console.log("in promise");
      new Error("Failed to fetch data: " + resp.statusText);
    });
  }
  return resp.data;
}

async function doRequest(url: string): Promise<PrometheusResponseData | Error> {
  const axiosResponse = await axios
    .get(url, { timeout: requestTimeout })
    .catch((reason) => new Error(reason));
  return parseResponse(axiosResponse);
}

export function useFetchPrometheus() {
  let url = "/prometheus_target";
  url += url.endsWith("/") ? "api/v1/" : "/api/v1/";
  url += "query_range?query=%time_event%&start=%start%&end=%end%&step=%step%";

  const env = getEnv();

  const state = reactive(new PrometheusFetch());

  const fetchData = async function (
    start: Date,
    end: Date,
    step: string
  ): Promise<PrometheusFetch> {
    state.loading = true;
    const fetchUrl = url
      .replace("%start%", start.toISOString())
      .replace("%end%", end.toISOString())
      .replace("%step%", step);
    const startData = await doRequest(
      fetchUrl.replace("%time_event%", env.VITE_START_TIME_EVENT)
    );
    if (startData instanceof Error) {
      state.errors.push("Failed to fetch start time data: " + startData);
    } else {
      console.info("Start data:", startData);
    }
    const endData = await doRequest(
      fetchUrl.replace("%time_event%", env.VITE_END_TIME_EVENT)
    );
    if (endData instanceof Error) {
      state.errors.push("Failed to fetch end time data: " + endData);
    } else {
      console.info("End data:", endData);
    }
    if (state.errors.length === 0) {
      // No errors
      state.data = new PrometheusData(
        startData as PrometheusResponseData,
        endData as PrometheusResponseData
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
  public readonly start: PrometheusResponseData;
  public readonly end: PrometheusResponseData;

  constructor(start: PrometheusResponseData, end: PrometheusResponseData) {
    this.start = start;
    this.end = end;
  }
}

class PrometheusResponseData {
  public resultType: string | undefined;
  public result: Array<PrometheusResult> | undefined;
}

class PrometheusResult {
  public metric: PrometheusMetric | undefined;
  public values: Array<Array<object>> | undefined; // [float, string]
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
