import { CanIUseFeature } from "./CanIUseFeature";

export default class CanIUseFeatureCollection {
	private features: CanIUseFeature[] = [];

	constructor(features: CanIUseFeature[]) {
		this.features = features;
	}

	getLength(): number {
		return this.features.length;
	}

	get(i: number) {
		return this.features[i];
	}

	getPageCount(itemsPerPage: number = 10): number {
		if (this.features.length === 0 || itemsPerPage < 1) return 0;
		return Math.ceil(this.features.length / itemsPerPage);
	}

	getPage(pageNumber: number, itemsPerPage: number = 10) {
		if (pageNumber < 1 || itemsPerPage < 1 || (pageNumber - 1) * itemsPerPage >= this.features.length) return [];

		return [...this.features].splice((pageNumber - 1) * itemsPerPage, itemsPerPage);
	}
}