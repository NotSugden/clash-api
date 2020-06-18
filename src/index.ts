import Collection from '@discordjs/collection';
import fetch from 'node-fetch';
import { DEFAULT_OPTIONS, API_URL } from './Constants';
import { Clan } from './structures/Clan';
import ClanMember from './structures/ClanMember';
import ClanWarLogEntry from './structures/ClanWarLogEntry';
import { ClanSearchOptions } from './util/Interfaces';

const route = (version: number, endpoint: string) => `${API_URL}/v${version}/${endpoint}`;

class ClashAPI {
	public token: string;
	public options: Options;

	constructor(token: string, options?: Options) {
		this.options = Object.assign(options || {}, DEFAULT_OPTIONS);
		Object.defineProperty(this, 'token', {
			value: token,
			writable: false
		});
	}

	public async searchClans(options: ClanSearchOptions) {
		const filter = [];
		if (options.labelIDs) filter.push(`labelIds=${options.labelIDs.join(',')}`);
		if (typeof options.locationID === 'number') filter.push(`locationId=${options.locationID}`);
		if (typeof options.maxMembers === 'number') filter.push(`maxMembers=${options.maxMembers}`);
		if (typeof options.minLevel === 'number') filter.push(`minClanLevel=${options.minLevel}`);
		if (typeof options.minMembers === 'number') filter.push(`minMembers=${options.minMembers}`);
		if (typeof options.minTrophies === 'number') filter.push(`minClanPoints=${options.minTrophies}`);
		if (options.name) filter.push(`name=${options.name}`);
		if (options.warFrequency) filter.push(`warFrequency=${options.warFrequency}`);
		if (options.limit) filter.push(`limit=${options.limit}`);
		
		if (!filter.length) throw new Error('No search query provided');

		const json = await this.request(route(this.options.apiVersion, `clans?${filter.join('&')}`));
		return new Collection<string, Clan>(json.items.map(clan => [clan.tag, new Clan(this, clan)]));
	}

	public async fetchClanWarlog(clan: string | Clan, limit?: number) {
		if (typeof clan === 'string') clan = await this.fetchClan(clan);

		if (!clan.publicWarLog) throw new Error('This clan does not have a public war log.');

		let endpoint = `clans/${encodeURIComponent(clan.tag)}/warlog`;
		if (typeof limit === 'number') endpoint += `?limit=${encodeURIComponent(limit)}`;
		const json = await this.request(route(this.options.apiVersion, endpoint));
		return json.items.map(entry => new ClanWarLogEntry(this, entry));
	}

	public async fetchClanMembers(tag: string, limit?: number) {
		if (tag.charAt(0) !== '#') tag = `#${tag}`;
		let endpoint = `clans/${encodeURIComponent(tag)}/members`;
		if (typeof limit === 'number') endpoint += `?limit=${encodeURIComponent(limit)}`;
		const members = (await this.request(route(this.options.apiVersion, endpoint))).items
			.map(rawMember => [rawMember.tag, new ClanMember(this, rawMember)]);
		return new Collection<string, ClanMember>(members);
	}

	public async fetchClan(tag: string) {
		if (tag.charAt(0) !== '#') tag = `#${tag}`;
		const json = await this.request(route(this.options.apiVersion, `clans/${encodeURIComponent(tag)}`));
		return new Clan(this, json);
	}

	private async request(route: string, method = 'GET'): Promise<{ [key: string]: any }> {
		const response = await fetch(route, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json'
			},
			method
		});

		const text = await response.text();

		if (response.status >= 400) {
			if (response.status === 404) {
				throw new Error('Clan not found.');
			}
			if (text.length) {
				throw JSON.parse(text);
			} else throw new Error(`Unknown API Response, status code ${response.status}`);
		}

		return JSON.parse(text) as unknown as { [key: string]: any};
	}
}

module.exports = ClashAPI;

export default ClashAPI;

export interface Options {
	apiVersion?: number;
}