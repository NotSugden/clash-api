export interface WarLeague {
	id: number;
	name: string;
}

export interface Location {
	id: number;
	name: string;
	isCountry: boolean;
}

export interface Label {
	id: number;
	name: string;
	iconURL(size: IconURLOptions): string;
}

export type League = Label;

export type IconURLOptions = 'tiny' | 'small' | 'medium';

export interface ClanSearchOptions {
	name?: string;
	warFrequency?: string;
	locationID?: number;
	minMembers?: number;
	maxMembers?: number;
	minTrophies?: number;
	minLevel?: number;
	labelIDs?: number[];
	limit?: number;
}