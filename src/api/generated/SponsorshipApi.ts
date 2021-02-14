import { AxiosPromise } from "axios";
import {
  CompanySponsorControllerApiFactory,
  PageCompanySponsorDto,
} from "./api";

class SponsorshipApi {
  static getCompanies(
    page: number,
    size: number,
    town?: string
  ): AxiosPromise<PageCompanySponsorDto> {
    const companySponsorApi = CompanySponsorControllerApiFactory();
    return companySponsorApi.getCompanyHouseEntry(page, size, town);
  }
}

export default SponsorshipApi;
