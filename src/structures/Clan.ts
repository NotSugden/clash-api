import Collection from '@discordjs/collection';
import ClanMember from './ClanMember';
import ClashAPI from '../index';
import { WarLeague, Location, Label, IconURLOptions } from '../util/Interfaces';
import Util from '../util/Util';

export class Clan {
	public description: string | null;
	public league: WarLeague;
	public labels: Label[];
	public level: number;
	public location: Location | null;
	public name: string;
	public publicWarLog: boolean;
	public requiredTrophies: number;
	public memberCount: number | null
	public members: Collection<string, ClanMember> | null;
	public tag: string;
	public trophies: number;
	public type: string;
	public warFrequency: string;
	public warLosses: number | null;
	public warTies: number | null;
	public warWins: number | null;
	public warWinStreak: number | null;
	public versusTrophies: number;

	private _badgeURLs: {
		tiny: string;
		small: string;
		medium: string;
	};
	private api: ClashAPI;

	constructor(api: ClashAPI, data: { [key: string]: any }) {
		Object.defineProperty(this, 'api', { value: api });
		this.patch(data);
	}

	badgeURL(size: IconURLOptions) {
		return Util.iconURL(size, this._badgeURLs);
	}

	async fetch() {
		const data = await this.api.fetchClan(this.tag);
		this.patch(data);
		return this;
	}

	private patch(data: { [key: string]: any }) {
		this._badgeURLs = data.badgeUrls;
		this.description = data.description ?? null;
		this.league = data.warLeague;
		this.labels = data.labels.map(label => ({
			name: label.name,
			id: label.id,
			iconURL(size: IconURLOptions) {
				return Util.iconURL(size, label.iconUrls);
			}
			
		}));
		this.level = data.clanLevel;
		this.location = data.location ?? null;
		this.name = data.name;
		this.publicWarLog = data.isWarLogPublic;
		this.requiredTrophies = data.requiredTrophies;
		this.tag = data.tag;
		this.trophies = data.clanPoints;
		this.type = data.type;
		this.warFrequency = data.warFrequency;
		this.warLosses = data.warLosses ?? null;
		this.warTies = data.warTies ?? null;
		this.warWins = data.warWins ?? null;
		this.warWinStreak = data.warWinStreak ?? null;
		this.versusTrophies = data.clanVersusPoints;

		if (this.members) {
			const members = data.memberList.slice();
			for (const member of this.members.values()) {
				const rawMember = members.find(_rawMember => _rawMember.tag === member.tag);
				if (!rawMember) {
					this.members.delete(member.tag);
					continue;
				}
				members.splice(members.indexOf(rawMember), 1);
				this.members.get(rawMember.tag)!.patch(rawMember);
			}
			for (const rawMember of members) {
				this.members.set(rawMember.tag, new ClanMember(this.api, rawMember, this));
			}
		} else if (data.memberList) {
			this.members = new Collection();
			for (const rawMember of data.memberList) {
				this.members.set(rawMember.tag, new ClanMember(this.api, rawMember, this));
			}
			this.memberCount = null;
		} else if (data.members) {
			this.memberCount = data.members;
		}
	}
}