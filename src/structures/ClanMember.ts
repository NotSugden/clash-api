import { Clan } from './Clan';
import ClashAPI from '..';
import { IconURLOptions, League } from '../util/Interfaces';
import Util from '../util/Util';

export default class ClanMember {

	public clan: Clan | null;
	public clanRank: number;
	public donations: {
		recieved: number;
		sent: number;
	};
	public league: League
	public previousClanRank: number;
	public role: 'member' | 'elder' | 'coLeader';
	public tag: string;
	public trophies: number;
	public username: string;
	public versusTrophies: number;
	public xpLevel: number;

	private api: ClashAPI;

	constructor(api: ClashAPI, data: { [key: string]: any }, clan?: Clan) {
		Object.defineProperty(this, 'api', { value: api });
		this.clan = clan || null;
		this.patch(data);
	}

	patch(data: { [key: string]: any }) {
		this.clanRank = data.clanRank;
		this.donations = {
			recieved: data.donationsReceived,
			sent: data.donations
		};
		this.league = {
			name: data.league.name,
			id: data.league.id,
			iconURL(size: IconURLOptions) {
				return Util.iconURL(size, data.league.iconUrls);
			}
		};
		this.previousClanRank = data.previousClanRank;
		this.role = data.role;
		this.tag = data.tag;
		this.trophies = data.trophies;
		this.versusTrophies = data.versusTrophies;
		this.username = data.name;
		this.xpLevel = data.expLevel;
	}
}