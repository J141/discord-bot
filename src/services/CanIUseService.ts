import axios from "axios";
import cache from "axios-cache-adapter";
import * as canIUseLite from "caniuse-lite";
import { CanIUseFeature } from "../interfaces/caniuse/CanIUseFeature";
import CanIUseFeatureCollection from "../interfaces/caniuse/CanIUseFeatureCollection";

export default class CanIUseService {
	private static instance: CanIUseService;
	private api = axios.create({
		adapter: cache.setupCache({
			maxAge: 15 * 60 * 1000
		}).adapter
	});

	static getInstance(): CanIUseService {
		if (!this.instance) {
			this.instance = new CanIUseService();
		}

		return this.instance;
	}

	async getMatchingFeatures(searchString: string): Promise<CanIUseFeatureCollection | null> {
		const featureIdsResponse = await this.api.get<{featureIds: string[]}>(`https://caniuse.com/process/query.php?search=${searchString}`);

		if (featureIdsResponse.status !== 200) return null;

		const featureIds = featureIdsResponse.data.featureIds;
		const featureIdsQueryString = featureIds.join(",");
		const featuresResponse = await this.api.get<CanIUseFeature[]>(`https://caniuse.com/process/get_feat_data.php?type=support-data&feat=${featureIdsQueryString}`);

		if (featuresResponse.status !== 200) return null;
		const features = featuresResponse.data;

		// Enrich title data using caniuse-lite package for core features, as those do not come with a title from the API.
		for (let i = 0; i < features.length; i++) {
			if (features[i].title === undefined) {
				const featureFromDb = canIUseLite.feature(canIUseLite.features[featureIds[i]]);

				if (featureFromDb.title) features[i].title = featureFromDb.title;
			}
		}

		return new CanIUseFeatureCollection(features);
	}
}