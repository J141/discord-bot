export interface CanIUseFeature {
  title?: string;
  description?: string;
  spec?: string;
  support?: {[agentName: string]: CanIUseFeatureSupportEntry|CanIUseFeatureSupportEntry[]};
  stats?: {[agent: string]: {[version: string]: string}};
  mdnStatus?: CanIUseFeatureMDNStatus;
  mdn_url?: string;
}

export interface CanIUseFeatureSupportEntry {
  version_added: string|boolean;
  notes?: string|string[];
}

export interface CanIUseFeatureMDNStatus {
  experimental: boolean;
  standard_track: boolean;
  deprecated: boolean;
}