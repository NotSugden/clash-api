import ClashAPI from '..';

export default class ClanWarAttack {
	public attackerTag: string;
	public defenderTag: string;
	public destructionPercentage: number;
	public order: number;
	public stars: number;

	private api: ClashAPI;
	constructor(api: ClashAPI, data: { [key: string]: any }) {
		this.attackerTag = data.attackerTag;
		this.defenderTag = data.defenderTag;
		this.destructionPercentage = data.destructionPercentage;
		this.order = data.order;
		this.stars = data.stars;
	}
}