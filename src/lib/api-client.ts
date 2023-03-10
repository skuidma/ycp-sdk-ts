import axios, {AxiosError} from "axios";
import {ApiHttpException} from "../exceptions/api-http.exception";

export class ApiClient {
    readonly API_BASE_URL = 'https://youcanpay.com/api';

    private getUrl(endpoint: string): string {
        return `${this.API_BASE_URL}//${endpoint.replace(/^\//, '')}`
    }

    /**
     * Endpoint without the base url
     * e.g.: Pass /tokenize to POST to https://youcanpay.com/api/tokenize
     * @param endpoint
     * @param payload
     */
    async post(endpoint: string, payload: object) {
        try {
            const response = await axios.post(this.getUrl(endpoint), payload, {
                headers: {
                    "User-Agent": "skuid-ycp-sdk-ts",
                }
            });
        } catch (e) {
            if (e instanceof AxiosError) {
                // Error is due to networking problem
                if (e.cause) {
                    throw e.cause;
                }
                // Error is due to invalid API response
                throw new ApiHttpException(e.status ?? 0, e.response?.data ?? {});
            }
        }
    }
}