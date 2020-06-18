import Collection from '@discordjs/collection';
import ClanWarMember from './ClanWarMember';
import ClashAPI from '..';
import { IconURLOptions } from '../util/Interfaces';
import Util from '../util/Util';

export default class WarClan {
	public attacks: number;
	public destructionPercentage: number;
	public level: number;
	public name: string;
	public stars: number;
	public tag: string;
	public xpEarned: string;
	public members: Collection<string, ClanWarMember> | null;

	private _badgeURLs: {
		tiny: string;
		small: string;
		medium: string;
	}
	private api: ClashAPI;

	constructor(api: ClashAPI, data: { [key: string]: any }) {
		Object.defineProperty(this, 'api', { value: api });
		this._badgeURLs = data.badgeUrls;

		this.attacks = data.attacks ?? null;
		this.destructionPercentage = data.destructionPercentage;
		this.level = data.clanLevel;
		this.name = data.name;
		this.stars = data.stars;
		this.tag = data.tag;
		this.xpEarned = data.expEarned ?? null;

		if (data.members) {
			this.members = new Collection<string, ClanWarMember>();
			for (const rawMember of data.members) {
				this.members.set(rawMember.tag, new ClanWarMember(this.api, rawMember));
			}
		}
		
	}

	badgeURL(size: IconURLOptions) {
		return Util.iconURL(size, this._badgeURLs);
	}

	fetchClan() {
		return this.api.fetchClan(this.tag);
	}
}