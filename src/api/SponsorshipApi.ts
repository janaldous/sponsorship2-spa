import { AxiosPromise } from "axios";
import {
  CompanySearchResponse,
  CompanySponsorControllerApiFactory,
  CompanySponsorDetailResponse,
  CompanySponsorDto,
  PageCompanySponsorDto,
  UkTierSponsorControllerApiFactory,
} from "./generated/api";

class SponsorshipApi {
  static getCompanies(
    page: number,
    size: number,
    zone: number
  ): AxiosPromise<PageCompanySponsorDto> {
    const companySponsorApi = CompanySponsorControllerApiFactory();
    return companySponsorApi.getCompanySponsor(page, size, zone);
  }

  static getCompany(id: number): AxiosPromise<CompanySponsorDetailResponse> {
    const companySponsorApi = CompanySponsorControllerApiFactory();
    return companySponsorApi.getCompanySponsorById(id);
  }

  static getUKTierSponsor(id: number): AxiosPromise<CompanySearchResponse> {
    const ukTierSponsorApi = UkTierSponsorControllerApiFactory();
    return ukTierSponsorApi.getUKTierSponsor(id);
  }
}

export default SponsorshipApi;
