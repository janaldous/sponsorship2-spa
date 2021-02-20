import { AxiosPromise } from "axios";
import {
  CompanySponsorControllerApiFactory,
  PageCompanySponsorDto,
} from "./api";

class SponsorshipApi {
  static getCompanies(
    page: number,
    size: number,
    zone: number
  ): AxiosPromise<PageCompanySponsorDto> {
    const companySponsorApi = CompanySponsorControllerApiFactory();
    return companySponsorApi.getCompanyHouseEntry(page, size, zone);
  }
}

export default SponsorshipApi;
