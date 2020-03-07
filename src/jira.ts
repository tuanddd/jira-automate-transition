import fetch from "node-fetch";

const options = (token: string) => {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`
    }
  };
};

class JiraClient {
  constructor(private token: string) {
    this.token = token;
  }

  request = async <T = any>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any | undefined
  ) => {
    const res = body
      ? await fetch(url, {
          method,
          body: JSON.stringify(body),
          ...options(this.token)
        })
      : await fetch(url, { method, ...options(this.token) });
    if (res.status === 200) {
      const json = await res.json();
      return json as T;
    }
  };
}

export { JiraClient };
