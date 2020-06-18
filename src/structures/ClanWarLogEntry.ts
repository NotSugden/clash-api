import WarClan from './WarClan';
import ClashAPI from '..';

export default class ClanWarLogEntry {
	public clan: WarClan;
	public endedTimestamp: number;
	public opponent: WarClan;
	public result: 'win' | 'tie' | 'lose';
	public teamSize: number;

	private api: ClashAPI;

	constructor(api: ClashAPI, data: { [key: string]: any }) {
		Object.defineProperty(this, 'api', { value: api });
		this.clan = new WarClan(this.api, data.clan);
		this.endedTimestamp = new Date(data.endTime).getTime();
		this.opponent = new WarClan(this.api, data.opponent);
		this.result = data.result;
		this.teamSize = data.teamSize;
	}

	get endedAt() {
		return new Date(this.endedTimestamp);
	}
}

	