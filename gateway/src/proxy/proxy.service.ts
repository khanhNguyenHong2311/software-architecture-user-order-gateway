import { Injectable } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";

@Injectable()
export class ProxyService {
  async forward(req: Request, res: Response, targetBaseUrl: string): Promise<void> {
    const targetUrl = `${targetBaseUrl}${req.originalUrl}`;
    const headers = { ...req.headers };
    delete headers.host;
    delete headers["content-length"];

    try {
      const response: AxiosResponse = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers,
        validateStatus: () => true,
      });

      res.status(response.status).json(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message || "Gateway forward error";
      res.status(status).json({ statusCode: status, message });
    }
  }
}
