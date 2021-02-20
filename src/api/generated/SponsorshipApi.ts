import { AxiosPromise } from "axios";
import {
  CompanySponsorControllerApiFactory,
  CompanySponsorDto,
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

  static getCompany(id: number): AxiosPromise<CompanySponsorDto> {
    const companySponsorApi = CompanySponsorControllerApiFactory();
    return companySponsorApi.getCompanyHouseEntryById(id);
  }
}

export default SponsorshipApi;
